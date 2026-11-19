#!/usr/bin/env python3
"""scan-sentiment: also store the feed snippet (used by translate-raia gists + news-digest)."""
import sys
p=sys.argv[1]; s=open(p,encoding="utf-8").read()
def rep(o,n):
    global s
    if s.count(o)!=1: sys.exit("anchor missing: "+o[:70])
    s=s.replace(o,n)
rep('const cand: { source: string; type: string; title: string; url: string; published_at: string }[] = [];',
    'const cand: { source: string; type: string; title: string; url: string; published_at: string; snippet: string | null }[] = [];')
rep('cand.push({ source: f.source, type: f.type, title: it.title, url: it.link, published_at: normDate(it.pubDate) });',
    'cand.push({ source: f.source, type: f.type, title: it.title, url: it.link, published_at: normDate(it.pubDate), snippet: clean(it.desc, it.title) });')
rep('source: b.source, source_type: b.type, title: b.title, url: b.url, published_at: b.published_at,\n        stance:',
    'source: b.source, source_type: b.type, title: b.title, url: b.url, published_at: b.published_at, snippet: b.snippet,\n        stance:')
rep('const rest = fresh.slice(i + BATCH).map((b) => ({ source: b.source, source_type: b.type, title: b.title, url: b.url, published_at: b.published_at, stance: "neutral" }));',
    'const rest = fresh.slice(i + BATCH).map((b) => ({ source: b.source, source_type: b.type, title: b.title, url: b.url, published_at: b.published_at, snippet: b.snippet, stance: "neutral" }));')
rep('function normDate(',
'''// feed description as plain text; null when it only repeats the headline (Google News does that)
function clean(desc: string | undefined, title: string): string | null {
  const t = String(desc ?? "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\\s+/g, " ").trim();
  if (t.length < 40 || t.startsWith(title.slice(0, 40))) return null;
  return t.slice(0, 400);
}
function normDate(''')
open(p,"w",encoding="utf-8").write(s); print("scan-sentiment patched OK")
