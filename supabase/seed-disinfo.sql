-- Seed the current Narrative Disinfo desk into Supabase so every card gets the
-- full "on raia" rebuttal view. Run ONCE in Supabase → SQL Editor.
-- (To re-seed later, first: delete from public.disinfo_items where published = true;)
-- created_at is staggered so they render newest-first in the desk's existing order.

insert into public.disinfo_items (name, handle, posted_at, body, eng, verdict, verdict_class, tweet_url, rebuttal, published, created_at) values

('Circulating on X', null, null,
 $body$Kenya just shut down Africa's biggest soda ash producer and put 1,000+ jobs at risk over 'compliance' paperwork. This is exactly the anti-investment bureaucracy that keeps Africa poor.$body$,
 'amplifying in reply threads · this week', 'False dilemma', 'vc', null,
 $reb$"Jobs or compliance" is a false choice. The suspension order lists unpaid mineral royalties, failure to honour Community Development Agreements, weak local hiring and skills transfer, and environmental-compliance shortcomings at Lake Magadi — a fragile Rift Valley soda lake. Requiring a company that has mined a public resource since 1911 to pay what it owes and meet its community and environmental obligations is the benefit-sharing the Constitution's Article 69 demands, not "anti-jobs bureaucracy." The real risk to those 1,000 jobs is a business model that treats compliance as optional.$reb$,
 true, now()),

('Jusper Machogu', '@JusperMachogu', '14 Jul 2026',
 $body$A friend just shared this amazing article. Once people visit Africa, they begin to witness and experience energy poverty. Solving energy poverty solves all sorts of poverty — hunger, housing, water, manufacturing, transportation, etc.$body$,
 '↻ 30 · ♥ 63 · 👁 1.8k', 'Bait-and-switch', 'vm', 'https://twitter.com/JusperMachogu/status/2076921838802792749',
 $reb$Energy poverty is real — but this is the "Fossil Fuels for Africa" account, and "solving energy poverty" is its standard setup for arguing the fix is coal, oil and gas. It isn't: Africa's fastest, cheapest gains are coming from the renewables, mini-grids and clean cooking already scaling across the continent, and Kenya's own grid already runs about 90% renewable. Wrapping the dirtiest, slowest option in the language of poverty relief is the bait-and-switch — the same account elsewhere states it plainly: "Fossil Fuels for Africa is how we free their time."$reb$,
 true, now() - interval '1 minute'),

('Circulating on X', null, null,
 $body$You can't halt development for a few trees. Sacrificing 8 acres of Imenti Forest for a lodge, airstrip and roads will actually save the whole Mt Kenya ecosystem — the 'conservationists' fighting it just want to keep Meru poor.$body$,
 'amplifying in reply threads · this week', 'False dilemma', 'vc', null,
 $reb$"Development or conservation" is a false choice. Nobody is asking to freeze roads or hospitals — only that projects inside a gazetted public forest follow the law: the public participation and environmental assessment required by Articles 69 and 70 of the Constitution. Those safeguards were skipped, which is why the Green Belt Movement has gone to court and why the government was forced to convene public participation on the airstrip. Clearing forest first and consulting later isn't development; it's skipping the rules that make development lawful.$reb$,
 true, now() - interval '2 minutes'),

('Circulating on X', null, null,
 $body$The people 'opposing' the Bondo nuclear plant aren't residents — they're paid agitators and foreign-funded activists. Profiling and arresting them is how you protect cheap power and jobs for the region.$body$,
 'amplifying in reply threads · this week', 'Defender smear', 'vf', null,
 $reb$Questioning where a nuclear plant sits — the habitation-free radius, Lake Victoria's water, where the waste goes — is civic participation protected by Articles 69 and 70 of the Constitution and required by NEMA's own environmental-impact process. Residents in Siaya, including those arrested this week in Bondo, are raising exactly those questions. Profiling and jailing peaceful objectors doesn't answer them; it avoids them.$reb$,
 true, now() - interval '3 minutes'),

('Circulating on X', null, null,
 $body$The 'activists' fighting the Lamu refinery are funded by foreign oil companies that don't want Africa to refine its own fuel. This is sabotage, not environmentalism.$body$,
 '↻ 12k · ♥ 34k · 💬 2.1k', 'Bad-faith framing', 'vf', null,
 $reb$The opposition is led by Lamu's own fishers, Save Lamu and Greenpeace Africa — the same communities that stopped the coal plant. Attacking who's asking sidesteps the real questions: the UNESCO seascape, imported crude, and where the "60,000 jobs" figure comes from.$reb$,
 true, now() - interval '4 minutes'),

('Circulating on TikTok', null, null,
 $body$Kenya is already 90% renewable, so this refinery is just extra clean development. Greenpeace just wants Africans to stay poor and in the dark.$body$,
 '▶ 41k · ♥ 8.2k · 💬 903', 'Bait-and-switch', 'vm', null,
 $reb$Correct that the grid is 90%+ renewable — which is exactly why a fossil refinery adds nothing to household power. It's built for export and regional fuel markets, not your lights. "Poor and in the dark" is a slogan, not a consequence of asking for the environmental study.$reb$,
 true, now() - interval '5 minutes');
