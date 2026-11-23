-- MazingiraKenya — short versions of petitions
-- Adds an optional plain-language summary ("brief") and ready-made PDFs to petitions.
-- raia shows the brief first, with the full petition one tap away, and offers both PDFs.
-- Run once in the Supabase SQL editor.

alter table public.petitions add column if not exists brief         text;  -- plain-language summary (headings in CAPS, • bullets, **bold**)
alter table public.petitions add column if not exists brief_pdf_url text;  -- ready-made summary PDF (optional)
alter table public.petitions add column if not exists full_pdf_url  text;  -- ready-made full-text PDF (optional)

-- Lenya–KaJohn nuclear power project petition
update public.petitions set
  brief = $brief$WHO IS ASKING
Residents of Lenya–KaJohn and neighbouring communities in Central Sakwa, Bondo Sub-County, Siaya County. The government plans to build Kenya's first nuclear power plant on their land. They have petitioned the President and the Cabinet, through the Cabinet Secretary for Energy and Petroleum.

THEIR MAIN ASK
Stop all irreversible steps at Lenya–KaJohn – land acquisition, evictions, demolition and construction – until the community's concerns are independently investigated and resolved. And reconsider whether this is the right site at all.

They are clear that they are not against development or reliable electricity. They want their rights, culture and safety to count as much as national goals.

WHY THEY ARE WORRIED
• **Land and homes.** No clear answers yet on how much land will be taken, how many households will be moved, or how compensation will work.
• **Ancestral graves.** Luo families bury their loved ones at home. Moving would mean leaving or exhuming the graves of parents and grandparents – a loss no payment can replace.
• **Widows.** Customs around widowhood can stop a widow from setting up a new home on her own. She must be compensated directly and helped to resettle.
• **People with disabilities.** For someone who is blind, home is a learned map of paths and neighbours. Moving to an unfamiliar place could cost them their independence and safety.
• **Lake Victoria.** Cooling water, heat discharge and water use could harm fish, wetlands and food security.
• **Nuclear safety.** There are no clear plans yet for radiation protection, accidents, evacuation or long-term health monitoring.
• **Radioactive waste.** How will it be stored and disposed of, and who pays for it over generations?
• **The promised cancer hospital.** Residents ask why a cancer hospital is being offered alongside a nuclear plant, and want the health studies behind the promise. They do not claim the plant will cause cancer – they want an explanation.
• **Livelihoods.** Fishing, farming and artisanal mining could be disrupted.
• **A say in the decision.** Decisions are moving faster than real consultation, and the key studies have not been shared.

WHAT THEY WANT THE PRESIDENT AND CABINET TO DO
1. Halt irreversible work at Lenya–KaJohn.
2. Order an independent review of whether the site is suitable.
3. Move the project or drop the site if the review finds unacceptable harm.
4. Order full, independent environmental and social impact assessments.
5. Protect ancestral graves and cultural heritage – no forced or culturally insensitive exhumation.
6. Guarantee widows direct compensation, land, housing and legal support.
7. Make resettlement disability-inclusive, with persons with disabilities in decision-making.
8. Explain the cancer hospital promise in writing and publish the health studies.
9. Protect fishing, farming and mining livelihoods.
10. Guarantee meaningful public participation and full disclosure before any irreversible decision.
11. Set up an independent community oversight body with a grievance mechanism.
12. Ensure fair compensation so that no household is left worse off.
13. Reply in writing to each demand, naming the institutions responsible and the timelines.

THE LAW BEHIND THE PETITION
The Constitution of Kenya 2010 – including the rights to information (Art. 35), to petition (Art. 37), to property (Art. 40), to a clean and healthy environment (Art. 42), to culture (Art. 44), the rights of persons with disabilities (Art. 54), community land (Art. 63) and the state's environmental duties (Arts. 69 and 70). Also the Environmental Management and Co-ordination Act, the Nuclear Regulatory Act, the Community Land Act, the Land Act and the Access to Information Act.

IN THEIR WORDS
"The people of Lenya–KaJohn are not obstacles to development. We are citizens whose rights, voices, knowledge, culture and aspirations deserve respect."

This is a plain-language summary prepared by MazingiraKenya. The full petition is the official text.$brief$,
  brief_pdf_url = 'https://raia.mazingirakenya.org/docs/lenya-kajohn-petition-summary.pdf',
  full_pdf_url  = 'https://raia.mazingirakenya.org/docs/lenya-kajohn-petition-full.pdf'
where id = '87bc38c0-83fb-4972-88c1-52545399fe3e';

select id, left(title,60) as title, length(brief) as brief_chars, brief_pdf_url is not null as has_pdfs
from public.petitions where id = '87bc38c0-83fb-4972-88c1-52545399fe3e';
