/* MazingiraKenya — "Je, Hatua?" project proposal kits.
   Per-project descriptions, verified supporting sources, funder fit and
   downloadable individual / consortium proposal templates (Word).
   Loaded by index.html; wired via MZK_KITS.boot(PROJECTS). Sources checked Oct 2026. */
(function(){
"use strict";
/* The fundable-project portfolio — single source of truth for the hub (Je, Hatua?) and the admin console (Match & notify). */
var PROJECTS = [
 { lane:"document", title:"North-Eastern Water Watch", status:"idea",
   pitch:"Place a documentation partner across Wajir, Mandera and Garissa — the coalition's largest blind spot — to record aquifer depletion, unregulated drilling and exploration blocks.",
   gap:"North Eastern water: real pressure, no local response, and the radar barely registers it.",
   county:"Wajir · Mandera · Garissa", sector:"Water", budget:"KES 3.2M / 12 mo", funder:"FIMI Ayni · AJWS" },
 { lane:"document", title:"Taita Taveta Minerals Monitor", status:"idea",
   pitch:"Community documentation of gemstone and iron mining and the water conflict with large estates — the single widest county gap on the national map.",
   gap:"Taita Taveta: highest county response gap, minerals pressure with no organised presence.",
   county:"Taita Taveta", sector:"Minerals", budget:"KES 2.8M / 12 mo", funder:"Africa Climate Fund" },
 { lane:"document", title:"Kerio Valley Fluorspar Log", status:"idea",
   pitch:"Document the Sofax Fluorspar revival of the former Kenya Fluorspar Company mine at Kimwarer and the escarpment degradation around it, with consented community testimony feeding the Hub's evidence layer.",
   gap:"Elgeyo-Marakwet minerals: newly reactivated, currently unmonitored.",
   county:"Elgeyo-Marakwet", sector:"Minerals", budget:"KES 2.4M / 9 mo", funder:"Pooled sub-grant" },
 { lane:"challenge", title:"Dangote Refinery ESIA Intervention", status:"dev",
   pitch:"Fund legal and community review of the proposed 700,000 bpd Lamu refinery's environmental and social impact assessment before it is licensed — the window is open now. Legal partner: Katiba Institute.",
   gap:"Lamu oil: a nationally significant proposed project with no organised scrutiny yet.",
   county:"Lamu", sector:"Oil & gas", budget:"KES 6.0M / 18 mo", funder:"AJWS" },
 { lane:"challenge", title:"Siaya Nuclear FPIC Campaign", status:"idea",
   pitch:"Support Luanda Kotieno lake communities to secure free, prior and informed consent on the proposed nuclear plant. They are already protesting — without legal backing. Legal partner: Katiba Institute.",
   gap:"Siaya nuclear: proposed on Lake Victoria, community opposition with no legal support.",
   county:"Siaya", sector:"Nuclear", budget:"KES 4.5M / 12 mo", funder:"AJWS · Africa Climate Fund" },
 { lane:"challenge", title:"Mui Basin Community Evidence", status:"dev",
   pitch:"Compile community documentation into an evidentiary record for the pending judicial review of the coal concessions — turning field reports into court-usable primary sources. Legal partner: Katiba Institute.",
   gap:"Kitui coal: live litigation, national reach only, no embedded local documentation.",
   county:"Kitui", sector:"Coal", budget:"KES 3.5M / 12 mo", funder:"Strategic litigation fund" },
 { lane:"build", title:"Coastal Citizen Journalism Expansion", status:"dev",
   pitch:"Extend LAWA's (Lamu Women Alliance) youth citizen-journalism project — funded by AJWS through deCOALonize — down the coast to Kilifi and Kwale: proven format, new geography, high-value indigenous community content.",
   gap:"Coast minerals & land: pressure across Kilifi/Kwale, response concentrated only in Lamu.",
   county:"Kilifi · Kwale", sector:"Minerals · Land", budget:"KES 5.0M / 18 mo", funder:"AJWS · FIMI Ayni" },
 { lane:"build", title:"Gap-County Response Fund", status:"idea",
   pitch:"A pooled sub-grant that seeds one documentation partner into each of the top-five gap counties, chosen from the national map's ranking and reviewed each quarter.",
   gap:"Twenty counties have no organised response. This funds the five that matter most.",
   county:"Top-5 gap counties", sector:"Cross-sector", budget:"KES 12M / 24 mo", funder:"Pooled donor facility" },
 { lane:"build", title:"Rift Lakes Response Node", status:"idea",
   pitch:"Stand up a node covering rising Rift-lake displacement (Baringo), geothermal expansion (Nakuru) and abstraction — a region with pressure across three sectors and thin coverage.",
   gap:"Rift Valley water & energy: multi-sector pressure, only intermittent regional presence.",
   county:"Baringo · Nakuru", sector:"Water · Energy", budget:"KES 4.0M / 12 mo", funder:"Africa Climate Fund" },

 { lane:"document", title:"Western Gold Belt Monitor", status:"dev",
   pitch:"Independent documentation of Shanta Gold's mining expansion (Isulu–Bushiangala in Ikolomani, Ramula–Mwibona in Gem-Ramula and Vihiga) — evictions, deaths and consultation failures — building a court-ready evidence base with KHRC.",
   gap:"Kakamega/Siaya/Vihiga minerals: severe live pressure, deaths in 2026, response mostly national.",
   county:"Kakamega · Siaya · Vihiga", sector:"Minerals", budget:"KES 5.5M / 18 mo", funder:"AJWS · CivFund" },
 { lane:"document", title:"Coastal Plastics & Marine Watch", status:"idea",
   pitch:"Community monitoring of marine and urban plastic pollution from Mombasa to Lamu, feeding the new plastics layer with real data and linking to the Break Free From Plastic campaign.",
   gap:"Coast plastics: the widest gap on the matrix — pressure with almost no organised response.",
   county:"Mombasa · Kilifi · Kwale · Lamu", sector:"Plastics", budget:"KES 3.6M / 12 mo", funder:"HBS · FEMNET" },
 { lane:"document", title:"Renewables Justice Tracker", status:"idea",
   pitch:"Track community land and consent outcomes at the big renewable-energy sites — Lake Turkana Wind, Kipeto, Menengai and the proposed Siaya nuclear — so 'green' projects don't repeat the displacement pattern.",
   gap:"Renewables & energy: pressure spread across the north and Rift with only national scrutiny.",
   county:"Marsabit · Nakuru · Siaya · Kajiado", sector:"Renewables & energy", budget:"KES 4.2M / 18 mo", funder:"HBS · HIVOS" },

 { lane:"challenge", title:"EACOP Finance & Solidarity Brief", status:"dev",
   pitch:"Compile the Kenyan-relevant evidence into the regional StopEACOP finance-withdrawal case — connecting the pipeline's precedent to Kenya's own oil ambitions and the just-transition argument.",
   gap:"Oil & gas: a regional mega-project with active Kenya links and no Kenya-specific brief.",
   county:"Regional · Kenya node", sector:"Oil & gas", budget:"KES 3.0M / 12 mo", funder:"AJWS · HBS" },
 { lane:"challenge", title:"NRT Conservancy Accountability", status:"idea",
   pitch:"Support northern communities documenting and challenging contested conservancy land practices, displacement and wildlife–community conflict — turning grievances into a reviewable record.",
   gap:"Marsabit/Isiolo/Samburu land: a contested actor operating with thin community legal support.",
   county:"Marsabit · Isiolo · Samburu", sector:"Land & forest", budget:"KES 4.8M / 18 mo", funder:"NAMATI · UAF-Africa" },

 { lane:"build", title:"Northern Rangelands Documentation Corps", status:"dev",
   pitch:"Fund the Wajir, Marsabit and Mandera groups now on the map to run a shared documentation and early-warning corps across the ASAL north — the region the media never covers.",
   gap:"North Eastern & Eastern water/land: newly-mapped local groups, no shared reporting capacity.",
   county:"Wajir · Marsabit · Mandera", sector:"Water · Land", budget:"KES 9.0M / 24 mo", funder:"FIMI Ayni · HIVOS" },
 { lane:"build", title:"Lake Victoria Basin Response Hub", status:"idea",
   pitch:"A shared hub for the lake basin covering industrial effluent, gold-mining runoff, the nuclear proposal and plastic pollution — one node for four overlapping pressures across Nyanza.",
   gap:"Nyanza water & plastics & nuclear: stacked pressure, coverage split across single-issue groups.",
   county:"Kisumu · Siaya · Homa Bay · Migori", sector:"Water · Plastics", budget:"KES 6.5M / 24 mo", funder:"Pooled donor facility" },

 { lane:"challenge", title:"River Yala Gold-Cyanide Enforcement Petition", status:"idea",
   pitch:"Back a public-interest petition to compel enforcement against the cyanide and mercury discharge from illegal gold processing poisoning the River Yala and its wetland — built on NEMA's own effluent rules and the clean-environment right in Articles 42 and 69. Legal partner: Katiba Institute.",
   gap:"Nyanza/Rift gold: rivers being poisoned with no enforcement case yet filed.",
   county:"Siaya · Vihiga · Nandi", sector:"Minerals · Water", budget:"KES 3.8M / 12 mo", funder:"Strategic litigation fund" },
 { lane:"build", title:"Western Gold-Belt Mercury Watch", status:"idea",
   pitch:"Stand up a shared community-monitoring node across the Western gold belt — Kakamega, Migori and Vihiga — testing water and soil for mercury and cyanide, training citizen samplers, and feeding verified readings into the platform's water and minerals layers so the harm is documented as it happens.",
   gap:"Western gold belt: severe mercury and water pressure, monitoring scattered and un-pooled.",
   county:"Kakamega · Migori · Vihiga", sector:"Minerals · Water", budget:"KES 7.5M / 24 mo", funder:"Pooled donor facility" }
];
window.MZK_PROJECTS = PROJECTS;

var KITS = {
/* ---- DOCUMENT lane ---- */
"North-Eastern Water Watch": {
  id:"ne-water-watch",
  description:"Most people in Wajir, Mandera and Garissa depend on groundwater, and repeated failed rains have made that supply more fragile. In January 2026 Mandera was in the drought 'alarm' phase, with more than 335,000 residents needing assistance and livestock moving into Wajir raising the risk of conflict over water. Wajir residents have long blamed commercial boreholes for drying town wells; the Merti aquifer is proposed as a long-term supply, but Habaswein communities oppose sharing it and researchers warn of saline intrusion. Drilling is now accelerating: a World Bank-funded programme plans 400 new boreholes across five northern counties, and the State has offered oil and gas exploration blocks lying mostly in the former North-Eastern Province. No independent, community-held record yet tracks water levels, water quality, drilling and exploration footprints together. This project builds that baseline so communities can take part in allocation decisions and permit objections from evidence.",
  objectives:[
    "Establish a community-held baseline of water levels, quality and access at priority boreholes, shallow wells and pans",
    "Map borehole drilling and abstraction against Water Resources Authority permit records",
    "Track oil and gas exploration blocks and related activity affecting water sources and grazing land",
    "Equip Water Resource Users Associations and county forums to use the evidence in permit objections and allocation decisions"],
  activities:[
    "Train 24 community water monitors (8 per county, at least half women) in water-level, salinity (EC) and GPS recording",
    "Run monthly monitoring rounds at 60 sentinel water points and upload data to a shared dashboard",
    "File Access to Information requests for borehole permits, drilling records and exploration licences in all three counties",
    "Hold 6 community verification barazas to validate findings and record testimony on water conflict",
    "Publish a 'State of Groundwater' brief and present it to county assemblies and the WRA basin office"],
  outcomes:[
    "60 water points with 12 months of continuous community data, publicly accessible",
    "At least 15 ATI requests filed, with responses logged and gaps documented",
    "At least 3 county or regulator decisions informed by project evidence"],
  partners:[
    ["Wajir South Development Association (WASDA)","Wajir-based community development and water partner"],
    ["RACIDA","Mandera-based relief and development organisation active in drought response"],
    ["Natural Justice","Legal empowerment and community protocols"],
    ["Katiba Institute","Constitutional litigation and access-to-information support"],
    ["Water Resource Users Associations (WRUAs)","Local water governance bodies under the Water Act"]],
  legal:[
    "Constitution of Kenya 2010, Art. 43(1)(d) (right to clean and safe water), Arts. 42, 69–70",
    "Water Act 2016: s.36 (permits), s.40 (public consultation and objections), s.23 (groundwater conservation areas)",
    "Access to Information Act 2016",
    "Petroleum Act 2019 and Community Land Act 2016 (consent and compensation on community land)"],
  resources:[
    {t:"Drought pushes Mandera into alarm phase as 335k locals require assistance",u:"https://www.the-star.co.ke/counties/north-eastern/2026-01-08-mandera-in-drought-alarm-phase-as-335k-locals-need-assistance",k:"data",s:"The Star (Jan 2026)",w:"Current figures on drought, water trucking, borehole status and conflict risk."},
    {t:"Horn of Africa water project to curb conflict",u:"https://www.the-star.co.ke/news/2024-04-05-horn-of-africa-water-project-to-curb-conflict",k:"article",s:"The Star (2024)",w:"World Bank Groundwater for Resilience programme (USD 385M) and its 400 planned boreholes — the 'why now'."},
    {t:"Hydrogeological Assessment of the Merti Aquifer, Kenya",u:"https://en.acaciawater.com/nw-29143-6-3604052/nieuws/hydrogeological_assessment_of_the_merti_aquifer_kenya.html",k:"research",s:"Acacia Water",w:"Models 30-year drawdown and saline-intrusion risk for the main aquifer serving Wajir."},
    {t:"Water wells in Wajir town are drying up and people are 'thirsty' for change",u:"https://www.kulanpost.co.ke/water-wells-in-wajir-town-are-drying-up-and-people-are-thirsty-for-change/",k:"article",s:"Kulan Post",w:"Residents blame commercial boreholes; officials dispute it — the case for independent monitoring."},
    {t:"State puts up 35 oil blocks for sale in oil exports dream",u:"https://nation.africa/kenya/news/state-puts-up-35-oil-blocks-for-sale-in-oil-exports-dream-3734356",k:"article",s:"Daily Nation",w:"Blocks offered were 'mostly located in the former North-Eastern province'."},
    {t:"Four killed in Kenya over dispute over boreholes",u:"https://www.worldwater.org/conflicts/four-killed-in-kenya-over-dispute-over-boreholes-2",k:"case study",s:"Pacific Institute Water Conflict Chronology",w:"Documented deadly clan conflict over boreholes at El Wak, Mandera."},
    {t:"Water Act, 2016 (No. 43 of 2016)",u:"https://new.kenyalaw.org/akn/ke/act/2016/43",k:"law/policy",s:"Kenya Law",w:"Permits for any groundwater use and the right to object — the legal basis for checking boreholes against permits."}]
},
"Taita Taveta Minerals Monitor": {
  id:"taita-taveta-minerals",
  description:"Taita Taveta is Kenya's largest gemstone producer, with artisanal and small-scale miners producing most of its output; the county also holds iron ore, manganese and other minerals. About 10,000 people in the county work in mining, according to local reporting, and miners say brokers buy stones cheaply at the pit and export them uncut. A Heinrich Böll Stiftung study found mining communities have largely been 'losers' in mineral exploitation. Iron ore at Kishushe has caused years of disputes over leadership, investors and community impacts — a petition reached the Senate in 2019. Water is a second fault line: in 2019 Taveta farmers and fishers accused a large private farm of blocking canals feeding Lake Jipe, and the water regulator had to mediate. With new licensing, a state-built gemstone value-addition centre and fresh iron-ore investment, now is the time to build a community record of mining impacts, benefit-sharing and water use.",
  objectives:[
    "Document the social, environmental and water impacts of gemstone and iron-ore mining at priority sites",
    "Track licensing, Community Development Agreements and royalty flows against what the law requires",
    "Record water-use conflicts between communities, mines and large estates, and refer them to the right regulators",
    "Strengthen artisanal miners' cooperatives and affected communities to use evidence in county and national forums"],
  activities:[
    "Train 20 community monitors in incident logging, photo/GPS documentation and informed-consent interviewing",
    "Profile 10 active mine sites (artisanal and large-scale): land use, water sources, safety, benefit-sharing",
    "File ATI requests for mineral rights, Community Development Agreements and WRA permits for estates",
    "Hold quarterly dialogues with artisanal cooperatives, county mining officers and the WRA",
    "Publish a county minerals and water impact report, plus a short video of community testimony"],
  outcomes:[
    "Baseline profiles for 10 mine sites and a log of at least 50 documented incidents or grievances",
    "CDA and permit status known for every large-scale licence in the county",
    "At least 2 grievances formally escalated (Senate/County Assembly petition, regulator complaint or court)"],
  partners:[
    ["Haki Madini Kenya","National coalition on mining and community rights"],
    ["Natural Justice","Community protocols and FPIC support"],
    ["Kituo cha Sheria","Legal aid for land and labour grievances"],
    ["Kishushe Ranching Cooperative & artisanal mining cooperatives","Affected landholders and miners"]],
  legal:[
    "Constitution of Kenya 2010, Arts. 42, 60, 66(2) (benefit to local communities), 69, 70",
    "Mining Act 2016: s.34 (notice/objections), ss.37–38 (consent on private and community land), s.47 (CDAs)",
    "Mining (Community Development Agreement) Regulations 2017 (LN 148/2017)",
    "Water Act 2016 and Access to Information Act 2016"],
  resources:[
    {t:"The Wealth in the Underground that is Elusive to Local Communities – Mining in Taita Taveta County",u:"https://ke.boell.org/en/node/241",k:"research",s:"Heinrich Böll Stiftung",w:"Key study on how mining benefits bypass Taita Taveta communities."},
    {t:"COVID-19 is underscoring the vulnerable lives of Kenya's artisanal gemstone miners",u:"https://theconversation.com/covid-19-is-underscoring-the-vulnerable-lives-ofkenyas-artisanal-gemstone-miners-140275",k:"research",s:"The Conversation / Univ. of Nottingham",w:"Research account of artisanal gemstone mining, risks and markets in the county."},
    {t:"Suffering at the hands of brokers, artisanal miners call for help",u:"https://www.the-star.co.ke/counties/coast/2023-10-12-suffering-at-the-hands-of-brokers-artisanal-miners-call-for-help",k:"article",s:"The Star (2023)",w:"Miners' own accounts of broker exploitation and uncut exports."},
    {t:"Ruto's farm in battle for lake water in Taita Taveta",u:"https://nation.africa/kenya/news/ruto-s-farm-in-battle-for-lake-water-in-taita-taveta-3399474",k:"article",s:"Daily Nation (2019)",w:"Water conflict between a large estate and Lake Jipe farming and fishing villages."},
    {t:"Senate report on the petition on iron ore mining at Kishushe",u:"https://libraryir.parliament.go.ke/items/8181be43-2243-45e6-807e-3b99dbf0a889",k:"case study",s:"Senate of Kenya (2019)",w:"Parliamentary precedent for community petitions on mining harms in the county."},
    {t:"Stakeholders convene in Taita Taveta to address mining challenges",u:"https://www.kenyanews.go.ke/stakeholders-convene-in-taita-taveta-to-address-mining-challenges/",k:"article",s:"Kenya News Agency (2025)",w:"Government commitments monitors can hold officials to."},
    {t:"The Mining (Community Development Agreement) Regulations, 2017",u:"https://new.kenyalaw.org/akn/ke/act/ln/2017/148/eng@2022-12-31",k:"law/policy",s:"Kenya Law",w:"Standards for CDA committees and consultation."}]
},
"Kerio Valley Fluorspar Log": {
  id:"kerio-fluorspar",
  description:"Kenya Fluorspar Company mined fluorspar at Kimwarer in the Kerio Valley for decades before closing in 2016, citing a price slump; more than 2,000 direct jobs were lost. A new investor, Sofax Fluorspar, is now reviving the operation: a KES 4.8 billion processing plant is planned for about 120,000 tonnes a year, with exports targeted to restart in 2025, and a Community Development Agreement promises the community 1% of gross sales. Residents have raised compensation demands for land, and researchers note past mining left deforestation, soil erosion and land degradation. The Elgeyo escarpment is already one of Kenya's most landslide-prone areas — county figures cite more than 500 deaths over two decades. Restarting mining on this fragile escarpment without an independent baseline puts communities at risk. This project collects consented testimony and site evidence from the start, so commitments on environment, jobs and benefits can be tracked.",
  objectives:[
    "Create a pre- and early-operation baseline of land, water, forest cover and slope stability around Kimwarer",
    "Collect consented community testimony on the legacy of past mining, compensation and the reopening",
    "Monitor how the Community Development Agreement and ESIA commitments are carried out",
    "Give affected households and youth groups the evidence and skills to engage the company, county and NEMA"],
  activities:[
    "Train 15 community documenters (incl. youth and women) in informed-consent protocols, oral history and geotagged photography",
    "Record 40 consented testimonies from former workers, landholders and escarpment residents",
    "Run quarterly photo-point and water-sampling rounds at fixed sites near the mine, waste areas and streams",
    "Obtain the ESIA, licence and CDA through ATI requests; produce a plain-language commitments tracker",
    "Convene 3 community–company–county dialogue forums to present findings"],
  outcomes:[
    "A published baseline dossier with at least 20 fixed photo points and water data",
    "40 consented testimonies archived securely, with a public summary",
    "A CDA and ESIA commitments tracker shared with the Community Development Committee and county"],
  partners:[
    ["Hug a Cedar Foundation","Local youth-led land restoration in the Kimwarer area"],
    ["Haki Madini Kenya","Mining communities coalition"],
    ["Natural Justice","Community protocols, FPIC and ESIA participation"],
    ["Kenya Human Rights Commission (KHRC)","Business and human rights documentation"]],
  legal:[
    "Constitution of Kenya 2010, Arts. 42, 69 (incl. tree cover), 70",
    "EMCA 1999 and EIA/Audit Regulations (public participation in ESIA)",
    "Mining Act 2016 and Mining (CDA) Regulations 2017",
    "Access to Information Act 2016"],
  resources:[
    {t:"Kenya Flourspar Company shuts down tomorrow",u:"https://www.the-star.co.ke/news/2016-04-28-kenya-flourspar-company-shuts-down-tomorrow",k:"article",s:"The Star (2016)",w:"The 2016 closure and job losses — the legacy baseline."},
    {t:"Kenya set to resume fluorspar exports after 8-year hiatus",u:"https://peopledaily.digital/business/kenya-set-to-resume-fluorspar-exports-after-8-year-hiatus",k:"article",s:"People Daily / KNA (Jan 2025)",w:"Revival details: Sofax Fluorspar, KES 4.8B plant, CDA at 1% of gross sales."},
    {t:"Degradation of the environment erodes Kerio Valley's beauty",u:"https://www.businessdailyafrica.com/bd/data-hub/degradation-environment-erodes-kerio-valley-beauty-3606892",k:"data",s:"Business Daily (2021)",w:"Escarpment degradation and landslide data."},
    {t:"Climate Smart Agriculture and Rehabilitation in Mining Affected Areas — Kimwarer Fluorspar Region",u:"https://conference.mu.ac.ke/event/2/contributions/124",k:"research",s:"Moi University conference",w:"Field account of mining-linked deforestation and degradation at Kimwarer."},
    {t:"Save Lamu & 5 others v NEMA & another [2019] KENET 98",u:"https://new.kenyalaw.org/akn/ke/judgment/kenet/2019/98/eng@2019-06-26",k:"case study",s:"National Environment Tribunal",w:"An EIA licence is flawed without effective public participation."},
    {t:"Community Protocol Tool Box and Project Report",u:"https://www.boell.de/en/2016/06/07/community-protocols-toolbox",k:"toolkit",s:"Natural Justice / Heinrich Böll Stiftung",w:"Participatory tools for community protocols in extractive settings."},
    {t:"The Mining (Community Development Agreement) Regulations, 2017",u:"https://new.kenyalaw.org/akn/ke/act/ln/2017/148/eng@2022-12-31",k:"law/policy",s:"Kenya Law",w:"Legal standard for the Kimwarer CDA."}]
},
"Western Gold Belt Monitor": {
  id:"western-gold-belt-monitor",
  description:"Shanta Gold Kenya is moving toward large-scale gold mining in the Kakamega–Vihiga–Siaya gold belt, developing the Isulu–Bushiangala project in Ikolomani and the Ramula–Mwibona project in Siaya and Vihiga. On 4 December 2025, three people died in violence at a NEMA public-participation forum on the Ikolomani ESIA; on 6 April 2026, two protesters were shot dead in Gem-Ramula during a protest over alleged eviction. KHRC and allied groups say NEMA approved the Ramula ESIA despite more than 300 unanswered objections, that artisanal miners were excluded, that more than 1,200 homesteads face relocation, and that operations continued despite Siaya court conservatory orders. Police accounts differ. The area already carries a health burden from artisanal mining: British Geological Survey-linked research found high arsenic, mercury and lead in soils, water and crops. Court-ready, independently gathered evidence is urgently needed.",
  objectives:[
    "Build a verified, court-ready evidence base on displacement, compensation, use of force and consultation failures",
    "Monitor compliance with court orders, ESIA conditions, resettlement standards and Mining Act consent requirements",
    "Support affected residents, witnesses and artisanal miners through legal referral and secure documentation",
    "Push for accountability through KNCHR, IPOA, NEMA, the National Land Commission and Parliament"],
  activities:[
    "Train 30 community paralegals/monitors in human-rights documentation, chain-of-custody and witness safety",
    "Maintain a secure incident database (evictions, arrests, injuries, deaths, threats) with verified statements",
    "Obtain and analyse ESIAs, resettlement frameworks, licences and court records via ATI and court registries",
    "Survey at least 600 potentially affected homesteads on land, compensation and consultation",
    "Prepare evidence dossiers with KHRC for ELC petitions and IPOA/KNCHR complaints",
    "Run quarterly briefings for county assemblies, the Senate and the media"],
  outcomes:[
    "600 household surveys and 150 verified incidents in a secure, legally admissible database",
    "At least 3 evidence dossiers submitted to courts or oversight bodies",
    "Public, quarterly tracking of court-order and ESIA compliance at all three sites"],
  partners:[
    ["Kenya Human Rights Commission (KHRC)","Lead legal and advocacy partner"],
    ["Community Initiative Action Group Kenya (CIAG-K)","Grassroots rights group active in Siaya"],
    ["Kenya National Commission on Human Rights (KNCHR)","Statutory investigation and oversight"],
    ["Independent Medico-Legal Unit (IMLU)","Forensic and medico-legal documentation"],
    ["Katiba Institute","Constitutional litigation"]],
  legal:[
    "Constitution of Kenya 2010, Arts. 10, 26, 40, 42, 47, 69, 70",
    "Mining Act 2016: s.34, ss.37–40 (consent and compulsory acquisition), s.47 (CDAs)",
    "EMCA 1999 and EIA regulations (Save Lamu NET 2019 precedent)",
    "Land Act 2012 (compulsory acquisition) and Access to Information Act 2016"],
  resources:[
    {t:"KHRC decries state and corporate violence in mining zones, including Shanta Gold's activities",u:"https://khrc.or.ke/press-release/khrc-decries-state-and-corporate-violence-in-mining-zones-including-shanta-golds-activities-in-kakamega-siaya-and-vihiga-counties/",k:"research",s:"KHRC (Dec 2025)",w:"Consultation failures and demands to NEMA and government."},
    {t:"State repression, corporate capture and injustices by Shanta Gold",u:"https://khrc.or.ke/press-release/state-repression-corporate-capture-and-injustices-by-shanta-gold/",k:"case study",s:"KHRC + ~16 CSOs (Apr 2026)",w:"Gem-Ramula killings, the Siaya court order and planned relocation of 1,200+ homesteads."},
    {t:"Governor Barasa orders probe after three die in Kakamega mining forum violence",u:"https://capitalfm.africa/governor-barasa-orders-probe-after-three-die-in-kakamega-mining-forum-violence/",k:"article",s:"Capital FM (Dec 2025)",w:"News record of the Ikolomani public-participation forum deaths."},
    {t:"Two dead as Siaya protests against gold mining firm turn tragic",u:"https://witnessradio.org/two-dead-as-siaya-protests-against-gold-mining-firm-turn-tragic/",k:"article",s:"Witness Radio / NMG (Apr 2026)",w:"Both police and community accounts of the Ramula shootings."},
    {t:"Linking geochemistry and health in ASGM in the Kakamega-Vihiga gold belt",u:"https://www.bgs.ac.uk/news/linking-geochemistry-and-health-in-artisanal-and-small-scale-gold-mining-in-the-kakamega-vihiga-gold-belt-kenya/",k:"research",s:"British Geological Survey (2024)",w:"Arsenic, mercury and lead contamination baseline."},
    {t:"Save Lamu & 5 others v NEMA & another [2019] KENET 98",u:"https://new.kenyalaw.org/akn/ke/judgment/kenet/2019/98/eng@2019-06-26",k:"case study",s:"National Environment Tribunal",w:"ESIA licence set aside for inadequate public participation."},
    {t:"Mining Act, 2016",u:"https://new.kenyalaw.org/akn/ke/act/2016/12",k:"law/policy",s:"Kenya Law",w:"Community notice, objection and consent rights."}]
},
"Coastal Plastics & Marine Watch": {
  id:"coastal-plastics-watch",
  description:"Kenya banned plastic carrier bags in 2017 — the courts upheld the ban — and in 2020 banned single-use plastics in protected areas. Even so, plastic waste keeps reaching the coast. The first documented survey of Kenyan beaches (Kilifi, Mombasa, Kwale) found plastics and foam were the most common litter, about 88% of items were local products, and food packaging made up most branded litter. Researchers have found microplastics in Tudor, Port Reitz and Mida creeks and in crabs and oysters there. Volunteer groups from Likoni to Lamu say enforcement is weak and they lack basic equipment. Kenya's 2024 Extended Producer Responsibility Regulations make producers responsible for post-consumer waste, while campaigners say smuggling and loopholes undermine the bans. Community brand audits and litter monitoring using Break Free From Plastic methods can give coastal groups the evidence to hold producers and regulators to these new duties.",
  objectives:[
    "Run standardised community litter and brand-audit monitoring at fixed beach, creek and urban sites in four counties",
    "Identify the brands responsible for coastal plastic pollution and feed the data into national EPR enforcement",
    "Document enforcement gaps in the carrier-bag ban and the protected-area single-use plastics ban",
    "Link coastal groups to Break Free From Plastic and national plastics coalitions"],
  activities:[
    "Train 40 community monitors (fishers, beach groups, waste pickers) in BFFP brand-audit and beach-transect methods",
    "Run quarterly brand audits at 12 fixed sites (beaches, creeks, landing sites, markets)",
    "Log banned plastics in markets and protected areas; report to NEMA and KWS",
    "Submit data to the BFFP global audit and publish a 'Kenya Coast Polluters' report",
    "Hold producer-accountability dialogues with counties and Producer Responsibility Organisations"],
  outcomes:[
    "4 quarterly audit rounds at 12 sites, with at least 20,000 items classified by brand and type",
    "A public Kenya Coast Polluters report submitted to NEMA and county governments",
    "At least 20 enforcement reports logged and tracked for regulator response"],
  partners:[
    ["Centre for Environmental Justice and Development (CEJAD)","National plastics and waste-picker advocacy, BFFP-linked"],
    ["Greenpeace Africa","Plastics campaign and refill/reuse policy"],
    ["Kenya National Waste Pickers Association","Frontline collectors and data contributors"],
    ["Kenya Marine and Fisheries Research Institute (KMFRI)","Scientific methods and data validation"],
    ["Local beach groups (e.g. Likoni, Banda/Mombasa)","Community clean-up and monitoring"]],
  legal:[
    "Constitution of Kenya 2010, Arts. 42, 69, 70",
    "Sustainable Waste Management Act 2022 (s.13 Extended Producer Responsibility)",
    "Sustainable Waste Management (EPR) Regulations 2024 (LN 176/2024)",
    "EMCA 1999 and the 2017 carrier-bag and 2020 protected-area plastics gazette notices"],
  resources:[
    {t:"Marine macro-litter composition and distribution along the Kenyan Coast: the first-ever documented study",u:"https://agris.fao.org/search/en/records/65de4390b766d82b18fcde89",k:"research",s:"Okuku et al., Marine Pollution Bulletin (2020)",w:"Baseline beach-litter data for Kilifi, Mombasa and Kwale."},
    {t:"Microplastics: the destruction of marine life and the blue economy",u:"https://www.theelephant.info/analysis/2022/09/23/microplastics-the-destruction-of-marine-life-and-the-blue-economy/",k:"article",s:"The Elephant (2022)",w:"Summarises KMFRI/university microplastics studies in Mombasa creeks and seafood."},
    {t:"The lonely fight to save Indian Ocean from litter",u:"https://www.the-star.co.ke/news/big-read/2022-07-28-the-lonely-fight-to-save-indian-ocean-from-litter",k:"article",s:"The Star (2022)",w:"Community clean-up groups and enforcement complaints."},
    {t:"2023 Global Brand Audit results",u:"https://www.breakfreefromplastic.org/2024/02/07/bffp-movement-unveils-2023-global-brand-audit-results/",k:"data",s:"Break Free From Plastic",w:"The global brand-audit method this project plugs into."},
    {t:"Kenya plastic bag ban upheld (Petitions 32 & 35 of 2017)",u:"https://elaw.org/resource/ke_plasticban_upheld_2018",k:"case study",s:"ELAW / Environment and Land Court",w:"Court upheld the ban as a reasonable public-interest limit."},
    {t:"Sustainable Waste Management (EPR) Regulations, 2024",u:"https://new.kenyalaw.org/akn/ke/act/ln/2024/176/eng@2025-03-24",k:"law/policy",s:"Kenya Law",w:"Binding producer-responsibility framework audit evidence can enforce."},
    {t:"Kenya urged to plug plastic ban loopholes",u:"https://www.greenpeace.org/africa/en/press/61520/kenya-urged-to-plug-plastic-ban-loopholes-as-campaigners-handover-refill-and-reuse-policy-recommendations/",k:"article",s:"Greenpeace Africa (Aug 2026)",w:"Current policy context: smuggling, EPR gaps and CSO demands."}]
},
"Renewables Justice Tracker": {
  id:"renewables-justice-tracker",
  description:"Kenya gets most of its electricity from renewables, and more large energy projects are coming — several with serious land and consent disputes. In October 2021 the Environment and Land Court at Meru ruled that 150,000 acres of Marsabit community land were irregularly set apart for Lake Turkana Wind Power, giving the State one year to regularise the process or revert the land. In Nakuru, residents of villages in Rongai and Subukia say they were not consulted about Menengai geothermal phase two. In Siaya, residents of Sakwa, Bondo disrupted a May 2026 forum on the proposed nuclear plant, after which NuPEA pledged 'no project without community consent'. Kipeto in Kajiado, built on leased Maasai land, is often presented as a model of engagement. No one systematically tracks whether these projects respect community land rights, consent and benefit-sharing, or whether court orders and public pledges are kept.",
  objectives:[
    "Track land acquisition, consent and benefit-sharing at four renewable and nuclear energy sites",
    "Monitor compliance with court orders (e.g. the LTWP judgment) and public pledges (e.g. NuPEA's consent commitment)",
    "Compare outcomes across sites to set out a community standard for a just energy transition",
    "Support affected communities to use the evidence with financiers, regulators and courts"],
  activities:[
    "Train 24 community monitors (6 per site) in land-rights documentation, FPIC checklists and grievance logging",
    "Build a site tracker of titles, leases, ESIAs, resettlement plans, lender safeguards and grievances (ATI + registry searches)",
    "Hold community scorecard sessions at each site on consultation, compensation, jobs and benefits",
    "Document Menengai phase-two and Siaya nuclear consultations in real time",
    "Publish an annual Renewables Justice Scorecard for EPRA, NuPEA, GDC, NLC and lenders"],
  outcomes:[
    "A public tracker covering 4 sites, updated quarterly",
    "At least 8 scorecard sessions involving 400+ residents",
    "At least 2 formal submissions to lender grievance mechanisms, regulators or courts"],
  partners:[
    ["Natural Justice","FPIC, community protocols and energy-justice legal support"],
    ["Kenya Land Alliance","Community land registration and land governance"],
    ["Menengai West Stakeholders Forum (MWESFO)","Residents affected by Menengai expansion"],
    ["Sotua Ang CBO","Maasai community voice on geothermal (Suswa)"],
    ["Greenpeace Africa","Siaya nuclear and energy-transition advocacy"]],
  legal:[
    "Constitution of Kenya 2010, Arts. 10, 40, 42, 61–63 (community land), 69, 70",
    "Community Land Act 2016 (consent and leasing of community land)",
    "Energy Act 2019 and Nuclear Regulatory Act 2019",
    "Climate Change Act 2016 (amended 2023) and EMCA 1999"],
  resources:[
    {t:"Kochale & 5 others v Lake Turkana Wind Power Ltd & 4 others [2021] KEELC 1441",u:"https://new.kenyalaw.org/akn/ke/judgment/keelc/2021/1441/eng@2021-10-19",k:"case study",s:"ELC Meru / Kenya Law",w:"Landmark ruling on the 150,000-acre LTWP land set-apart."},
    {t:"Kipeto Wind Energy Project: a case study on best practice in community engagement",u:"https://www.business-humanrights.org/en/latest-news/kipeto-wind-energy-project-a-case-study-on-best-practice-in-community-engagement-in-energy-projects/",k:"case study",s:"Business & Human Rights Resource Centre",w:"A contrasting leasing model to benchmark other sites against."},
    {t:"Feeling the heat: responses to geothermal development in Kenya's Rift Valley",u:"https://www.participatorymethods.org/resource/feeling-the-heat-responses-to-geothermal-development-in-kenyas-rift-valley/",k:"research",s:"Hughes & Rogei (2020), IDS",w:"Resettlement, health and representation conflicts around geothermal."},
    {t:"'We don't want compensation!': plight of 163,000 facing displacement by GDC",u:"https://local.nation.co.ke/nakuru/whats-hot/-we-don-t-want-compensation-plight-of-163-000-facing-displacement-by-gdc-5102098",k:"article",s:"Nation, Mtaa Wangu (Jul 2025)",w:"Residents report no consultation on Menengai phase two."},
    {t:"NuPEA: No nuclear project without community consent",u:"https://www.the-star.co.ke/news/2026-05-23-nupea-no-nuclear-project-without-community-consent",k:"article",s:"The Star (May 2026)",w:"A public pledge the tracker can monitor."},
    {t:"Community Land Act, 2016",u:"https://new.kenyalaw.org/akn/ke/act/2016/27",k:"law/policy",s:"Kenya Law",w:"Registering, consenting to and leasing community land."}]
},
/* ---- CHALLENGE lane ---- */
"Dangote Refinery ESIA Intervention": {
  id:"dangote-lamu-esia",
  description:"Aliko Dangote has chosen Lamu County for a proposed East African refinery, with reported capacity of 650,000–700,000 barrels per day and a reported cost of about KSh2.2 trillion, linked to the LAPSSET corridor. President Ruto and Dangote broke ground on 30 September 2026. The day before, the Malindi Environment and Land Court ordered the status quo kept on disputed land in the Hindi/Manda Magogoni area after 133 Chandavai residents said it is their ancestral home. Greenpeace Africa has called for approvals to stop until an independent ESIA is completed and published, and Save Lamu has asked for access to the assessment's findings; no published ESIA or NEMA licence could be confirmed. The project threatens mangroves, coral reefs, seagrass and fishing livelihoods. Lamu communities already hold a strong precedent: the 2019 Tribunal ruling cancelling the Lamu coal plant licence, upheld by the Environment and Land Court in October 2025.",
  objectives:[
    "Get the refinery ESIA and any NEMA licensing documents published and open to meaningful public participation",
    "Produce an independent legal and technical review of ESIA gaps (alternatives, climate, marine and mangrove, cumulative LAPSSET impacts)",
    "Equip affected Lamu communities (fishers, farmers, Chandavai and Mokowe landholders) to take part in the EIA process and any litigation",
    "Preserve the option of a National Environment Tribunal appeal or constitutional petition if a licence is issued unlawfully"],
  activities:[
    "Submit ATI requests to NEMA, the Ministry of Energy and Petroleum and the developer for the ESIA and licence status",
    "Commission an expert ESIA review using ELAW's methodology, the Save Lamu precedents and Climate Change Act requirements",
    "Hold community legal-literacy and evidence-gathering sessions on land tenure, fisheries and mangrove use",
    "File written comments within the NEMA public-comment window and attend hearings",
    "Provide legal support (Katiba Institute) and watching briefs in the Malindi ELC land case and any NET appeal",
    "Publish a plain-language briefing for media, county assembly and development finance institutions"],
  outcomes:[
    "The ESIA is in the public domain, with an independent critique on record with NEMA",
    "Affected communities participate meaningfully and their evidence is admissible",
    "Licensing is either improved by binding conditions or challenged on a strong legal record"],
  partners:[
    ["Katiba Institute","Lead legal partner; represented Save Lamu in the coal case"],
    ["Save Lamu","Community coalition; appellant in the coal case"],
    ["Natural Justice","Environmental and community-rights lawyers; part of the Lamu coal legal team"],
    ["Greenpeace Africa","Campaign and communications"],
    ["deCOALonize","Coalition convenor and community mobilisation in Lamu"]],
  legal:[
    "Constitution of Kenya 2010, Arts. 10, 35, 42, 69, 70",
    "EMCA 1999 and EIA/Audit Regulations, incl. appeal to the National Environment Tribunal",
    "Petroleum Act 2019 (midstream licensing) and Climate Change Act 2016",
    "Fair Administrative Action Act 2015"],
  resources:[
    {t:"Dangote picks Lamu for Sh2.2tn oil refinery project",u:"https://capitalfm.africa/dangote-picks-lamu-for-sh2-2tn-oil-refinery-project/",k:"article",s:"Capital FM (Jul 2026)",w:"The announcement: site, capacity, cost and timeline."},
    {t:"Greenpeace Africa statement on the proposed Dangote oil refinery in Lamu",u:"https://www.greenpeace.org/africa/en/press/61255/greenpeace-africa-statement-on-the-proposed-dangote-oil-refinery-in-lamu/",k:"article",s:"Greenpeace Africa (Jul 2026)",w:"Call for an independent public ESIA; marine and fisheries risks."},
    {t:"Malindi court declines to halt launch of Dangote refinery construction in Lamu",u:"https://www.arise.tv/malindi-court-declines-to-halt-launch-of-dangote-refinery-construction-in-lamu/",k:"article",s:"Arise TV (Sep 2026)",w:"Status-quo order on disputed land after Chandavai residents sued."},
    {t:"Africa's richest man launches Kenya oil refinery despite land protests",u:"https://www.myjoyonline.com/africas-richest-man-launches-kenya-oil-refinery-despite-land-protests/",k:"article",s:"MyJoyOnline (Oct 2026)",w:"Groundbreaking amid protests; Save Lamu seeks the assessment findings."},
    {t:"Save Lamu & 5 others v NEMA & Amu Power [2019] KENET 98",u:"https://new.kenyalaw.org/akn/ke/judgment/kenet/2019/98/eng@2019-06-26",k:"case study",s:"National Environment Tribunal",w:"EIA licence set aside for deficient participation and weak alternatives analysis."},
    {t:"Court upholds revocation of Lamu coal plant licence",u:"https://katibainstitute.org/historic-victory-for-lamu-community-and-environmental-justice-court-upholds-revocation-of-lamu-coal-plant-licence/",k:"case study",s:"Katiba Institute (Oct 2025)",w:"ELC upheld the NET decision on Arts. 42/69, climate gaps and precaution."},
    {t:"Guidebook for Evaluating Mining Project EIAs",u:"https://elaw.org/resource/guidebook-evaluating-mining-project-eias",k:"toolkit",s:"ELAW",w:"Step-by-step EIA review method adaptable to industrial ESIAs."}]
},
"Siaya Nuclear FPIC Campaign": {
  id:"siaya-nuclear-fpic",
  description:"Kenya's Nuclear Power and Energy Agency (NuPEA) has moved its proposed first nuclear power plant from Uyombo in Kilifi to the Lake Victoria shore in Siaya County; reports point to the Luanda Kotieno / Sakwa area of Bondo Sub-County. Mongabay reports a 1,000 MW plant estimated at US$3.8 billion; NuPEA targets construction from 2027 and grid connection by 2034. Residents disrupted a public-participation forum in Sakwa in May 2026, after which NuPEA's CEO said nothing would be built without broad, informed community consent. The Luo Council of Elders rejected the project in December 2025, and in July 2026 a sensitisation meeting at Lenya, Central Sakwa ended in gunfire and arrests, according to the Kenya Anti-Nuclear Alliance. An independent review requested by NEMA reportedly found NuPEA's Strategic Environmental and Social Assessment fell short of IAEA good practice. Siting is still open — now is the time to secure real free, prior and informed consent.",
  objectives:[
    "Hold NuPEA to its public commitment that no plant is built without broad, informed community consent",
    "Give Siaya communities independent, accessible information on siting, safety, water use and waste",
    "Document participation failures and rights violations as a legal record",
    "Secure a lawful, transparent site-selection and SESA/ESIA process"],
  activities:[
    "Run village-level FPIC and legal-literacy dialogues in Sakwa, Luanda Kotieno and nearby lakeshore communities (FAO FPIC manual)",
    "Request the final SESA, site-selection reports and the independent review via ATI requests",
    "Commission plain-language expert review of siting, cooling-water and Lake Victoria impacts",
    "Monitor NuPEA forums and keep a rights-violations log with affidavits",
    "Obtain Katiba Institute legal opinion and prepare a possible petition, drawing on Ngolo v NuPEA (Kilifi)",
    "Convene a community assembly to agree a community FPIC protocol for NuPEA and Siaya County"],
  outcomes:[
    "A community-endorsed FPIC protocol formally submitted to NuPEA and Siaya County",
    "Key SESA and site documents public, with an independent critique on record",
    "An evidence base ready for legal action if consent standards are breached"],
  partners:[
    ["Katiba Institute","Lead legal partner: constitutional and participation litigation"],
    ["Kenya Anti-Nuclear Alliance (KANA)","Community alliance from the Kilifi campaign"],
    ["Greenpeace Africa","Campaign support and communication"],
    ["SAFCEI","Regional anti-nuclear and just-energy-transition ally"]],
  legal:[
    "Constitution of Kenya 2010, Arts. 10, 35, 42, 69, 70",
    "Nuclear Regulatory Act 2019 — licensing and siting of nuclear installations",
    "EMCA 1999 and EIA/SEA regulations",
    "FPIC standards: IFC Performance Standard 7 and UNDRIP; Fair Administrative Action Act 2015"],
  resources:[
    {t:"Africa's largest freshwater lake could be site of Kenya's nuclear power plant",u:"https://news.mongabay.com/2025/10/africas-largest-freshwater-lake-could-be-site-of-kenyas-nuclear-power-plant/",k:"research",s:"Mongabay (Oct 2025)",w:"Siting, cost, and the review finding the SESA below IAEA good practice."},
    {t:"Siaya residents reject Kenya's nuclear plant at public forum",u:"https://www.greenpeace.org/africa/en/blog/60749/siaya-residents-reject-kenyas-nuclear-plant-at-public-forum-and-the-government-must-listen/",k:"article",s:"Greenpeace Africa (May 2026)",w:"Forum disruption and lack of prior consultation."},
    {t:"NuPEA: No nuclear project without community consent",u:"https://www.the-star.co.ke/news/2026-05-23-nupea-no-nuclear-project-without-community-consent",k:"article",s:"The Star (May 2026)",w:"The CEO's public consent commitment and the 2027/2034 timeline."},
    {t:"KANA condemns violence against communities in Siaya",u:"https://safcei.org/press-release-kana-condemns-violence-against-communities-in-siaya-and-calls-for-a-rights-based-just-energy-transition-in-kenya/",k:"article",s:"SAFCEI / KANA (Jul 2026)",w:"Shooting and arrests at the Lenya forum, and community demands."},
    {t:"Ngolo & another v NuPEA & 2 others [2024] KEELC 14071",u:"https://new.kenyalaw.org/akn/ke/judgment/keelc/2024/14071/eng@2024-12-19",k:"case study",s:"ELC Malindi / Kenya Law",w:"Kilifi precedent on nuclear siting and participation."},
    {t:"Nuclear Regulatory Act (Cap. 243)",u:"https://new.kenyalaw.org/akn/ke/act/2019/29",k:"law/policy",s:"Kenya Law",w:"Licensing and regulation of nuclear installations."},
    {t:"Free, Prior and Informed Consent: Manual for Project Practitioners",u:"https://www.fao.org/3/I6190E/i6190e.pdf",k:"toolkit",s:"FAO (2016)",w:"Practical guide for designing a community consent protocol."}]
},
"Mui Basin Community Evidence": {
  id:"mui-basin-evidence",
  description:"Kitui County's Mui Basin holds Kenya's main coal deposits, explored by government since 1999 over about 500 km². In 2011 the State awarded a concession to Fenxi Mining Industry, and a Benefit Sharing Agreement followed in 2013. Communities challenged the project: in 2015 the High Court at Machakos found public participation adequate only 'subject to continuing engagement', holding that participation must continue into the EIA phase and that Kitui County Government must be involved in negotiating resource contracts. A 2015 ActionAid/Both ENDS case study warned that tens of thousands of people could be displaced and that women would be hit hardest. In 2020 residents rejected coal mining until health, compensation and resettlement concerns were met, while the government signalled plans to auction more coal blocks. Systematic community documentation of land, water, livelihoods and consultation will provide the evidence base needed for judicial review of any concession, EIA or licensing decision.",
  objectives:[
    "Build a rigorous, admissible community evidence base on land, water, livelihoods and consultation",
    "Monitor whether the continuing-engagement and county-involvement requirements of the 2015 judgment are met",
    "Prepare the legal groundwork for judicial review of any concession, block auction or EIA licence",
    "Amplify community and women's voices in Kitui and national energy decisions"],
  activities:[
    "Train community monitors in participatory mapping, GPS, photo and affidavit documentation",
    "Collect gender-disaggregated baseline household data on land, water, livelihoods and graves",
    "Request concession, Benefit Sharing Agreement and block-auction documents from ministries and the county",
    "Compile a legal compliance audit against the 2015 Machakos judgment and the Mining Act 2016",
    "Brief Kitui County Assembly, MPs and faith leaders; hold community validation meetings"],
  outcomes:[
    "A verified, litigation-ready community evidence dossier in counsel's hands",
    "Documented gaps between the State's obligations under the 2015 ruling and practice",
    "Stronger community capacity to engage in or challenge any future EIA or licensing"],
  partners:[
    ["Catholic Justice and Peace Commission (Kitui Diocese)","Community convening"],
    ["Haki Madini Kenya","Extractives-community rights network"],
    ["Kituo cha Sheria","Legal aid and paralegal training"],
    ["Natural Justice","Legal support on community rights"],
    ["deCOALonize","Anti-coal coalition convenor; national advocacy"]],
  legal:[
    "Constitution of Kenya 2010, Arts. 10, 40, 42, 60, 63, 69, 70",
    "Mining Act 2016 — consent, compensation and community development agreements",
    "Community Land Act 2016",
    "EMCA 1999 and EIA Regulations; Fair Administrative Action Act 2015 (judicial review)"],
  resources:[
    {t:"In the Matter of the Mui Coal Basin Local Community [2015] eKLR",u:"https://judicialportal.informea.org/sites/default/files/court-case/In%20the%20Matter%20of%20the%20Mui%20Coal%20Basin%20Local%20Community.pdf",k:"case study",s:"High Court Machakos via InforMEA",w:"Core precedent on effective, continuing public participation."},
    {t:"Coal mining disrupts people's livelihoods in Mui Basin, Kenya",u:"https://www.bothends.org/uploaded_files/inlineitem/151123_HR_Kenya_def.pdf",k:"research",s:"Both ENDS / ActionAid (2015)",w:"Displacement risk and gendered impacts."},
    {t:"Residents reject coal mining plans over health concerns",u:"https://peopledaily.digital/?p=25377",k:"article",s:"People Daily (2020)",w:"Community position and grievances over benefit sharing."},
    {t:"State plans to auction more coal blocks in Mui Basin",u:"https://www.businessdailyafrica.com/bd/markets/capital-markets/state-plans-to-auction-more-coal-blocks-in-mui-basin-3016816",k:"article",s:"Business Daily (2020)",w:"The State's continuing intent to auction blocks."},
    {t:"Save Lamu & 5 others v NEMA & Amu Power [2019] KENET 98",u:"https://new.kenyalaw.org/akn/ke/judgment/kenet/2019/98/eng@2019-06-26",k:"case study",s:"National Environment Tribunal",w:"Coal-specific precedent: licence quashed over participation and climate."},
    {t:"Mining Act, 2016",u:"https://new.kenyalaw.org/akn/ke/act/2016/12",k:"law/policy",s:"Kenya Law",w:"Licensing, consent, compensation and community obligations."},
    {t:"Guidebook for Evaluating Mining Project EIAs",u:"https://elaw.org/resource/guidebook-evaluating-mining-project-eias",k:"toolkit",s:"ELAW",w:"Helps communities review any coal mining EIA."}]
},
"EACOP Finance & Solidarity Brief": {
  id:"eacop-finance-brief",
  description:"The East African Crude Oil Pipeline (EACOP) would carry Ugandan crude from Hoima to Tanga, Tanzania. With many banks pulling back, BankTrack reports the developers now expect to self-finance almost 90%, with a first lending tranche of only US$755 million. In 2025 EACOP Ltd named KCB, through KCB Bank Uganda, among the banks partially financing the project — a direct Kenyan finance link. Kenyans protested at Jeevanjee Gardens in May 2025 in solidarity with the #KCB11 activists arrested in Kampala. Kenya has its own oil ambitions: in November 2025 the Energy CS sent the US$6.1 billion South Lokichar field development plan to Parliament, targeting first oil by December 2026. In 2023 the East African Court of Justice dismissed a regional EACOP challenge as time-barred. A Kenyan evidence brief connecting EACOP finance, Turkana oil and the just transition can support finance-withdrawal advocacy while Kenyan decisions remain open.",
  objectives:[
    "Produce a Kenyan-focused evidence brief on EACOP finance exposure (esp. KCB Group) and links to Turkana oil",
    "Support the regional StopEACOP finance-withdrawal campaign with Kenyan shareholder and customer advocacy",
    "Inform parliamentary scrutiny of the South Lokichar plan from a just-transition perspective"],
  activities:[
    "Map Kenyan financial institutions' exposure to EACOP and Lokichar using filings and BankTrack data",
    "Write and publish the brief, with legal analysis under the Petroleum Act 2019 and Climate Change Act",
    "Engage KCB Group through AGM questions, letters and investor briefings",
    "Hold a Turkana–Nairobi dialogue on oil, community rights and just-transition alternatives",
    "Provide solidarity and legal-defence liaison for activists facing arrest"],
  outcomes:[
    "A published, cited Kenyan EACOP finance brief adopted by regional partners",
    "A formal engagement record with at least one Kenyan financier",
    "Just-transition and community-rights issues raised in parliamentary review of Lokichar"],
  partners:[
    ["StopEACOP Coalition","Regional campaign hub; finance-withdrawal strategy"],
    ["Natural Justice","Legal analysis; co-applicant in the EACJ EACOP case"],
    ["BankTrack","Bank-exposure research and investor engagement data"],
    ["350Africa.org","Climate campaigning and mobilisation"],
    ["Greenpeace Africa","Oil and gas campaigning"]],
  legal:[
    "Petroleum Act 2019 — licensing and parliamentary ratification of field development plans",
    "Climate Change Act 2016 — climate considerations in public decisions",
    "Constitution of Kenya 2010, Arts. 10, 42, 69, 71 (ratification of natural-resource agreements)",
    "EMCA 1999 and EIA Regulations"],
  resources:[
    {t:"TotalEnergies financiers beware: EACOP is eating up money, nature and livelihoods",u:"https://www.banktrack.org/article/totalenergies_financiers_beware_eacop_is_eating_up_money_nature_and_livelihoods",k:"research",s:"BankTrack (Oct 2025)",w:"Current financing picture and named financiers."},
    {t:"StopEACOP Coalition condemns the partial financing of EACOP",u:"https://allafrica.com/stories/202503280085.html",k:"article",s:"AllAfrica / StopEACOP (Mar 2025)",w:"Names the financiers, incl. KCB Bank Uganda."},
    {t:"Kenyans protest KCB involvement in EACOP, stand with #KCB11",u:"https://www.stopeacop.net/our-news/kenyans-protest-kcb-involvement-in-eacop-stand-in-solidarity-with-kcb11",k:"article",s:"StopEACOP (May 2025)",w:"Kenyan solidarity action and the KCB link."},
    {t:"EACJ judgment frustrating civil society's pursuit of justice in EACOP case",u:"https://naturaljustice.org/east-africa-court-of-justice-hands-down-judgment-frustrating-civil-societys-pursuit-of-justice-in-eacop-case/",k:"case study",s:"Natural Justice (2023)",w:"Regional litigation history and lessons on filing deadlines."},
    {t:"Kenya okays Sh793bn oil production plan",u:"https://www.the-star.co.ke/news/2025-11-25-kenya-okays-sh793bn-oil-production-plan",k:"article",s:"The Star (Nov 2025)",w:"South Lokichar plan sent to Parliament."},
    {t:"Petroleum Act, 2019",u:"https://new.kenyalaw.org/akn/ke/act/2019/2",k:"law/policy",s:"Kenya Law",w:"Upstream licensing and field development plan approval."}]
},
"NRT Conservancy Accountability": {
  id:"nrt-accountability",
  description:"The Northern Rangelands Trust (NRT) supports a network of community conservancies across northern Kenya — the Oakland Institute's 2021 report Stealth Game put this at 39 conservancies covering about 42,000 km², alleging loss of grazing land, governance capture and abuses by armed ranger units. NRT also runs the Northern Kenya Rangelands Carbon Project, described as the world's largest soil-carbon project; Survival International's 2023 Blood Carbon report questioned whether communities gave free, prior and informed consent. In January 2025 the Environment and Land Court (Osman & 164 others v NRT) declared the Cherab and Biliqo-Bulesa conservancies in Isiolo were set up without due public participation and ordered community land registration under the Community Land Act. Verra then suspended the carbon project for a second time in May 2025. Pastoralist communities in Marsabit, Isiolo and Samburu need support to document impacts, register land and enforce the ruling.",
  objectives:[
    "Support implementation and enforcement of the January 2025 Isiolo judgment",
    "Help communities in Isiolo, Marsabit and Samburu document conservancy and carbon-project impacts to evidentiary standard",
    "Advance community land registration under the Community Land Act 2016",
    "Push for FPIC, transparency and lawful benefit-sharing in carbon projects on community land"],
  activities:[
    "Train community paralegals and documenters in Isiolo, Marsabit and Samburu",
    "Monitor compliance with the Osman v NRT orders and report breaches to counsel",
    "Support community land registration and community assembly processes",
    "Compile a carbon-project accountability dossier for Verra, buyers and the Climate Change Directorate",
    "Run community briefings on carbon-market rights using NEMA's community guide"],
  outcomes:[
    "A court-order compliance record and timely enforcement applications where needed",
    "Progress on community land registration in target wards",
    "Communities able to assert consent and benefit-sharing rights in any carbon project"],
  partners:[
    ["Oakland Institute","Investigative research and international advocacy"],
    ["Survival International","Carbon-project scrutiny and buyer/certifier engagement"],
    ["Namati Kenya","Community land protection and paralegal model"],
    ["Kenya Land Alliance","Land policy and community land registration"]],
  legal:[
    "Community Land Act 2016",
    "Constitution of Kenya 2010, Arts. 10, 40, 63 (community land), 69",
    "Climate Change Act 2016 (amended 2023) and Climate Change (Carbon Markets) Regulations 2024",
    "FPIC under UNDRIP and IFC Performance Standard 7"],
  resources:[
    {t:"Osman & 164 others v Northern Rangelands Trust & 8 others [2025] KEELC 99",u:"https://new.kenyalaw.org/akn/ke/judgment/keelc/2025/99/eng@2025-01-24",k:"case study",s:"ELC / Kenya Law (Jan 2025)",w:"Isiolo conservancies declared illegal; land registration ordered."},
    {t:"Stealth Game: 'Community' Conservancies Devastate Land & Lives in Northern Kenya",u:"https://www.oaklandinstitute.org/sites/oaklandinstitute.org/files/kenya-stealth-game-community-conservancies.pdf",k:"research",s:"Oakland Institute (2021)",w:"Core investigation into NRT land practices and governance."},
    {t:"Blood Carbon: how a carbon offset scheme makes millions from Indigenous land",u:"https://survivalinternational.org/news/13659",k:"research",s:"Survival International (2023)",w:"FPIC failures and carbon-accounting concerns."},
    {t:"Carbon credits scheme suspended again",u:"https://www.survivalinternational.org/news/14211",k:"article",s:"Survival International (May 2025)",w:"Verra's second suspension after the Isiolo ruling."},
    {t:"Indigenous land disputes cloud Kenya's carbon market ambitions",u:"https://www.climatechangenews.com/2025/05/15/indigenous-land-disputes-cloud-kenyas-carbon-market-ambitions/",k:"article",s:"Climate Home News (May 2025)",w:"Independent overview of the ruling and carbon-market policy."},
    {t:"Carbon Markets in Kenya: A Simplified Community Guide",u:"https://ke.chm-cbd.net/sites/ke/files/inline-files/carbon-markets-in-kenya-a-simplified-community-guide-compressed.pdf",k:"toolkit",s:"NEMA with WWF-Kenya (2025)",w:"Plain-language guide to community rights and benefit-sharing."},
    {t:"Community Land Act, 2016",u:"https://new.kenyalaw.org/akn/ke/act/2016/27",k:"law/policy",s:"Kenya Law",w:"Legal basis for registration and community consent."}]
},
"River Yala Gold-Cyanide Enforcement Petition": {
  id:"river-yala-petition",
  description:"The River Yala rises in the Nandi highlands and flows through Kakamega, Vihiga and Siaya into the Yala Swamp — Kenya's largest freshwater wetland and a Key Biodiversity Area — before reaching Lake Victoria. Artisanal and illegal gold processing in the catchment relies on mercury and, increasingly, sodium cyanide. In March 2021 NEMA banned gold mining in Bondo and Rarieda after reports of cyanide use and livestock deaths. In August 2026 the Water Resources Authority began a crackdown on unlicensed dredging on the Yala in Kakamega, naming mercury and cyanide washing into the river, and senators criticised NEMA's failure to police the operations. Earlier research recorded lead, chromium and cadmium in Yala Swamp water and soils above WHO/FAO limits. The Owino Uhuru Supreme Court decision (2024) confirms regulators can be held liable for failing to prevent toxic pollution. A public-interest petition can turn sporadic crackdowns into sustained, enforceable obligations.",
  objectives:[
    "Compel NEMA, WRA and county governments to enforce pollution and licensing law along the River Yala",
    "Generate credible water, sediment and health evidence to support a constitutional petition",
    "Secure remediation and continuing monitoring obligations, following the Owino Uhuru precedent"],
  activities:[
    "Map processing sites and discharge points with communities in Siaya, Kakamega, Vihiga and Nandi",
    "Commission accredited laboratory testing of water, sediment and fish for mercury, cyanide and heavy metals",
    "Collect affidavits on health, livestock losses and livelihood impacts",
    "Serve demand letters and ATI requests on NEMA, WRA and the State Department for Mining",
    "File a public-interest petition under Arts. 42, 69 and 70 seeking enforcement, remediation and monitoring orders",
    "Run community health-awareness sessions on safe water use and mercury/cyanide risks"],
  outcomes:[
    "A filed petition supported by laboratory and community evidence",
    "Binding or negotiated enforcement and monitoring commitments from regulators",
    "Better-informed communities and reduced exposure along the river and swamp"],
  partners:[
    ["Centre for Justice Governance and Environmental Action (CJGEA)","Lead litigant in Owino Uhuru; toxic-pollution litigation"],
    ["Nature Kenya","Yala Swamp conservation partner"],
    ["Katiba Institute","Constitutional public-interest litigation"],
    ["Kituo cha Sheria","Legal aid and paralegal support"]],
  legal:[
    "Constitution of Kenya 2010, Arts. 42, 43, 69, 70",
    "EMCA 1999 and the Water Quality Regulations",
    "Mining Act 2016 — artisanal mining permits and environmental obligations",
    "Water Act 2016 and Water Resources Regulations"],
  resources:[
    {t:"WRA launches crackdown on illegal gold miners polluting River Yala",u:"https://www.kenyans.co.ke/news/126461-wra-launches-crackdown-illegal-gold-miners-polluting-river-yala",k:"article",s:"Kenyans.co.ke (Aug 2026)",w:"Regulator confirms mercury and cyanide use by unlicensed operators."},
    {t:"Senators issue ultimatum to foreign firms over illegal River Yala dredging",u:"https://streamlinefeed.co.ke/news/senators-issue-ultimatum-to-foreign-firms-over-illegal-river-yala-dredging",k:"article",s:"Streamline Feed / NTV (Aug 2026)",w:"Political pressure and criticism of NEMA."},
    {t:"NEMA bans gold mining in Bondo and Rarieda",u:"https://www.the-star.co.ke/news/2021-03-02-nema-bans-gold-mining-in-bondo-and-rarieda",k:"article",s:"The Star (2021)",w:"Shows NEMA has known of cyanide pollution since 2021 — useful for proving inaction."},
    {t:"Heavy metals, nitrogen and phosphorus in water and soils of Yala Swamp",u:"https://repository.nrf.go.ke/entities/publication/38efa79b-6f3e-46e2-84cf-d826718b90d5",k:"data",s:"Univ. of Eldoret via NRF repository",w:"Baseline: Pb, Cr and Cd above WHO/FAO limits."},
    {t:"A community's fight to save its lifeline: Yala Swamp",u:"https://www.birdlife.org/news/2025/02/01/a-communitys-fight-to-save-its-lifeline-yala-swamp/",k:"article",s:"BirdLife International (2025)",w:"Yala Swamp's KBA status, threats and community action."},
    {t:"Supreme Court holds state agencies accountable in Owino Uhuru case",u:"https://ohrh.law.ox.ac.uk/advancing-environmental-justice-the-supreme-court-of-kenya-holds-state-agencies-accountable-for-environmental-harm-in-owino-uhuru-case/",k:"case study",s:"Oxford Human Rights Hub",w:"KSh1.3bn compensation and KSh700m clean-up upheld against regulators."},
    {t:"Metal Refinery (EPZ) lawsuit re lead pollution in Kenya",u:"https://business-humanrights.org/en/metal-refinery-epz-lawsuit-re-lead-pollution-in-kenya",k:"case study",s:"Business & Human Rights Resource Centre",w:"Case history of Owino Uhuru from filing to appeal."}]
},
/* ---- BUILD lane ---- */
"Coastal Citizen Journalism Expansion": {
  id:"coastal-citizen-journalism",
  description:"Communities on Kenya's south and north coast face pressure from mining and land conversion with little independent local documentation. In Kwale, about 480 households were moved from Maumba village for the titanium sands project now run by Base Titanium; residents later reported unfair or missing compensation and more than 100 unresolved land disputes. Nearby Mrima Hill — a sacred Digo forest — holds rare-earth deposits now drawing foreign interest, and residents fear eviction or exclusion from benefits. In Magarini, Kilifi, salt-farm expansion has been linked to salinised farmland and contaminated freshwater, documented by the KNCHR. In each case evidence such as dead coconut trees, flooded plots and missed meetings fades before regulators act. LAWA (Lamu Women Alliance) already runs a youth citizen-journalism project in Lamu, funded by AJWS through deCOALonize, working with Aweer/Boni, Sanye, Bajuni, Orma and Swahili communities — and Lamu's community documentation fed the 2019 tribunal ruling against the coal plant. Extending that proven model to Kwale and Kilifi gives affected families a lasting way to record, verify and publish what is happening.",
  objectives:[
    "Set up trained citizen-journalist cells in Kwale (Msambweni, Lunga Lunga) and Kilifi (Magarini)",
    "Produce verified, evidence-grade records of land, compensation and environmental harms around mining and salt sites",
    "Connect local documentation to legal aid, regulators and mainstream media",
    "Transfer the Lamu peer-mentoring model so the cells can run on their own"],
  activities:[
    "Recruit and train 20–30 youth reporters in mobile video, safe documentation and fact-checking (WITNESS Video as Evidence)",
    "Run peer exchanges and mentoring with LAWA's Lamu youth citizen journalists",
    "Track and publish a case log of compensation, CDA benefit-sharing and Mrima Hill land issues",
    "File ATI requests to NEMA, the Mining Ministry and county planning offices",
    "Hold quarterly community screenings and feedback forums",
    "Set up a referral protocol with legal-aid partners and KNCHR"],
  outcomes:[
    "Two active, self-managing citizen-journalism cells covering Kwale and Kilifi",
    "A public, verifiable archive used in complaints, litigation and media",
    "More community voice in CDA committees, ESIA consultations and licensing"],
  partners:[
    ["Lamu Women Alliance (LAWA)","Runs the AJWS-funded (via deCOALonize) youth citizen-journalism project in Lamu; model owner and peer mentor"],
    ["Natural Justice","Legal support; documented Kilifi salt-farm harms and the Lamu coal case"],
    ["Transparency International Kenya / Kwale Mining Alliance","Mining-governance network; CDA monitoring"],
    ["Kenya National Commission on Human Rights (KNCHR)","Complaints; investigated Magarini salt-sector abuses"],
    ["WITNESS","Evidence-grade video documentation training"]],
  legal:[
    "Mining Act 2016: community development agreements and compensation",
    "Community Land Act 2016",
    "EMCA 1999: ESIA public participation",
    "Constitution of Kenya 2010, Art. 35, and the Access to Information Act 2016"],
  resources:[
    {t:"Relocated for a mine project, Kenyans say compensation was unfair or missing",u:"https://globalpressjournal.com/africa/kenya/many-kenyans-relocated-mine-project-say-compensation-unfair-missing/",k:"article",s:"Global Press Journal",w:"~480 households relocated for the Kwale titanium project."},
    {t:"Global powers eye rare earths at Kenya's Mrima Hill",u:"https://www.citizen.digital/news/global-powers-eye-rare-earths-at-kenyas-mrima-hill-n371950",k:"article",s:"Citizen Digital / AFP (Oct 2025)",w:"Competition for Mrima Hill and community fears."},
    {t:"Lockdown in Kilifi County, Kenya: what lies on the other side?",u:"https://naturaljustice.org/lockdown-in-kilifi-county-kenya-what-lies-on-the-other-side/",k:"case study",s:"Natural Justice (2020)",w:"Salt-pan expansion salinising a Magarini family's farm."},
    {t:"Rights violations in Malindi: case study on Magarini salt mining",u:"https://sird.ealawsociety.org/wp-content/uploads/2023/02/Case-Study-Magarini-Salt-Mining-Rights-Violations-in-Malindi.pdf",k:"case study",s:"SIRD / East Africa Law Society",w:"Community complaints and KNCHR recommendations."},
    {t:"Great day for Lamu as Tribunal dismisses coal plant license",u:"https://naturaljustice.org/great-day-for-lamu-as-tribunal-dismisses-coal-plant-license/",k:"case study",s:"Natural Justice (2019)",w:"The Lamu precedent the model builds on."},
    {t:"Video as Evidence: Environmental Defense Guide",u:"https://library.witness.org/product/vae-environmental-defense-guide/",k:"toolkit",s:"WITNESS",w:"Training guide for recording usable video evidence."}]
},
"Gap-County Response Fund": {
  id:"gap-county-fund",
  description:"The coalition's mapping shows several counties where mining, energy, land or water projects put heavy pressure on communities, yet no organised local group is documenting or responding. Funding tends to go to established Nairobi or international NGOs, while grassroots groups closest to the harm are often too small or too new to qualify. This fund pools resources and re-grants them to seed one documentation partner in each of five gap counties, with decisions made by a panel that includes affected communities and reviewed every quarter. The approach follows proven practice: Global Greengrants Fund uses regional advisory boards to direct small grants to grassroots environmental groups; Kenya-based UAF-Africa makes rapid grants for natural-resource and climate work; and an independent review of the Climate Justice Resilience Fund found that funding re-granters effectively reached local organisations. The fund also positions grantees to access county climate funds under FLLoCA.",
  objectives:[
    "Seed one accountable documentation partner in each of five under-served counties",
    "Run transparent, participatory grant decisions that include affected communities",
    "Build grantees' capacity to document and to access county climate finance (FLLoCA / CCCF)",
    "Produce shared learning on what local response infrastructure needs"],
  activities:[
    "Confirm the five gap counties using the National Map's ranking",
    "Set up a participatory grant panel of community and coalition representatives",
    "Issue five 24-month seed grants with simple application and reporting in English or Kiswahili",
    "Hold quarterly reviews and peer-learning calls; reallocate where needed",
    "Provide accompaniment on documentation, financial management and safeguarding",
    "Connect grantees to county Climate Change Planning Committees and FLLoCA processes"],
  outcomes:[
    "Five functioning county-level documentation partners where none existed",
    "A tested, documented participatory re-granting mechanism",
    "Grantees better placed to secure county, national and donor funding"],
  partners:[
    ["Global Greengrants Fund","Participatory grantmaking model; possible co-funder"],
    ["Urgent Action Fund-Africa (UAF-Africa)","Kenya-based rapid-response funder"],
    ["Kenya Community Development Foundation (KCDF)","Kenyan community-philanthropy practitioner"],
    ["Global Fund for Community Foundations (GFCF)","#ShiftThePower convener"],
    ["East Africa Philanthropy Network (EAPN)","Regional funder engagement"]],
  legal:[
    "Climate Change Act 2016: county climate action and participation",
    "County Climate Change Fund laws under the FLLoCA programme",
    "Public Benefit Organizations Act 2013",
    "Constitution of Kenya 2010, Arts. 10 and 174 (participation and devolution)"],
  resources:[
    {t:"Deciding Together: Shifting Power and Resources Through Participatory Grantmaking",u:"https://participatorygrantmaking.issuelab.org/resource/deciding-together-shifting-power-and-resources-through-participatory-grantmaking",k:"toolkit",s:"GrantCraft / Candid",w:"Standard guide to designing participatory grant decisions."},
    {t:"How Greengrants makes grants (FAQ)",u:"https://greengrants.org/faqs",k:"case study",s:"Global Greengrants Fund",w:"The advisory-board small-grants model."},
    {t:"A participatory approach to funding climate justice: learnings and challenges",u:"https://learningforfunders.candid.org/?p=9556",k:"article",s:"Candid Learning for Funders",w:"Lessons from participatory climate-justice funding."},
    {t:"Review of the Climate Justice Resilience Fund's Phase I portfolio",u:"https://www.cjrfund.org/s/CJRF-Phase-1-portfolio-Executive-Summary.pdf",k:"research",s:"ISET-International / CJRF (2023)",w:"Evidence that re-granters reach local groups."},
    {t:"Community Philanthropy and #ShiftThePower",u:"https://globalfundcommunityfoundations.org/what-we-stand-for/shiftthepower/",k:"article",s:"Global Fund for Community Foundations",w:"Principles of community-led funding."},
    {t:"#ShiftThePower: a global conversation rooted in the communities",u:"https://kcdf.or.ke/shiftthepower-a-global-conversation-rooted-in-the-communities/",k:"article",s:"KCDF",w:"Kenyan uptake of #ShiftThePower."},
    {t:"New US$150 million program to strengthen Kenya's resilience to climate change (FLLoCA)",u:"https://www.worldbank.org/en/news/press-release/2021/10/26/new-us-150-million-program-to-strengthen-kenya-s-resilience-to-climate-change",k:"law/policy",s:"World Bank (2021)",w:"County-level climate finance grantees can tap."}]
},
"Rift Lakes Response Node": {
  id:"rift-lakes-node",
  description:"Kenya's Rift Valley lakes have risen sharply. A 2021 Government of Kenya/UNDP scoping report found rising water in the Rift Valley lakes, Turkwel Gorge Dam and Lake Victoria had displaced about 75,987 households (379,935 people) across 13 counties, swamping homes, schools, farms and roads. Satellite analysis shows Lake Baringo grew by about 112 km² between 2002 and 2020, and officials worry its fresh water could mix with saline Lake Bogoria, home of the Endorois, whose 2010 African Commission victory is still not fully implemented. Geothermal expansion adds pressure: the World Bank Inspection Panel found the most vulnerable people in Maasai villages relocated for Olkaria IV suffered harm, and Menengai communities report pollution and flawed consultation — in March 2025 a court revoked one plant's licence. Around Lake Naivasha, competition for water and shoreline land fuels low-level conflict. A standing local node can track these overlapping pressures.",
  objectives:[
    "Establish a community documentation and response node serving Baringo and Nakuru",
    "Track displacement from rising lakes and the delivery of relief and resettlement",
    "Monitor geothermal impacts and consultation quality at Menengai and Olkaria",
    "Document water abstraction and access conflicts around Naivasha and Nakuru"],
  activities:[
    "Train 15–20 community monitors in Baringo (lakeshore, Bogoria) and Nakuru (Menengai, Naivasha)",
    "Keep a displacement and loss register linked to county and NDMA response data",
    "Log geothermal incidents (noise, H2S, brine ponds, tremors) and share with NEMA and lender grievance mechanisms",
    "Hold community forums to prepare for ESIA hearings and court processes",
    "Publish a 12-month Rift Lakes situation report"],
  outcomes:[
    "A functioning, community-run node with a trained monitor network",
    "An evidence base used in county planning, grievance mechanisms and litigation",
    "Stronger participation of affected communities in energy and water decisions"],
  partners:[
    ["Endorois Welfare Council","Lake Bogoria community institution"],
    ["Natural Justice","Legal support to Menengai communities"],
    ["Menengai West Stakeholders Forum (MWESFO)","Residents affected by Menengai geothermal"],
    ["National Drought Management Authority (NDMA)","County early-warning data"],
    ["RCMRD","Satellite hazard mapping of lake expansion"]],
  legal:[
    "Water Act 2016: abstraction permits and WRUAs",
    "Energy Act 2019 and EMCA 1999: geothermal ESIA and licensing",
    "Climate Change Act 2016",
    "African Charter on Human and Peoples' Rights — Endorois decision (2010)"],
  resources:[
    {t:"Rising Water Levels in Kenya's Rift Valley Lakes, Turkwel Gorge Dam and Lake Victoria",u:"https://ir-library.ku.ac.ke/handle/123456789/22851",k:"research",s:"Government of Kenya & UNDP (2021)",w:"Official scoping report on displacement across 13 counties."},
    {t:"Rising water levels in Kenya's Rift Valley lakes: 379,935 people require urgent assistance",u:"https://www.downtoearth.org.in/africa/rising-water-levels-in-kenya-s-rift-valley-lakes-379-935-people-require-urgent-humanitarian-assistance-80128",k:"article",s:"Down To Earth (2021)",w:"Accessible summary of the report."},
    {t:"Rising Lakes in the Rift Valley in Kenya",u:"https://digitalearthafrica.org/en_za/rising-lakes-in-the-rift-valley-in-kenya",k:"data",s:"Digital Earth Africa / RCMRD",w:"Satellite evidence of Baringo's growth and Bogoria mixing risk."},
    {t:"Kenya: Electricity Expansion Project (Olkaria IV) — Inspection Panel case",u:"https://www.inspectionpanel.org/panel-cases/electricity-expansion-project",k:"case study",s:"World Bank Inspection Panel",w:"Harm to the most vulnerable in the Olkaria resettlement."},
    {t:"Kenya: the true impact of the AfDB-funded Menengai geothermal project",u:"https://rightsindevelopment.org/news/kenya-menengai-geothermal/",k:"article",s:"International Accountability Project (2025)",w:"Community-documented impacts and the 2025 licence revocation."},
    {t:"Observing the water-conflict nexus at Lake Naivasha",u:"https://rptu.de/friedensakademie/blog/archiv/alle-beitraege/water-shortages-at-water-rich-bodies-observing-the-water-conflict-nexus-at-lake-naivasha",k:"research",s:"Frieden Akademie, RPTU",w:"Shrinking public water access and low-visibility conflict."},
    {t:"The Endorois decision: four years on",u:"https://minorityrights.org/the-endorois-decision-four-years-on-the-endorois-still-await-action-by-the-government-of-kenya/",k:"case study",s:"Minority Rights Group",w:"The Lake Bogoria land-rights ruling and weak implementation."}]
},
"Northern Rangelands Documentation Corps": {
  id:"northern-rangelands-corps",
  description:"Pastoralist communities in Kenya's northern drylands face repeated drought, water scarcity and pressure on communal land. In August 2022 NDMA's national bulletin placed Mandera, Wajir and Marsabit in the drought Alarm phase, and a REACH assessment in Marsabit found more than 70% of livestock died between May and November 2022. In January 2026 Mandera was again in alarm phase, with more than 335,000 people needing assistance and livestock moving into Wajir, raising conflict concerns. Land is also contested: the Oakland Institute alleges community conservancies in Marsabit and neighbouring counties have taken prime grazing land, and delays under the Community Land Act leave communities exposed. Researchers argue that formal early warning is too centralised and disconnected from pastoralists' own knowledge. A shared, community-run documentation corps across the three counties would turn local observation into timely, credible evidence.",
  objectives:[
    "Build a shared corps of trained community documenters across Wajir, Marsabit and Mandera",
    "Combine pastoralist indicators with NDMA bulletins into a community early-warning feed",
    "Document water-point, grazing and communal-land disputes and how responses are delivered",
    "Feed evidence into county steering groups, FLLoCA planning and community land registration"],
  activities:[
    "Recruit and train ~30 documenters (gender- and clan-balanced) in mobile data collection and safety",
    "Co-design place-specific drought and water indicators with elders and herders",
    "Publish monthly community bulletins that complement NDMA early-warning reports",
    "Map water points, boreholes and grazing access; log disputes and relief-delivery gaps",
    "Support communities through Community Land Act registration and grievance processes",
    "Hold cross-county exchanges and annual review meetings"],
  outcomes:[
    "A standing three-county documentation corps with shared data standards",
    "Earlier, locally validated warnings reaching county and NDMA decision-makers",
    "A documented record supporting communal land and water rights claims"],
  partners:[
    ["National Drought Management Authority (NDMA)","Statutory drought early-warning authority"],
    ["PACIDA","Marsabit-based pastoralist organisation"],
    ["Wajir South Development Association (WASDA)","Wajir water and drought response"],
    ["Arid Lands Development Focus (ALDEF)","ASAL development organisation in the north-east"],
    ["International Livestock Research Institute (ILRI)","Research on pastoral knowledge and anticipatory action"]],
  legal:[
    "National Drought Management Authority Act 2016",
    "Community Land Act 2016",
    "Water Act 2016",
    "Climate Change Act 2016 / FLLoCA county climate funds"],
  resources:[
    {t:"National Drought Early Warning Bulletin, August 2022",u:"https://reliefweb.int/report/kenya/national-drought-early-warning-bulletin-august-2022",k:"data",s:"NDMA via ReliefWeb",w:"Places Mandera, Wajir and Marsabit in Alarm phase."},
    {t:"Uncertainty, pastoral knowledge and early warning: drought management in northern Kenya",u:"https://www.frontierspartnerships.org/articles/10.3389/past.2024.13006/full",k:"research",s:"Pastoralism journal / ILRI (2024)",w:"The case for participatory, place-specific indicators."},
    {t:"Multi-sectoral Impact of Drought Assessment, Marsabit County",u:"https://repository.impact-initiatives.org/document/reach/a3546cba/REACH_KEN2207-Multi-sectoral-impact-of-drought_FS_Marsabit_November-2022.pdf",k:"data",s:"REACH",w:"Livestock losses and household water insecurity."},
    {t:"Drought pushes Mandera into alarm phase as 335k locals require assistance",u:"https://www.the-star.co.ke/counties/north-eastern/2026-01-08-mandera-in-drought-alarm-phase-as-335k-locals-need-assistance",k:"article",s:"The Star (Jan 2026)",w:"Current situation and conflict risk."},
    {t:"Stealth Game: 'Community' Conservancies Devastate Land & Lives in Northern Kenya",u:"https://www.oaklandinstitute.org/sites/oaklandinstitute.org/files/kenya-stealth-game-community-conservancies.pdf",k:"research",s:"Oakland Institute (2021)",w:"Conservancy land claims and land-registration delays."},
    {t:"Women trekked long distances to search for water… but not anymore (Buna, Wajir)",u:"https://kenya.oxfam.org/node/213",k:"case study",s:"Oxfam Kenya",w:"Wajir water-access case with WASDA and ALDEF."},
    {t:"Community Early Warning Systems: Guiding Principles",u:"https://www.ifrc.org/document/community-early-warning-systems-guiding-principles",k:"toolkit",s:"IFRC",w:"Principles for community-based early warning."}]
},
"Lake Victoria Basin Response Hub": {
  id:"lake-victoria-hub",
  description:"Lake Victoria supports fishing, water supply and transport for lakeshore counties, but faces several pressures at once. Officials say raw sewage and industrial and chemical waste are now the lake's main problem, and Winam Gulf near Kisumu suffers eutrophication. Water hyacinth has returned from river mouths including the Kuja-Migori, Nyando and Sondu. Upstream, artisanal gold mining in Migori uses mercury and cyanide that contaminate rivers feeding the lake, and a University of Nottingham study found microplastics in all tilapia gut samples tested. In May 2026, residents of Sakwa in Siaya disrupted a public forum on a proposed nuclear power plant moved from Kilifi after opposition there. Each problem has a few single-issue advocates, but nobody tracks them together. A shared hub across Kisumu, Siaya, Homa Bay and Migori would combine monitoring, documentation and rapid response.",
  objectives:[
    "Create a shared four-county hub coordinating documentation of lake pollution and threats",
    "Track industrial effluent, mining runoff, plastics and hyacinth with community monitors",
    "Ensure lakeshore communities are informed and heard in nuclear-plant and other ESIA processes",
    "Turn documentation into regulatory complaints, media coverage and policy engagement"],
  activities:[
    "Appoint a hub coordinator and county focal points in Kisumu, Siaya, Homa Bay and Migori",
    "Train beach-management-unit and youth monitors in pollution reporting and basic water testing",
    "Run pollution patrols and publish incident maps with the Lake Victoria Waterkeeper",
    "Hold community briefings on nuclear-plant siting, consultation rights and ESIA participation",
    "Organise plastics audits at landing beaches and produce data for county waste plans",
    "Publish a twice-yearly 'State of the Kenyan Lake' report"],
  outcomes:[
    "A functioning basin hub with active monitors in all four counties",
    "Documented incidents escalated to NEMA, WRA and county governments",
    "Stronger, better-informed community participation in major project decisions"],
  partners:[
    ["Ecofinder Kenya / Kenya Lake Victoria Waterkeeper","Pollution patrols and investigations"],
    ["Greenpeace Africa","Campaigning on the Siaya nuclear proposal"],
    ["CEJAD","Mercury and ASGM investigations in Migori"],
    ["InfoNile","Water-focused journalism network"],
    ["Lake Victoria Basin Commission (EAC)","Regional transboundary engagement"]],
  legal:[
    "EMCA 1999 and Water Quality Regulations: effluent standards and ESIA",
    "Water Act 2016",
    "Nuclear Regulatory Act 2019",
    "Sustainable Waste Management Act 2022"],
  resources:[
    {t:"Lake Victoria's choking crisis: how pollution is turning Winam Gulf into a stinking hazard",u:"https://thestandard.ke/business/amp/nyanza/article/2001552635/lake-victorias-choking-crisis-how-pollution-is-turning-winam-gulf-into-a-stinking-hazard",k:"article",s:"The Standard (Jul 2026)",w:"Sewage, runoff and eutrophication in Winam Gulf."},
    {t:"Reprieve to fisherfolk as hyacinth dissipates but pollution accumulates",u:"https://news.scienceafrica.co.ke/water-hyacinth-staining-source-of-livelihood-for-western-kenyans/",k:"article",s:"Science Africa",w:"Hyacinth trends and officials naming sewage/industrial waste."},
    {t:"Investigation of microplastics in tilapia in Lake Victoria, Kenya",u:"https://eprints.nottingham.ac.uk/66057",k:"research",s:"University of Nottingham",w:"Microplastics found in all gut samples."},
    {t:"Downstream environmental impacts of artisanal and small-scale gold mining",u:"https://www.bgs.ac.uk/geology-projects/integrated-resource-management-in-eastern-africa/impacts-of-artisanal-and-small-scale-gold-mining/",k:"research",s:"British Geological Survey",w:"How Migori mercury and cyanide reach the lake."},
    {t:"Siaya residents reject Kenya's nuclear plant at public forum",u:"https://www.greenpeace.org/africa/en/blog/60749/siaya-residents-reject-kenyas-nuclear-plant-at-public-forum-and-the-government-must-listen/",k:"article",s:"Greenpeace Africa (May 2026)",w:"Community rejection in Sakwa, Bondo."},
    {t:"Kenya Lake Victoria Waterkeeper",u:"https://ecofinderkenya.org/kenya-lake-victoria-waterkeeper-2/",k:"case study",s:"Ecofinder Kenya",w:"Model of a community watershed patrol programme."}]
},
"Western Gold-Belt Mercury Watch": {
  id:"gold-belt-mercury-watch",
  description:"Artisanal and small-scale gold mining supports thousands of families in western Kenya, and in Kakamega and Migori it relies heavily on mercury, with cyanide used on tailings. Kenya submitted a National Action Plan on ASGM under the Minamata Convention in 2022. A 2023 study found dry-season mercury in all sampled boreholes near Migori mines above the KEBS drinking-water limit. British Geological Survey research in the Kakamega–Vihiga belt found soils, sediments and drinking-water sources in mining villages highly polluted, and IPS reports some Kakamega wells at up to ten times WHO mercury guidelines. Residents say NEMA has been slow to act, and contamination varies with season, so one-off studies miss it. A permanent community monitoring node — trained citizen samplers working with accredited labs — would give mining communities ongoing, credible data and support the planetGOLD shift to mercury-free processing.",
  objectives:[
    "Establish a community-run mercury and cyanide monitoring node covering Kakamega, Migori and Vihiga",
    "Train citizen samplers to collect chain-of-custody water and soil samples across seasons",
    "Publish results to communities, counties and NEMA, and track the response",
    "Support miners' cooperatives in the shift to mercury-free processing under the NAP"],
  activities:[
    "Train 20–25 citizen samplers (miners, women processors, youth) in safe sampling and chain of custody",
    "Run quarterly dry- and wet-season sampling of boreholes, wells, rivers and tailings with accredited lab analysis",
    "Set up a public results dashboard and hold village feedback meetings",
    "Run health-risk awareness sessions on amalgam burning and exposure of children and pregnant women",
    "Submit evidence to NEMA and county environment departments; follow up on remediation",
    "Link cooperatives to planetGOLD Kenya demonstration sites"],
  outcomes:[
    "A two-year, seasonal community dataset on mercury and cyanide in the gold belt",
    "Documented regulatory responses or remediation at priority sites",
    "Greater community awareness and uptake of mercury-free practices"],
  partners:[
    ["CEJAD","Mapped mercury use at Migori ASGM sites (with IPEN)"],
    ["planetGOLD Kenya (UNEP/GEF/UNDP)","Mercury-free demonstration sites"],
    ["Migori County Department of Environment","MOU on reducing mercury in ASGM"],
    ["British Geological Survey (BGS)","Geochemistry and health research partner"],
    ["NEMA","Regulator receiving monitoring evidence"]],
  legal:[
    "Minamata Convention on Mercury (Kenya is a Party): Art. 7 and Annex C",
    "Kenya National Action Plan on ASGM (2022)",
    "Mining Act 2016: artisanal permits and environmental obligations",
    "EMCA 1999, Water Quality Regulations and KEBS drinking-water standards"],
  resources:[
    {t:"National Action Plan for Kenya on Artisanal and Small-Scale Gold Mining",u:"https://minamataconvention.org/en/documents/national-action-plan-kenya-2022",k:"law/policy",s:"Minamata Convention (2022)",w:"Kenya's official ASGM mercury-reduction plan."},
    {t:"Mercury levels in groundwater near ASGM mines in Migori County",u:"https://ir-library.ku.ac.ke/handle/123456789/27244",k:"research",s:"EA Journal of Environment & Natural Resources (2023)",w:"Seasonal mercury above KEBS limits — justifies seasonal monitoring."},
    {t:"Linking geochemistry and health in ASGM in the Kakamega-Vihiga gold belt",u:"https://www.bgs.ac.uk/news/linking-geochemistry-and-health-in-artisanal-and-small-scale-gold-mining-in-the-kakamega-vihiga-gold-belt-kenya/",k:"research",s:"British Geological Survey (2024)",w:"Polluted soils, water and crops in mining villages."},
    {t:"Artisanal miners in Western Kenya move away from mercury",u:"https://allafrica.com/stories/202604020006.html",k:"article",s:"IPS via AllAfrica (Apr 2026)",w:"Well contamination and planetGOLD site status."},
    {t:"Inventory and mapping of mercury use in ASGM sites in Migori",u:"https://www.planetgold.org/imeap-report-inventory-and-mapping-mercury-use-artisanal-small-scale-gold-mining-asgm-sites-migori",k:"case study",s:"CEJAD / IPEN via planetGOLD",w:"Kenyan CSO mapping at Mikei, Masara and Osiri."},
    {t:"Illegal gold mining harms Kakamega's ecosystem",u:"https://nation.africa/kenya/health/illegal-gold-mining-harms-kakamega-s-ecosystem-4549456",k:"article",s:"Nation",w:"Community testimony on contaminated rivers and slow NEMA response."},
    {t:"Reducing Mercury Use in ASGM: A Practical Guide",u:"https://www.unep.org/resources/report/reducing-mercury-use-artisanal-and-small-scale-gold-mining-practical-guide",k:"toolkit",s:"UNEP",w:"Training guide for miners and cooperatives."}]
}
};
/* ---- Funders named in the portfolio (verified Oct 2026) ---- */
var FUNDERS = {
  "AJWS":{n:"American Jewish World Service — Africa programme",u:"https://ajws.org/where-we-work/africa/",how:"Relationship-based",note:"Kenya is a core AJWS country and 'Land, Water and Climate Justice' is an issue area. No open call is published — approach through AJWS staff (ajws@ajws.org)."},
  "FIMI Ayni":{n:"FIMI — AYNI Fund (International Indigenous Women's Forum)",u:"https://fimi-iiwf.org/en/convocatorias/ayni-call-for-proposals-2026/",how:"Annual open call",note:"For groups led by Indigenous women, with grant + accompaniment (land rights and climate resilience themes). The 2026 round ran in June — watch for the next call and check eligibility."},
  "Africa Climate Fund":{n:"Africa Climate Fund",u:"https://africanclimatefoundation.org/grant-making",how:"Existing relationship",note:"Already in the coalition's funder network (funds MKNF community adaptation — see Directory), so approach through that relationship. The link is the closest public grant page found (African Climate Foundation, invitation-only)."},
  "CivFund":{n:"CivFund — CivSource Africa",u:"https://www.civsourceafrica.com/civfund-1",how:"Calls / contact",note:"'Fund of funds' incl. the Zishaye Grassroots Fund (land, water and climate justice). Several funds are Uganda-focused; watch CivSource calls for proposals."},
  "HBS":{n:"Heinrich Böll Stiftung — Nairobi office",u:"https://ke.boell.org/en",how:"Partnership-based",note:"Funds Kenyan partners through its Sustainable Development and Democratic Spaces programmes. No open calls — approach programme staff."},
  "FEMNET":{n:"FEMNET — African Women's Development and Communication Network",u:"https://www.femnet.org/2025/06/policy-influencing-and-advocacy-grants/",how:"Members' calls",note:"Occasional re-granting (e.g. 2025 climate-advocacy grants, members only). Fits women-led partners that join FEMNET."},
  "VJCA":{n:"Voices for Just Climate Action (Hivos/WWF alliance)",u:"https://hivos.org/story/looking-back-at-the-voices-for-just-climate-action-program-in-kenya/",how:"Programme ended",note:"The Kenya programme has ended. Approach former alliance members (Hivos, WWF-Kenya) individually."},
  "350 Africa":{n:"350.org Africa / 350 Kenya",u:"https://world.350.org/kenya",how:"Campaign ally",note:"A campaigning movement, not a grantmaker — a partner for mobilisation rather than a funding source."},
  "FFNPT":{n:"Fossil Fuel Non-Proliferation Treaty Initiative",u:"https://fossilfueltreaty.org/",how:"Campaign ally",note:"A coalition, not a grantmaker — useful for endorsement and advocacy alignment."},
  "NAMATI":{n:"Namati — Kenya Land, Environmental & Climate Justice",u:"https://namati.org/our-impact/kenya-lec/",how:"Technical partner",note:"Legal-empowerment organisation (community paralegals, land registration). A technical partner rather than an open grantmaker."},
  "UAF-Africa":{n:"Urgent Action Fund-Africa — How to apply",u:"https://www.uaf-africa.org/apply-for-a-grant/",how:"Open applications",note:"Nairobi-based. Accepts applications for rapid-response, advocacy & alliance-building and protection grants (women's rights defenders; urgent, unanticipated needs)."},
  "HIVOS":{n:"Hivos — calls for proposals",u:"https://hivos.org/call/",how:"Occasional calls",note:"Re-grants under donor programmes (environmental rights, civic space). Monitor the calls page and Hivos East Africa."}
};
var FUNDER_POOLS = {
  pooled:[
    {n:"Global Greengrants Fund — Africa",u:"https://www.greengrants.org/where-we-work/africa/",how:"Nomination via advisors",note:"Small grassroots grants directed by regional advisory boards; build visibility with East African advisors."},
    {n:"Climate Justice Resilience Fund",u:"https://cjrfund.org/our-grants/",how:"Mostly invitation",note:"Pooled climate-justice fund with East Africa as a priority region (women, youth, Indigenous peoples)."}],
  litigation:[
    {n:"Natural Justice — African Environmental Defenders Fund",u:"https://naturaljustice.org/human-rights-defenders-fund/",how:"Emergency applications",note:"Support for land/environmental defenders under threat, plus legal support via the African Environmental Lawyers Network."},
    {n:"ELAW — Environmental Law Alliance Worldwide",u:"https://elaw.org/what-we-do",how:"In-kind support",note:"Free legal and scientific support (EIA critiques, expert evidence) to public-interest lawyers."},
    {n:"Legal Empowerment Fund",u:"https://legalempowermentfund.org/what-we-do/",how:"Calls",note:"Flexible support to grassroots legal-empowerment groups; has funded Kenyan groups."}]
};
var FUNDER_ALIAS = { "Pooled sub-grant":"pooled", "Pooled donor facility":"pooled", "Strategic litigation fund":"litigation" };

/* ---- Proposal-writing guides (shared) ---- */
var GUIDES = [
  {t:"How to write a concept note",u:"https://www.fundsforngos.org/proposal-writing/how-to-write-a-concept-note/",s:"FundsforNGOs",w:"Most funders ask for a 1–3 page concept note first."},
  {t:"Logframe vs Theory of Change: what's the difference?",u:"https://tools4dev.org/blog/logframe-vs-theory-of-change-whats-the-difference/",s:"tools4dev",w:"Build both for individual or consortium proposals."},
  {t:"Memorandum of Understanding (MoU) template",u:"https://tools4dev.org/resources/memorandum-of-understanding-mou-template/",s:"tools4dev",w:"Agree consortium roles before a joint proposal.",collab:true},
  {t:"Free, Prior and Informed Consent: manual for project practitioners",u:"https://www.fao.org/3/I6190E/i6190e.pdf",s:"FAO",w:"Consent process for community documentation and mapping."},
  {t:"Video as Evidence field guide",u:"https://vae.witness.org/video-as-evidence-field-guide/",s:"WITNESS",w:"Capture and store footage so it stands up as evidence."},
  {t:"Data Protection Act, 2019 (Kenya)",u:"https://www.odpc.go.ke/wp-content/uploads/2024/02/TheDataProtectionAct__No24of2019.pdf",s:"ODPC Kenya",w:"Rules for testimonies, photos and contact lists."},
  {t:"Safeguarding Resource and Support Hub",u:"https://safeguardingsupporthub.org/",s:"RSH",w:"Free safeguarding policies and tools for small CSOs."},
  {t:"Information for grantseekers",u:"https://greengrants.org/wp-content/uploads/2023/10/Info-for-Grantseekers_2023.pdf",s:"Global Greengrants Fund",w:"Grant databases and funder directories for grassroots groups."}
];

/* =================================================================
   Modal + proposal templates
   ================================================================= */
var LANE_NAME = { document:"Document", challenge:"Challenge", build:"Build" };
var KIND_LABEL = { "research":"Research", "article":"Article", "case study":"Case study", "law/policy":"Law / policy", "toolkit":"Toolkit", "data":"Data" };

function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
function slug(s){ return String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }

function fundersFor(p){
  var out = [], seen = {};
  String(p.funder||"").split(/\s*·\s*/).forEach(function(name){
    name = name.trim(); if(!name) return;
    if(FUNDER_ALIAS[name]){
      FUNDER_POOLS[FUNDER_ALIAS[name]].forEach(function(f){ if(!seen[f.u]){ seen[f.u]=1; out.push({label:name, f:f}); } });
    } else if(FUNDERS[name] && !seen[FUNDERS[name].u]){ seen[FUNDERS[name].u]=1; out.push({label:name, f:FUNDERS[name]}); }
  });
  return out;
}

/* ---------- styles ---------- */
var CSS = [
".project.pk-click{ cursor:pointer; position:relative; transition:background .15s ease; }",
".project.pk-click:hover{ background:var(--panel-2); }",
".project.pk-click:focus-visible{ outline:2px solid var(--green); outline-offset:-2px; }",
".pk-open{ display:inline-flex; align-items:center; gap:6px; margin-top:12px; font-size:.68rem; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:var(--green); }",
".project.pk-click:hover .pk-open{ text-decoration:underline; }",
".pk-overlay{ position:fixed; inset:0; z-index:220; background:rgba(4,9,7,.78); display:none; align-items:flex-start; justify-content:center; padding:24px 12px; overflow-y:auto; -webkit-overflow-scrolling:touch; }",
".pk-overlay.on{ display:flex; }",
".pk-modal{ background:var(--panel); border:1px solid var(--line-2); width:100%; max-width:860px; margin:auto; box-shadow:0 24px 70px -20px rgba(0,0,0,.75); }",
".pk-head{ padding:18px 20px 0; border-bottom:1px solid var(--line); }",
".pk-head-top{ display:flex; gap:12px; align-items:flex-start; }",
".pk-head h3{ font-family:Lora,serif; font-size:1.3rem; font-weight:600; flex:1; min-width:0; margin:0; line-height:1.25; }",
".pk-kick{ font-size:.6rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:var(--muted-dim); margin:0 0 6px; }",
".pk-x{ background:none; border:0; color:var(--muted); font-size:1.5rem; line-height:1; cursor:pointer; padding:2px 6px; }",
".pk-x:hover{ color:var(--text); }",
".pk-meta{ display:flex; flex-wrap:wrap; gap:6px 16px; margin:12px 0 0; font-size:.75rem; color:var(--muted-dim); }",
".pk-meta b{ color:var(--text); font-weight:700; }",
".pk-tabs{ display:flex; gap:2px; margin-top:14px; overflow-x:auto; scrollbar-width:none; }",
".pk-tabs::-webkit-scrollbar{ display:none; }",
".pk-tab{ background:none; border:0; border-bottom:2px solid transparent; color:var(--muted); font:inherit; font-size:.7rem; font-weight:800; letter-spacing:.08em; text-transform:uppercase; padding:10px 12px; cursor:pointer; white-space:nowrap; }",
".pk-tab[aria-selected=true]{ color:var(--text); border-bottom-color:var(--green); }",
".pk-body{ padding:18px 20px 22px; }",
".pk-pane{ display:none; }",
".pk-pane.on{ display:block; }",
".pk-body h4{ font-size:.62rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:var(--muted-dim); margin:20px 0 8px; }",
".pk-pane > h4:first-child{ margin-top:0; }",
".pk-desc{ font-size:.92rem; line-height:1.65; color:var(--text); margin:0; }",
".pk-gap{ font-size:.8rem; color:var(--ember); margin:14px 0 0; padding-left:11px; border-left:2px solid var(--ember-hot); }",
".pk-cols{ display:grid; gap:0 22px; }",
"@media(min-width:700px){ .pk-cols{ grid-template-columns:1fr 1fr; } }",
".pk-list{ margin:0; padding-left:18px; font-size:.84rem; line-height:1.55; color:var(--muted); }",
".pk-list li{ margin:0 0 5px; }",
".pk-list b{ color:var(--text); font-weight:700; }",
".pk-res{ display:grid; gap:1px; background:var(--line); border:1px solid var(--line); }",
".pk-r{ background:var(--panel); padding:12px 14px; display:block; color:inherit; text-decoration:none; }",
".pk-r:hover{ background:var(--panel-2); text-decoration:none; }",
".pk-r .t{ font-size:.88rem; font-weight:700; color:var(--text); line-height:1.4; }",
".pk-r .t::after{ content:' ↗'; color:var(--green); font-weight:400; }",
".pk-r .s{ font-size:.7rem; color:var(--muted-dim); margin-top:3px; }",
".pk-r .w{ font-size:.8rem; color:var(--muted); margin-top:5px; line-height:1.45; }",
".pk-kind{ display:inline-block; font-size:.54rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; padding:2px 7px; border-radius:100px; border:1px solid var(--line-2); color:var(--muted); margin-right:6px; vertical-align:1px; }",
".pk-kind.k-law{ color:#7FB0FF; border-color:rgba(127,176,255,.4); }",
".pk-kind.k-case{ color:var(--ember); border-color:rgba(238,148,85,.4); }",
".pk-kind.k-toolkit{ color:var(--green); border-color:rgba(98,199,155,.4); }",
".pk-how{ display:inline-block; font-size:.56rem; font-weight:800; letter-spacing:.08em; text-transform:uppercase; padding:2px 7px; border-radius:100px; background:var(--panel-3); color:var(--muted); margin-left:6px; vertical-align:1px; }",
".pk-tpl{ display:grid; gap:12px; }",
"@media(min-width:700px){ .pk-tpl{ grid-template-columns:1fr 1fr; } }",
".pk-card{ border:1px solid var(--line-2); padding:16px; background:var(--panel-2); display:flex; flex-direction:column; }",
".pk-card h5{ font-family:Lora,serif; font-size:1.02rem; font-weight:600; margin:0 0 6px; }",
".pk-card p{ font-size:.8rem; color:var(--muted); line-height:1.5; margin:0 0 10px; }",
".pk-card ul{ margin:0 0 14px; padding-left:16px; font-size:.76rem; color:var(--muted-dim); line-height:1.5; flex:1; }",
".pk-card .btn{ align-self:flex-start; }",
".pk-note{ font-size:.74rem; color:var(--muted-dim); line-height:1.5; margin:14px 0 0; }",
".pk-foot{ display:flex; flex-wrap:wrap; gap:9px; justify-content:space-between; align-items:center; padding:14px 20px; border-top:1px solid var(--line); }",
".pk-foot .pk-note{ margin:0; }",
"body.pk-lock{ overflow:hidden; }"
].join("\n");

/* ---------- modal shell ---------- */
var overlay, current;
function ensureShell(){
  if(overlay) return;
  var st = document.createElement("style"); st.id = "pk-style"; st.textContent = CSS; document.head.appendChild(st);
  overlay = document.createElement("div");
  overlay.className = "pk-overlay"; overlay.setAttribute("aria-hidden","true");
  overlay.innerHTML = '<div class="pk-modal" role="dialog" aria-modal="true" aria-labelledby="pkTitle"></div>';
  document.body.appendChild(overlay);
  overlay.addEventListener("click", function(e){
    if(e.target === overlay || (e.target.closest && e.target.closest("[data-pk-close]"))) close();
    var tab = e.target.closest && e.target.closest(".pk-tab");
    if(tab) selectTab(tab.getAttribute("data-tab"));
    var dl = e.target.closest && e.target.closest("[data-pk-dl]");
    if(dl) download(dl.getAttribute("data-pk-dl"));
    var ib = e.target.closest && e.target.closest("[data-pk-interest]");
    if(ib) registerInterest(ib);
    var cp = e.target.closest && e.target.closest("[data-pk-copy]");
    if(cp) copyLink(cp);
  });
  document.addEventListener("keydown", function(e){ if(e.key === "Escape" && overlay.classList.contains("on")) close(); });
}
function selectTab(k){
  overlay.querySelectorAll(".pk-tab").forEach(function(t){ t.setAttribute("aria-selected", t.getAttribute("data-tab")===k ? "true":"false"); });
  overlay.querySelectorAll(".pk-pane").forEach(function(p){ p.classList.toggle("on", p.getAttribute("data-pane")===k); });
}
var lastFocus;
function open(p, tab){
  ensureShell();
  var kit = KITS[p.title]; if(!kit) return;
  current = { p:p, kit:kit };
  lastFocus = document.activeElement;
  overlay.firstChild.innerHTML = render(p, kit);
  if(INTEREST_DONE[p.title]){ var ib0 = overlay.querySelector("[data-pk-interest]"); if(ib0){ ib0.disabled = true; ib0.textContent = "Interest registered ✓ — we'll be in touch"; } }
  overlay.classList.add("on"); overlay.setAttribute("aria-hidden","false");
  document.body.classList.add("pk-lock");
  selectTab(tab || "overview");
  overlay.scrollTop = 0;
  var x = overlay.querySelector(".pk-x"); if(x) x.focus();
  try{ var u = new URL(location.href); u.searchParams.set("project", kit.id); history.replaceState(null,"",u.pathname+u.search+u.hash); }catch(_){}
}
function close(){
  if(!overlay) return;
  overlay.classList.remove("on"); overlay.setAttribute("aria-hidden","true");
  document.body.classList.remove("pk-lock");
  try{ var u = new URL(location.href); u.searchParams.delete("project"); history.replaceState(null,"",u.pathname+u.search+u.hash); }catch(_){}
  if(lastFocus && lastFocus.focus) lastFocus.focus();
}
/* "I'm interested": logs the signed-in member against this project in opportunity_interest
   (the same table the email buttons feed), so it appears under Interest in the admin console. */
var INTEREST_DONE = {};
function registerInterest(btn){
  var p = current && current.p; if(!p) return;
  var sb = window.HAUTH || window.MZ_SB;
  var fallback = function(){
    location.href = "mailto:admin@mazingirakenya.org?subject=" + encodeURIComponent("Interested in: " + p.title) +
      "&body=" + encodeURIComponent("Hello,\n\nOur organisation is interested in the Je, Hatua? project \"" + p.title + "\".\n\nOrganisation:\nContact:\n");
  };
  if(!sb || !sb.auth){ fallback(); return; }
  btn.disabled = true; btn.textContent = "Registering…";
  sb.auth.getSession().then(function(r){
    var u = r && r.data && r.data.session && r.data.session.user;
    if(!u){ btn.disabled = false; btn.textContent = "I'm interested — tell the coalition"; fallback(); return; }
    var md = u.user_metadata || {};
    return sb.from("opportunity_interest").insert({
      opportunity_title: "Fundable project: " + p.title,
      opportunity_url: kitUrl(p),
      partner_name: md.org || md.organisation || md.full_name || md.name || "",
      partner_email: u.email || ""
    }).then(function(res){
      if(res && res.error) throw res.error;
      INTEREST_DONE[p.title] = 1;
      btn.textContent = "Interest registered ✓ — we'll be in touch";
    });
  }).catch(function(){ btn.disabled = false; btn.textContent = "I'm interested — tell the coalition"; fallback(); });
}
function copyLink(btn){
  var u = location.origin + location.pathname + "?project=" + current.kit.id + "#ajesasa";
  var done = function(){ var t = btn.textContent; btn.textContent = "Link copied"; setTimeout(function(){ btn.textContent = t; }, 1600); };
  if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(done, function(){ prompt("Copy this link:", u); });
  else prompt("Copy this link:", u);
}

/* ---------- render ---------- */
function kindClass(k){ return k==="law/policy"?"k-law":k==="case study"?"k-case":k==="toolkit"?"k-toolkit":""; }
function render(p, kit){
  var lane = LANE_NAME[p.lane] || p.lane;
  var funders = fundersFor(p);
  var h = '';
  h += '<div class="pk-head"><div class="pk-head-top"><div style="flex:1;min-width:0">'+
       '<p class="pk-kick">'+esc(lane)+' lane · '+(p.status==="dev"?"In development":"Idea")+' · Proposal kit</p>'+
       '<h3 id="pkTitle">'+esc(p.title)+'</h3></div>'+
       '<button class="pk-x" type="button" data-pk-close aria-label="Close">×</button></div>'+
       '<div class="pk-meta"><span>County <b>'+esc(p.county)+'</b></span><span>Sector <b>'+esc(p.sector)+'</b></span><span>Indicative budget <b>'+esc(p.budget)+'</b></span></div>'+
       '<div class="pk-tabs" role="tablist">'+
         tabBtn("overview","Overview")+tabBtn("evidence","Evidence & sources ("+kit.resources.length+")")+
         tabBtn("funders","Funders")+tabBtn("templates","Proposal templates")+
       '</div></div>';
  h += '<div class="pk-body">';
  /* overview */
  h += '<div class="pk-pane" data-pane="overview">'+
       '<h4>Project description</h4><p class="pk-desc">'+esc(kit.description)+'</p>'+
       '<p class="pk-gap">Gap it closes: '+esc(p.gap)+'</p>'+
       '<div class="pk-cols"><div><h4>Objectives</h4>'+ul(kit.objectives)+'</div>'+
       '<div><h4>Indicative activities</h4>'+ul(kit.activities)+'</div></div>'+
       '<div class="pk-cols"><div><h4>Expected outcomes</h4>'+ul(kit.outcomes)+'</div>'+
       '<div><h4>Potential partners</h4><ul class="pk-list">'+kit.partners.map(function(x){ return '<li><b>'+esc(x[0])+'</b> — '+esc(x[1])+'</li>'; }).join("")+'</ul></div></div>'+
       '<h4>Legal & policy hooks</h4>'+ul(kit.legal)+
       '<p class="pk-note">Activities, targets and partners are a starting point drawn from public sources — adapt them to your organisation and confirm partner roles directly before submitting.</p></div>';
  /* evidence */
  h += '<div class="pk-pane" data-pane="evidence"><h4>Research, reporting, case law & toolkits for this proposal</h4>'+
       '<div class="pk-res">'+kit.resources.map(resItem).join("")+'</div>'+
       '<h4>Proposal-writing guides</h4><div class="pk-res">'+GUIDES.map(function(g){ return resItem({t:g.t,u:g.u,k:"toolkit",s:g.s,w:g.w}); }).join("")+'</div>'+
       '<p class="pk-note">Sources checked October 2026. News items reflect the date shown; re-check fast-moving cases before citing.</p></div>';
  /* funders */
  h += '<div class="pk-pane" data-pane="funders"><h4>Funder fit named in the portfolio</h4>'+
       (funders.length ? '<div class="pk-res">'+funders.map(function(x){
          return '<a class="pk-r" href="'+esc(x.f.u)+'" target="_blank" rel="noopener noreferrer"><div class="t">'+esc(x.f.n)+'</div>'+
                 '<div class="s">Listed as: '+esc(x.label)+'<span class="pk-how">'+esc(x.f.how)+'</span></div><div class="w">'+esc(x.f.note)+'</div></a>';
        }).join("")+'</div>' : '<p class="pk-desc">No funder listed yet.</p>')+
       '<p class="pk-note">Several funders work by invitation or relationship rather than open calls — a short intro email with the concept note usually comes before a full proposal. Live calls also appear in the Opportunities stream.</p></div>';
  /* templates */
  h += '<div class="pk-pane" data-pane="templates"><h4>Download a pre-filled proposal template (Word)</h4>'+
       '<div class="pk-tpl">'+
         '<div class="pk-card"><h5>Individual organisation</h5><p>For one organisation applying on its own.</p>'+
           '<ul><li>Cover sheet & executive summary</li><li>Problem statement pre-filled with this project\'s evidence</li><li>Objectives, workplan & logframe</li><li>Consent, safeguarding & data protection</li><li>Budget table, risks, sustainability</li><li>Annex checklist & references</li></ul>'+
           '<button class="btn btn--green" type="button" data-pk-dl="individual">Download individual template</button></div>'+
         '<div class="pk-card"><h5>Collective / consortium</h5><p>For two or more organisations applying together under a lead applicant.</p>'+
           '<ul><li>Everything in the individual template, plus:</li><li>Consortium members & why this partnership</li><li>Governance, decision-making & MoU</li><li>Division-of-labour matrix</li><li>Budget split by partner & sub-granting</li><li>Joint MEL, data-sharing & conflict resolution</li></ul>'+
           '<button class="btn btn--ember" type="button" data-pk-dl="collective">Download consortium template</button></div>'+
       '</div>'+
       '<p class="pk-note">Files open in Word, Google Docs or LibreOffice. Grey italic text is guidance — replace or delete it. Rename sections to match a funder\'s own form where one exists.</p></div>';
  h += '</div>';
  h += '<div class="pk-foot"><p class="pk-note">Budgets are indicative planning figures, not quotes.</p>'+
       '<span style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn--ghost" type="button" data-pk-copy>Copy link to this project</button>'+
       '<button class="btn btn--green" type="button" data-pk-interest>I\'m interested — tell the coalition</button></span></div>';
  return h;
}
function tabBtn(k,l){ return '<button class="pk-tab" role="tab" type="button" data-tab="'+k+'" aria-selected="false">'+esc(l)+'</button>'; }
function ul(a){ return '<ul class="pk-list">'+a.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join("")+'</ul>'; }
function resItem(r){
  return '<a class="pk-r" href="'+esc(r.u)+'" target="_blank" rel="noopener noreferrer">'+
         '<div class="t"><span class="pk-kind '+kindClass(r.k)+'">'+esc(KIND_LABEL[r.k]||r.k)+'</span>'+esc(r.t)+'</div>'+
         '<div class="s">'+esc(r.s)+'</div><div class="w">'+esc(r.w)+'</div></a>';
}

/* ---------- Word templates ---------- */
function G(t){ return '<p class="g">'+esc(t)+'</p>'; }
function blank(n){ var s=""; for(var i=0;i<(n||1);i++) s+='<p class="f">[ ]</p>'; return s; }
function table(head, rows){
  var B = 'border:1px solid #9DBFAE;padding:4pt 6pt;vertical-align:top;font-size:10pt;';
  return '<table border="1" cellspacing="0" cellpadding="5" width="100%" style="border-collapse:collapse;width:100%">'+
    '<tr>'+head.map(function(h){ return '<th style="'+B+'background:#E6F2EC;color:#0E3B2A;text-align:left">'+esc(h)+'</th>'; }).join("")+'</tr>'+
    rows.map(function(r){ return '<tr>'+r.map(function(c){ return '<td style="'+B+'">'+(c===""?"&nbsp;":esc(c))+'</td>'; }).join("")+'</tr>'; }).join("")+'</table>';
}
function months(budget){ var m = /\/\s*(\d+)\s*mo/.exec(budget||""); return m ? +m[1] : 12; }
function buildDoc(p, kit, mode){
  var C = mode === "collective";
  var mo = months(p.budget);
  var n = 0; function H(t){ n++; return '<h2>'+n+'. '+esc(t)+'</h2>'; }
  var qs = []; for(var q=1;q<=Math.ceil(mo/3);q++) qs.push("Q"+q);
  var d = '';
  d += '<p class="kick">MazingiraKenya · Je, Hatua? proposal kit · '+(C?"Collective / consortium template":"Individual organisation template")+'</p>';
  d += '<h1>'+esc(p.title)+'</h1>';
  d += '<p class="sub">'+esc(p.county)+' · '+esc(p.sector)+' · '+esc(LANE_NAME[p.lane])+' lane</p>';
  d += G("How to use: grey italic text is guidance — replace or delete it. Pre-filled text comes from the MazingiraKenya portfolio; rewrite it in your own voice and check every figure against the sources in the References section. If the funder has its own form, copy sections across.");

  d += '<h2>Cover sheet</h2>';
  var cover = [["Project title", p.title],["Lead applicant (organisation)",""],["Registration no. / legal status",""],["Contact person, email, phone",""]];
  if(C) cover.push(["Co-applicants / consortium members",""]);
  cover = cover.concat([["Location (counties / sub-counties)", p.county],["Sector / theme", p.sector],["Duration", mo+" months"],["Amount requested", p.budget.split("/")[0].trim()+" (indicative — confirm)"],["Total project cost / co-funding",""],["Funder & call reference",""]]);
  d += table(["Item","Details"], cover);

  d += H("Executive summary");
  d += G("Half a page. Who you are"+(C?" (as a consortium)":"")+", the problem, what you will do, for whom, the change you expect and the amount requested. Write this last.");
  d += '<p>'+esc(p.pitch)+'</p>'+blank(2);

  d += H(C ? "The consortium" : "About the applicant");
  if(C){
    d += G("Introduce the lead applicant and each member. Funders want to see why this group, and why together — what each partner brings that others don't.");
    d += table(["Organisation","Type / registration","Base (county)","Role in this project","Relevant track record"], [["Lead: ","","","",""],["Member: ","","","",""],["Member: ","","","",""]]);
    d += '<h3>Why this partnership</h3>'+G("How the members complement each other (e.g. community presence + legal expertise + research). History of working together, if any.")+blank(2);
    d += '<h3>Potential partners identified in the portfolio</h3><ul>'+kit.partners.map(function(x){ return '<li><b>'+esc(x[0])+'</b> — '+esc(x[1])+'</li>'; }).join("")+'</ul>'+G("Confirm each partner's interest and role directly before naming them in a submission.");
  } else {
    d += G("Mission, year founded, governance, staff/volunteers, geographic presence, 2–3 relevant past projects with results, and your relationship with the affected community.");
    d += blank(3);
    d += '<h3>Partners and allies you may work with</h3><ul>'+kit.partners.map(function(x){ return '<li><b>'+esc(x[0])+'</b> — '+esc(x[1])+'</li>'; }).join("")+'</ul>'+G("Name only partners who have agreed. Attach letters of support where available.");
  }

  d += H("Problem statement and evidence");
  d += G("Describe the problem, who is affected, why now, and what is missing. Cite sources (see References).");
  d += '<p>'+esc(kit.description)+'</p>';
  d += '<p><b>The gap this project closes:</b> '+esc(p.gap)+'</p>'+blank(1);

  d += H("Goal, objectives and theory of change");
  d += '<p><b>Overall goal:</b></p>'+G("One sentence on the long-term change you contribute to.")+blank(1);
  d += '<p><b>Specific objectives:</b></p><ol>'+kit.objectives.map(function(o){ return '<li>'+esc(o)+'</li>'; }).join("")+'</ol>';
  d += '<p><b>Theory of change:</b></p>'+G("IF we do [activities], THEN [outputs], WHICH LEADS TO [outcomes], BECAUSE [assumptions]. State the key assumptions.")+blank(2);

  d += H("Activities and workplan");
  d += G("List activities under each objective. Mark the quarter(s) each happens in."+(C?" Add the responsible partner.":""));
  var whead = ["#","Activity"].concat(C?["Lead partner"]:[]).concat(qs);
  d += table(whead, kit.activities.map(function(a,i){ return [String(i+1), a].concat(C?[""]:[]).concat(qs.map(function(){return "";})); }));

  if(C){
    d += H("Division of labour");
    d += G("Who leads (L) and who supports (S) each workstream. Every activity needs exactly one lead.");
    d += table(["Workstream / activity","Lead applicant","Member 2","Member 3"], kit.activities.map(function(a){ return [a,"","",""]; }));
    d += H("Governance and decision-making");
    d += G("Describe the steering committee (who sits on it, how often it meets), how decisions are made (consensus / majority), how funds flow from lead to members, reporting deadlines between partners, and how disputes are resolved. Reference the signed MoU or consortium agreement (attach as annex).");
    d += table(["Mechanism","Details"], [["Steering committee members & frequency",""],["Decision rule",""],["Fund flow & disbursement schedule",""],["Internal reporting deadlines",""],["Conflict resolution",""],["Communications & attribution (logos, spokespeople)",""],["Data ownership & sharing between partners",""]]);
  }

  d += H("Expected results and indicators (logframe)");
  d += G("One row per outcome. Indicators should be measurable; give a baseline and a target, and say how you'll verify.");
  d += table(["Result","Indicator","Baseline","Target","Means of verification"], kit.outcomes.map(function(o){ return [o,"","","",""]; }).concat([["Output: ","","","",""]]));

  d += H("Community participation, consent and safeguarding");
  d += G("How affected communities shape and lead the work; how you obtain free, prior and informed consent for testimony, photos, video and mapping; how you protect monitors, witnesses and defenders from retaliation; and how personal data is stored and shared in line with Kenya's Data Protection Act 2019. Attach your safeguarding and data-protection policies.");
  d += table(["Area","Our approach"], [["Community leadership & feedback",""],["Informed consent (FPIC) for documentation",""],["Security of monitors / witnesses",""],["Data protection (KDPA 2019)",""],["Gender & inclusion (women, youth, PWDs)",""],["Complaints / grievance mechanism",""]]);

  d += H("Legal and policy framework");
  d += G("Show how the project uses or enforces existing law. Pre-filled hooks below — keep those that apply.");
  d += '<ul>'+kit.legal.map(function(l){ return '<li>'+esc(l)+'</li>'; }).join("")+'</ul>';

  d += H("Risks and mitigation");
  d += table(["Risk","Likelihood (L/M/H)","Impact (L/M/H)","Mitigation"], [["Threats or intimidation against monitors/community members","","",""],["Access to information requests ignored or delayed","","",""],["Political or legal developments change the timeline","","",""],["Data loss or breach of sensitive testimony","","",""]].concat(C?[["Partner withdraws or under-delivers","","",""]]:[]));

  d += H("Monitoring, evaluation and learning");
  d += G("How you will track progress (data, frequency, who), how communities take part in reviewing results, and how you'll share learning"+(C?" across the consortium":"")+". Mention any mid-term or final review.");
  d += blank(2);

  d += H("Budget summary");
  d += G("Indicative portfolio figure: "+p.budget+". Build a detailed budget in the funder's format; this summary shows the main lines. Many funders cap indirect/admin costs at 7–15%.");
  var bl = [["Personnel (coordination, monitors' stipends)"],["Training & community meetings"],["Field documentation (transport, equipment, lab tests)"],["Legal & expert costs"],["Communications, publications & advocacy"],["Monitoring, evaluation & learning"],["Security & safeguarding"],["Indirect / administrative costs"],["TOTAL"]];
  if(C) d += table(["Budget line","Lead applicant","Member 2","Member 3","Total (KES)"], bl.map(function(r){ return [r[0],"","","",""]; }));
  else  d += table(["Budget line","Year 1 (KES)","Year 2 (KES)","Total (KES)","Co-funding"], bl.map(function(r){ return [r[0],"","","",""]; }));
  if(C) d += G("Explain sub-granting arrangements: how the lead transfers funds, financial reporting from members, and audit requirements.");

  d += H("Sustainability and exit");
  d += G("What continues after the grant: skills, structures, data, relationships, follow-on funding (e.g. county climate funds under FLLoCA). Who owns the data and evidence afterwards?");
  d += blank(2);

  d += H("Annexes checklist");
  var ann = ["Certificate of registration","KRA PIN / tax compliance","Latest audited accounts (or financial statements)","Board / governance list","Safeguarding policy","Data protection policy","CVs of key staff","Letters of support from communities or partners"];
  if(C) ann = ann.concat(["Signed consortium agreement / MoU","Letters of commitment from each member","Each member's registration documents"]);
  d += '<ul>'+ann.map(function(a){ return '<li>☐ '+esc(a)+'</li>'; }).join("")+'</ul>';

  d += H("References and supporting evidence");
  d += '<ol>'+kit.resources.map(function(r){ return '<li>'+esc(r.t)+' — '+esc(r.s)+'. <a href="'+esc(r.u)+'">'+esc(r.u)+'</a></li>'; }).join("")+'</ol>';
  d += '<h3>Proposal-writing guides</h3><ul>'+GUIDES.filter(function(g){ return C || !g.collab; }).map(function(g){ return '<li>'+esc(g.t)+' ('+esc(g.s)+'): <a href="'+esc(g.u)+'">'+esc(g.u)+'</a></li>'; }).join("")+'</ul>';
  d += '<p class="g">Prepared from the MazingiraKenya "Je, Hatua?" portfolio, '+new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})+'. Budgets are indicative planning figures, not quotes.</p>';

  var style = 'body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1a1a1a;line-height:1.4}'+
    'h1{font-family:Georgia,serif;font-size:20pt;color:#0E3B2A;margin:4pt 0}'+
    'h2{font-family:Georgia,serif;font-size:14pt;color:#0E3B2A;border-bottom:1px solid #9DBFAE;padding-bottom:2pt;margin:18pt 0 6pt}'+
    'h3{font-size:11.5pt;color:#1B6B4A;margin:10pt 0 4pt}'+
    '.kick{font-size:8.5pt;letter-spacing:1px;text-transform:uppercase;color:#A34612;margin:0}'+
    '.sub{color:#555;margin:0 0 8pt}'+
    '.g{color:#7a7a7a;font-style:italic;font-size:10pt}'+
    '.f{color:#999}'+
    'table{border-collapse:collapse;width:100%;margin:6pt 0}'+
    'th,td{border:1px solid #9DBFAE;padding:4pt 6pt;vertical-align:top;font-size:10pt;text-align:left}'+
    'th{background:#E6F2EC;color:#0E3B2A}';
  return '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">'+
    '<head><meta charset="utf-8"><title>'+esc(p.title)+' — proposal template</title>'+
    '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->'+
    '<style>'+style+'</style></head><body>'+d+'</body></html>';
}
function download(mode){
  if(!current) return;
  var html = buildDoc(current.p, current.kit, mode);
  var blob = new Blob(["﻿", html], { type:"application/msword" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "Proposal-" + (mode==="collective"?"Consortium":"Individual") + "-" + slug(current.p.title) + ".doc";
  document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}

/* ---------- wire project cards ---------- */
function boot(projects){
  ensureShell();
  var host = document.getElementById("projectLanes"); if(!host) return;
  var byTitle = {}; projects.forEach(function(p){ byTitle[p.title] = p; });
  host.querySelectorAll(".project").forEach(function(card){
    var h = card.querySelector("h4"); if(!h) return;
    var p = byTitle[h.textContent]; if(!p || !KITS[p.title]) return;
    card.classList.add("pk-click");
    card.setAttribute("role","button"); card.setAttribute("tabindex","0");
    card.setAttribute("aria-label", p.title + " — open project details and proposal kit");
    if(!card.querySelector(".pk-open")){
      var s = document.createElement("span"); s.className = "pk-open"; s.textContent = "Description, sources & proposal templates →";
      card.appendChild(s);
    }
    card.addEventListener("click", function(){ open(p); });
    card.addEventListener("keydown", function(e){ if(e.key==="Enter" || e.key===" "){ e.preventDefault(); open(p); } });
  });
  /* deep link: ?project=<id> */
  try{
    var want = new URL(location.href).searchParams.get("project");
    if(want){
      var hit = projects.filter(function(p){ return KITS[p.title] && KITS[p.title].id === want; })[0];
      if(hit) setTimeout(function(){ open(hit); }, 300);
    }
  }catch(_){}
}

/* helpers for the admin console */
var HUB = "https://hub.mazingirakenya.org/";
function kitUrl(p){ var k=KITS[p.title]; return HUB + (k ? "?project="+k.id : "") + "#ajesasa"; }
function templateB64(p, mode){
  var html = "\ufeff" + buildDoc(p, KITS[p.title], mode);
  return btoa(unescape(encodeURIComponent(html)));
}
function templateName(p, mode){ return "Proposal-" + (mode==="collective"?"Consortium":"Individual") + "-" + slug(p.title) + ".doc"; }

window.MZK_KITS = { open:open, boot:boot, kits:KITS, projects:PROJECTS, buildDoc:buildDoc, kitUrl:kitUrl, templateB64:templateB64, templateName:templateName, lanes:LANE_NAME };
})();
