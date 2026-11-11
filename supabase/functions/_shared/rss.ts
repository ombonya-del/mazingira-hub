// Shared feed helpers for the MazingiraKenya scanners.
// - browser-like User-Agent (several publishers 403 obvious bots)
// - one retry on 429/5xx (Google News throttles cloud IPs with 503s)
// - parses RSS, RDF and Atom
// - Google News AND Bing News builders, so no scanner depends on a single aggregator

export type FeedItem = { title: string; link: string; desc: string; pubDate: string | null; source: string };
export type Feed = { url: string; label: string };

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36 MazingiraKenyaScanner/2.0";

const NAMED: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", ndash: "–", mdash: "—",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", laquo: "«", raquo: "»", eacute: "é", egrave: "è", uuml: "ü", ouml: "ö", ccedil: "ç" };
function entities(s: string): string {
  // twice, because feeds often double-encode (&amp;#8220;)
  for (let k = 0; k < 2; k++) {
    s = s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&([a-z]+);/gi, (m, name) => NAMED[name.toLowerCase()] ?? m);
  }
  return s;
}
const decode = (s: string) => entities(s.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

function pick(block: string, tag: string): string | null {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? decode(m[1]) : null;
}

export const googleNews = (q: string, label = "Google News") =>
  ({ url: `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-KE&gl=KE&ceid=KE:en`, label });
export const bingNews = (q: string, label = "Bing News") =>
  ({ url: `https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss&cc=KE`, label });

export async function fetchFeed(feed: Feed): Promise<{ items: FeedItem[]; status: string }> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(feed.url, {
        headers: { "User-Agent": UA, "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, */*" },
        signal: AbortSignal.timeout(10000),
      });
      if ((r.status === 429 || r.status >= 500) && attempt === 0) { await new Promise((ok) => setTimeout(ok, 2000)); continue; }
      if (!r.ok) return { items: [], status: String(r.status) };
      const xml = await r.text();
      const atom = !/<item[\s>]/i.test(xml) && /<entry[\s>]/i.test(xml);
      const blocks = xml.split(atom ? /<entry[\s>]/i : /<item[\s>]/i).slice(1);
      const items = blocks.map((b) => {
        const title = pick(b, "title");
        let link = atom ? (b.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? "") : (pick(b, "link") || "").split("<")[0].trim();
        // Bing wraps the real article URL in a redirect: ...&url=<encoded>&...
        const wrapped = link.match(/[?&]url=([^&]+)/);
        if (link.includes("bing.com/news/apiclick") && wrapped) link = decodeURIComponent(wrapped[1]);
        const desc = pick(b, "description") || pick(b, "summary") || "";
        const pubDate = pick(b, "pubDate") || pick(b, "published") || pick(b, "updated") || pick(b, "dc:date");
        const source = pick(b, "source") || pick(b, "News:Source") || feed.label;
        return title && link ? { title, link, desc, pubDate, source } : null;
      }).filter(Boolean) as FeedItem[];
      return { items, status: String(r.status) };
    } catch (e) {
      // a timeout or network error is not retried: a hung feed must not eat the time budget
      return { items: [], status: "err:" + String(e).slice(0, 50) };
    }
  }
  return { items: [], status: "err:retries" };
}

// Fetch all feeds IN PARALLEL (Supabase kills a function after ~150s, so sequential
// fetching of 10+ feeds with timeouts and retries could run out the clock on its own).
// debug is keyed by label (made unique) so every dead feed is visible.
export async function fetchAll(feeds: Feed[]) {
  const results = await Promise.all(feeds.map((f) => fetchFeed(f)));
  const debug: Record<string, string> = {};
  const all: FeedItem[] = [];
  const seen = new Set<string>();
  feeds.forEach((f, i) => {
    let key = f.label, n = 2;
    while (key in debug) key = `${f.label} #${n++}`;
    const res = results[i];
    debug[key] = `${res.status}/${res.items.length}`;
    for (const it of res.items) if (!seen.has(it.link)) { seen.add(it.link); all.push(it); }
  });
  return { all, debug };
}

// Stop starting new Claude calls once this much wall-clock time has passed, so the
// function always returns its JSON report before Supabase's limit cuts it off.
export const TIME_BUDGET_MS = 110_000;
