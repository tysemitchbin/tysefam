/* ════════════════════════════════════════════════════════════════
   TEORIPRØVEN KLASSE B: notes, road signs and practice questions.

   Topics follow Statens vegvesen's curriculum V851 "Læreplan for førerkortklasse B,
   B kode 96 og BE" (valid from 1 Feb 2026). Vegtrafikkloven was checked against
   the full consolidated text (last amended 1 July 2026). The other rules were written from
   general knowledge of Norwegian traffic law, then checked in October 2026 against Lovdata
   and vegvesen.no through search-engine copies (lovdata.no blocks direct access from the
   build server). § references point to: trafikkreglene (FOR-1986-03-21-747), vegtrafikkloven
   (LOV-1965-06-18-4) and skiltforskriften (FOR-2005-10-07-1219). Every text is a pair: [norsk, English].

   How to add a question (copy a line and change it):
     q("vi", "Norwegian question", "English question",
       ["correct answer (nb)", "correct answer (en)"],   ← the FIRST option is always the right one
       ["wrong answer (nb)",   "wrong answer (en)"],      (the app shuffles the order)
       ["wrong answer (nb)",   "wrong answer (en)"],
       "optional explanation (nb)", "optional explanation (en)");
   Use qi("signname", …same as q…) to show one of the SIGN pictures above the question.
═════════════════════════════════════════════════════════════════ */

/* Chapters. m = which module (group) it belongs to. */
const CH = [
  {id:"fk",m:1,nb:"Førerkort og opplæringen",en:"The licence and the training"},
  {id:"me",m:1,nb:"Mennesket bak rattet",en:"The human behind the wheel"},
  {id:"fy",m:1,nb:"Fart, avstand og fysikk",en:"Speed, distance and physics"},
  {id:"kj",m:1,nb:"Kjøretøyet, last og tilhenger",en:"The vehicle, load and trailer"},
  {id:"mi",m:1,nb:"Miljø og økonomisk kjøring",en:"Environment and eco-driving"},
  {id:"vi",m:2,nb:"Vikeplikt og kryss",en:"Right of way and junctions"},
  {id:"sk",m:2,nb:"Trafikkskilt",en:"Traffic signs"},
  {id:"op",m:2,nb:"Vegoppmerking og lyssignal",en:"Road markings and traffic lights"},
  {id:"pl",m:2,nb:"Plassering, feltskifte og forbikjøring",en:"Positioning, lane changes and overtaking"},
  {id:"ps",m:2,nb:"Stans og parkering",en:"Stopping and parking"},
  {id:"my",m:3,nb:"Myke trafikanter",en:"Vulnerable road users"},
  {id:"ut",m:3,nb:"Mørke, vinter, tunnel og motorveg",en:"Darkness, winter, tunnels and motorways"},
  {id:"ul",m:3,nb:"Ulykker og førstehjelp",en:"Accidents and first aid"}
];
const MOD = {
  1:["Føreren og bilen","The driver and the car"],
  2:["Trafikkreglene","The traffic rules"],
  3:["Trafikken rundt deg","The traffic around you"]
};

/* ---------- Road signs and markings, drawn as small pictures (SVG) ---------- */
const RED="#c8102e", BLUE="#1f5aa6", YEL="#f6c700";
const svg = inner => '<svg viewBox="0 0 100 100" role="img" xmlns="http://www.w3.org/2000/svg">'+inner+'</svg>';
const warnTri = sym => svg('<polygon points="50,9 93,85 7,85" fill="#fff" stroke="'+RED+'" stroke-width="8" stroke-linejoin="round"/>'+sym);
const ring = (inner,fill) => svg('<circle cx="50" cy="50" r="43" fill="'+(fill||"#fff")+'" stroke="'+RED+'" stroke-width="9"/>'+inner);
const blueSq = inner => svg('<rect x="5" y="5" width="90" height="90" rx="8" fill="'+BLUE+'"/>'+inner);
const diamond = extra => svg('<rect x="18" y="18" width="64" height="64" transform="rotate(45 50 50)" fill="#fff" stroke="#222" stroke-width="1.5"/>'+
  '<rect x="30" y="30" width="40" height="40" transform="rotate(45 50 50)" fill="'+YEL+'"/>'+(extra||""));
const car = (x,col) => '<rect x="'+(x+3)+'" y="38" width="16" height="10" rx="3" fill="'+col+'"/><rect x="'+x+'" y="46" width="22" height="14" rx="3" fill="'+col+'"/>'+
  '<rect x="'+(x+1)+'" y="59" width="5" height="6" fill="#222"/><rect x="'+(x+16)+'" y="59" width="5" height="6" fill="#222"/>';
const lamp = (on,col,y) => '<circle cx="50" cy="'+y+'" r="11" fill="'+(on?col:"#3a3a3a")+'"/>';
const lights = (r,y,g) => svg('<rect x="30" y="8" width="40" height="84" rx="10" fill="#1d1d1d"/>'+lamp(r,"#ff3b30",26)+lamp(y,"#ffc400",50)+lamp(g,"#2ecc40",74));
const road = inner => svg('<rect x="0" y="0" width="100" height="100" fill="#5b5f63"/><rect x="6" y="0" width="3" height="100" fill="#fff"/><rect x="91" y="0" width="3" height="100" fill="#fff"/>'+inner);

const SIGN = {
  vikeplikt: svg('<polygon points="7,12 93,12 50,90" fill="#fff" stroke="'+RED+'" stroke-width="9" stroke-linejoin="round"/>'),
  stopp: svg('<polygon points="67.6,7.5 92.5,32.4 92.5,67.6 67.6,92.5 32.4,92.5 7.5,67.6 7.5,32.4 32.4,7.5" fill="'+RED+'" stroke="#fff" stroke-width="3"/>'+
    '<text x="50" y="58" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="21" fill="#fff">STOPP</text>'),
  forkjorsveg: diamond(),
  sluttForkjorsveg: diamond('<g stroke="#222" stroke-width="3"><line x1="12.4" y1="57.6" x2="57.6" y2="12.4"/><line x1="19.9" y1="65.1" x2="65.1" y2="19.9"/><line x1="27.4" y1="72.6" x2="72.6" y2="27.4"/><line x1="34.9" y1="80.1" x2="80.1" y2="34.9"/><line x1="42.4" y1="87.6" x2="87.6" y2="42.4"/></g>'),
  fart50: ring('<text x="50" y="64" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="40" fill="#111">50</text>'),
  fart80: ring('<text x="50" y="64" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="40" fill="#111">80</text>'),
  innkjoringForbudt: svg('<circle cx="50" cy="50" r="45" fill="'+RED+'"/><rect x="17" y="42" width="66" height="16" fill="#fff"/>'),
  kjoringForbudt: ring(''),
  forbikjoringForbudt: ring(car(23,RED)+car(55,"#111")),
  parkeringForbudt: ring('<line x1="23" y1="23" x2="77" y2="77" stroke="'+RED+'" stroke-width="8"/>',BLUE),
  stansForbudt: ring('<line x1="23" y1="23" x2="77" y2="77" stroke="'+RED+'" stroke-width="8"/><line x1="77" y1="23" x2="23" y2="77" stroke="'+RED+'" stroke-width="8"/>',BLUE),
  pabudtHoyre: svg('<circle cx="50" cy="50" r="45" fill="'+BLUE+'"/><line x1="22" y1="50" x2="64" y2="50" stroke="#fff" stroke-width="11"/><polygon points="58,32 82,50 58,68" fill="#fff"/>'),
  gangfelt: blueSq('<polygon points="50,13 89,84 11,84" fill="#fff"/><g stroke="#111" stroke-width="4.5" stroke-linecap="round" fill="none"><line x1="50" y1="48" x2="47" y2="63"/><line x1="47" y1="63" x2="40" y2="76"/><line x1="47" y1="63" x2="55" y2="76"/><line x1="49" y1="52" x2="40" y2="58"/><line x1="49" y1="52" x2="58" y2="57"/></g><circle cx="51" cy="41" r="5" fill="#111"/>'),
  parkering: blueSq('<text x="50" y="74" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="66" fill="#fff">P</text>'),
  envegskjoring: blueSq('<line x1="50" y1="84" x2="50" y2="36" stroke="#fff" stroke-width="13"/><polygon points="29,42 50,15 71,42" fill="#fff"/>'),
  annenFare: warnTri('<rect x="45.5" y="35" width="9" height="28" rx="2" fill="#111"/><circle cx="50" cy="73" r="5" fill="#111"/>'),
  farligSving: warnTri('<path d="M42 78 V60 Q42 46 58 44" stroke="#111" stroke-width="7" fill="none"/><polygon points="56,35 70,44 56,53" fill="#111"/>'),
  lysRodGul: lights(true,true,false),
  lysGul: lights(false,true,false),
  haitenner: road('<g fill="#fff"><polygon points="12,50 24,50 18,66"/><polygon points="30,50 42,50 36,66"/><polygon points="48,50 60,50 54,66"/><polygon points="66,50 78,50 72,66"/></g>'),
  sperrelinje: road('<rect x="47" y="0" width="6" height="100" fill="'+YEL+'"/>'),
  ledelinje: road('<g fill="'+YEL+'"><rect x="47" y="2" width="6" height="14"/><rect x="47" y="40" width="6" height="14"/><rect x="47" y="78" width="6" height="14"/></g>'),
  sperreOgLedelinje: road('<rect x="42" y="0" width="5" height="100" fill="'+YEL+'"/><g fill="'+YEL+'"><rect x="53" y="2" width="5" height="14"/><rect x="53" y="40" width="5" height="14"/><rect x="53" y="78" width="5" height="14"/></g>')
};

/* The sign gallery shown in the Les tab for the "Trafikkskilt" chapter: [sign, name nb, name en, meaning nb, meaning en] */
const SIGN_INFO = [
  ["vikeplikt","Vikeplikt","Give way","Du har vikeplikt for trafikk fra begge sider på vegen du kjører inn på.","Give way to traffic from both directions on the road you are entering."],
  ["stopp","Stopp","Stop","Full stans ved stopplinjen (eller der du ser), deretter vikeplikt.","Come to a complete stop at the stop line (or where you can see), then give way."],
  ["forkjorsveg","Forkjørsveg","Priority road","Trafikk fra sidevegene har vikeplikt for deg i kryssene.","Traffic from side roads must give way to you at junctions."],
  ["sluttForkjorsveg","Slutt på forkjørsveg","End of priority road","Fra nå gjelder vanlige regler, ofte høyreregelen.","Normal rules apply again, often the right-hand rule."],
  ["fart50","Fartsgrense","Speed limit","Høyeste tillatte fart. Gjelder til ny fartsgrense er skiltet.","Maximum speed. Applies until a new limit is signed."],
  ["innkjoringForbudt","Innkjøring forbudt","No entry","Du kan ikke kjøre inn her (ofte enden av en envegskjørt gate).","You may not drive in here (often the far end of a one-way street)."],
  ["kjoringForbudt","Kjøring forbudt","No vehicles","All kjøring med motorvogn er forbudt i begge retninger.","All motor vehicles are banned in both directions."],
  ["forbikjoringForbudt","Forbikjøring forbudt","No overtaking","Du kan ikke kjøre forbi motorvogner med mer enn to hjul.","You may not overtake motor vehicles with more than two wheels."],
  ["parkeringForbudt","Parkering forbudt","No parking","Du kan stanse kort for av- og påstigning og av- og pålessing, men ikke parkere.","You may stop briefly to let people in or out or to load, but not park."],
  ["stansForbudt","Stans forbudt","No stopping","Du kan ikke stanse i det hele tatt, heller ikke for å slippe av noen.","No stopping at all, not even to drop someone off."],
  ["pabudtHoyre","Påbudt kjøreretning","Mandatory direction","Blå runde skilt er påbud. Her må du kjøre til høyre.","Round blue signs are orders. Here you must go right."],
  ["gangfelt","Gangfelt","Pedestrian crossing","Viser gangfelt. Gående som er i eller på vei ut i feltet, skal få gå.","Marks a crossing. Pedestrians on it or about to step onto it must be let across."],
  ["parkering","Parkering","Parking","Parkering er tillatt. Underskilt kan begrense tid eller hvem.","Parking allowed. Plates below may limit the time or who may park."],
  ["envegskjoring","Envegskjøring","One-way traffic","All trafikk går i pilens retning. Du kan parkere på begge sider.","All traffic goes the way of the arrow. You may park on both sides."],
  ["annenFare","Fareskilt (annen fare)","Warning sign (other danger)","Trekant med rød kant varsler fare. Et underskilt forklarer hvilken.","Red-bordered triangles warn of danger. A plate below says what."],
  ["farligSving","Farlig sving","Dangerous bend","Skarp sving i pilens retning. Senk farten før svingen.","Sharp bend in the arrow's direction. Slow down before it."]
];

/* Notes: [nb, en]. A leading "#" marks a sub-heading. */
const NOTES = {
fk:[
["#Om teoriprøven","About the theory test"],
["Teoriprøven for klasse B har 45 spørsmål. Du har 90 minutter, og du kan ha høyst 7 feil.","The class B theory test has 45 questions. You have 90 minutes and may get at most 7 wrong."],
["Du kan ta teoriprøven tidligst 6 måneder før du fyller 18. Stryker du, må du vente 2 uker før neste forsøk, og du får bare vite hvilke temaer du svarte feil på. Prøven finnes også på engelsk.","You can take the theory test at the earliest 6 months before you turn 18. If you fail, you wait 2 weeks before trying again, and you only learn which topics you got wrong. The test is also offered in English."],
["Spørsmålene handler om trafikkregler, skilt, sikkerhet, mennesket, kjøretøyet og miljø. Mange har bilde av et skilt eller en trafikksituasjon.","Questions cover traffic rules, signs, safety, human factors, the vehicle and the environment. Many show a sign or traffic situation."],
["#Klasse B","Class B"],
["Klasse B gjelder bil med tillatt totalvekt inntil 3500 kg og plass til høyst 8 passasjerer i tillegg til føreren. Aldersgrensen er 18 år.","Class B covers cars up to 3500 kg permitted total weight with up to 8 passengers besides the driver. The minimum age is 18."],
["Du skal alltid ha førerkortet med deg når du kjører (vegtrafikkloven § 24). Vognkortet skal også følge med bilen (§ 17).","Always carry your licence when driving (Road Traffic Act § 24). The vehicle registration document must also be in the car (§ 17)."],
["Kjører du uten førerett, kan du ikke få førerkort før det har gått 6 måneder, og ett år hvis du voldte større skade (§ 24 a).","If you drive without a licence, you can't get one until 6 months have passed, or a year if you caused major damage (§ 24 a)."],
["#Opplæringen i fire trinn (læreplan V851)","Training in four stages (curriculum V851)"],
["Trinn 1 er trafikalt grunnkurs. Trinn 2 er grunnleggende kjøretøy- og kjørekompetanse. Trinn 3 er trafikal del. Trinn 4 er avsluttende opplæring.","Stage 1 is the basic traffic course. Stage 2 is basic vehicle handling. Stage 3 is driving in traffic. Stage 4 is the final training."],
["Trafikalt grunnkurs er 17 timer over minst 5 samlinger, med bare én samling per dag. Det har 4 timer om plikter ved trafikkuhell og førstehjelp (1 time med arrangert ulykke) og 3 timer om å være trafikant i mørket. Du må delta i alle timene.","The basic traffic course is 17 hours over at least 5 sessions, with only one session a day. It includes 4 hours on duties at accidents and first aid (1 hour at a staged accident) and 3 hours on being a road user in the dark. You must attend every hour."],
["På slutten av trinn 2 og trinn 3 har du en obligatorisk trinnvurdering på 45 minutter, der du og læreren vurderer om du er klar for neste trinn.","At the end of stages 2 and 3 there is a compulsory 45-minute stage assessment, where you and the instructor judge whether you're ready for the next stage."],
["Sikkerhetskurs på øvingsbane (4 timer) tas mot slutten av trinn 3: sikring av personer og last, og hvordan fart, dekk og veggrep påvirker bremsing og styring.","The safety course on a training track (4 hours) comes near the end of stage 3: securing people and load, and how speed, tyres and grip affect braking and steering."],
["Sikkerhetskurs på veg (13 timer) i trinn 4, i fast rekkefølge: bilkjøringens risiko (2 t), landevegskjøring (5 t), planlegging og kjøring i variert trafikkmiljø (4 t), refleksjon og oppsummering (2 t).","The safety course on the road (13 hours) in stage 4, in a fixed order: the risks of driving (2 h), country-road driving (5 h), planning and driving in varied traffic (4 h), reflection and summary (2 h)."],
["Læreplanen bygger på GDE-modellen: fra manøvrering av bilen, via valg i trafikksituasjoner og planlegging av turen, til dine personlige holdninger og det sosiale miljøet rundt deg.","The curriculum builds on the GDE model: from manoeuvring the car, through choices in traffic and trip planning, up to your personal attitudes and the social environment around you."],
["Mye privat øving (mengdetrening) anbefales, særlig etter sikkerhetskurs på veg. Erfarne førere har lavere ulykkesrisiko.","Lots of private practice is recommended, especially after the road safety course. Experienced drivers have a lower accident risk."],
["#Øvelseskjøring","Practice driving"],
["Du kan øvelseskjøre fra 16 år, når du har fullført trafikalt grunnkurs.","You may practise from age 16 once you have completed the basic traffic course (trafikalt grunnkurs)."],
["Ledsageren må være minst 25 år og ha hatt førerkort for klassen sammenhengende i minst 5 år. Bilen skal ha skilt som viser øvelseskjøring.","The supervisor must be at least 25 and have held a licence for the class continuously for at least 5 years. The car must show a practice-driving sign."],
["Ved øvingskjøring regnes ledsageren som fører av bilen. Eleven må likevel følge trafikkreglene og reglene om rus (§ 26), så verken eleven eller ledsageren kan være påvirket.","During practice driving the supervisor counts as the driver. The learner must still follow the traffic rules and the alcohol and drug rules (§ 26), so neither may be under the influence."],
["#Prøvetid og prikker","Probation and penalty points"],
["De første 2 årene etter at du får førerkort, er prøvetid. Prikker du får i prøvetiden, teller dobbelt.","The first 2 years after you get your licence are a probation period. Points you get during probation count double."],
["Mister du førerretten i prøvetiden, må du ta ny førerprøve.","If you lose your licence during probation, you must take the driving test again."],
["8 prikker i løpet av 3 år gir tap av førerretten i 6 måneder. Prikker gis for alvorlige brudd, f.eks. høy fart, kjøring på rødt og håndholdt mobil.","8 points within 3 years means losing your licence for 6 months. Points are given for serious offences, e.g. speeding, running a red and handheld phone use."]
],
me:[
["#Grunnregelen","The basic rule"],
["Vegtrafikkloven § 3: Enhver skal ferdes hensynsfullt og være aktpågivende og varsom, så det ikke kan oppstå fare eller voldes skade, og slik at annen trafikk ikke unødig blir hindret eller forstyrret.","Road Traffic Act § 3: Everyone must travel considerately and be attentive and careful, so that no danger or harm arises and other traffic is not needlessly obstructed or disturbed."],
["Nullvisjonen bygger på delt ansvar: myndighetene lager trygge veger og biler, men du som fører har ansvar for å følge reglene og vurdere om det er forsvarlig å kjøre.","Vision Zero is built on shared responsibility: the authorities make roads and cars safe, but you as the driver must follow the rules and judge whether it's safe to drive."],
["#Alkohol, rus og medisiner","Alcohol, drugs and medicines"],
["Promillegrensen er 0,2 i blodet, eller 0,1 milligram per liter i utåndingsluften (vegtrafikkloven § 22). Over dette regnes du alltid som påvirket.","The limit is 0.2 per mille in the blood, or 0.1 milligrams per litre of breath (Road Traffic Act § 22). Above this you always count as under the influence."],
["Straff (§ 31): til og med 0,5 promille gir som regel bot. Over 0,5 til 1,2 gir bot og betinget eller ubetinget fengsel. Over 1,2 gir bot og ubetinget fengsel.","Penalties (§ 31): up to 0.5 per mille usually means a fine. Over 0.5 up to 1.2 means a fine and suspended or actual prison. Over 1.2 means a fine and actual prison."],
["Over 0,5 promille mister du førerretten i minst 1 år. I prøvetiden mister du den i inntil ett år også ved 0,5 promille eller lavere (§ 33). Blir du tatt med over 0,5 promille innen 5 år etter en tidligere promilledom, mister du den for alltid.","Over 0.5 per mille you lose your licence for at least 1 year. During probation you lose it for up to a year even at 0.5 or below (§ 33). Caught above 0.5 within 5 years of an earlier drink-driving conviction, you lose it for good."],
["Kroppen forbrenner ca. 0,1–0,15 promille i timen. Kaffe, kald dusj eller mat gjør deg ikke edru raskere.","The body burns off roughly 0.1–0.15 per mille per hour. Coffee, a cold shower or food will not sober you up faster."],
["Har du kjørt og kan regne med politietterforskning (f.eks. etter en ulykke), kan du ikke drikke alkohol eller ta andre rusmidler de første 6 timene etter kjøringen, med mindre prøve er tatt eller politiet har bestemt at det ikke skal tas prøve (vegtrafikkloven § 22).","If you have driven and can expect a police investigation (e.g. after an accident), you may not drink alcohol or take other intoxicants for 6 hours after driving, unless a test has been taken or the police have decided not to take one (Road Traffic Act § 22)."],
["Medisiner merket med rød trekant kan svekke evnen til å kjøre. Spør lege eller apotek.","Medicines marked with a red triangle can impair driving. Ask a doctor or pharmacist."],
["#Tretthet og oppmerksomhet","Tiredness and attention"],
["Du kan ikke kjøre hvis du ikke er skikket til å kjøre trygt, enten det skyldes rus, sykdom, svekkelse, tretthet eller noe annet (vegtrafikkloven § 21).","You may not drive if you're not fit to drive safely, whether from intoxicants, illness, weakness, tiredness or anything else (Road Traffic Act § 21)."],
["Trøtthet kan gi mikrosøvn: du sovner i noen sekunder uten å merke det. Det eneste som hjelper, er å stoppe og hvile eller sove.","Tiredness can cause micro-sleep: you nod off for seconds without noticing. The only cure is to stop and rest or sleep."],
["Det er forbudt å bruke håndholdt mobiltelefon under kjøring. Det gir bot og 3 prikker.","Using a handheld phone while driving is forbidden. It gives a fine and 3 penalty points."],
["Ser du bort fra vegen i 2 sekunder i 80 km/t, kjører du over 40 meter i blinde.","Looking away for 2 seconds at 80 km/h means driving over 40 metres blind."],
["Sterke følelser (sinne, stress, sorg) gjør deg til en dårligere sjåfør. Ta deg tid.","Strong emotions (anger, stress, grief) make you a worse driver. Take your time."],
["#Syn og blikk","Vision and scanning"],
["Se langt fram og bruk speilene ofte. Sjekk blindsonen med et blikk over skulderen før feltskifte og når du kjører ut fra kanten.","Look far ahead and check mirrors often. Check the blind spot over your shoulder before changing lanes and pulling out."],
["I høy fart blir synsfeltet smalere (tunnelsyn). Du oppdager mindre av det som skjer på sidene.","At high speed your field of view narrows (tunnel vision). You notice less at the sides."]
],
fy:[
["#Fartsgrenser","Speed limits"],
["Uten skilt er fartsgrensen 50 km/t i tettbygd strøk og 80 km/t utenfor tettbygd strøk. Andre fartsgrenser er skiltet.","Without signs the limit is 50 km/h in built-up areas and 80 km/h outside. Other limits are signed."],
["Fartsgrensen er den høyeste lovlige farten, ikke en anbefaling. Du skal alltid tilpasse farten etter forholdene.","The limit is the highest legal speed, not a target. Always adapt your speed to the conditions."],
["Du skal kunne stanse på den delen av vegen du kan se er fri. Ved møte på smal veg: på halvparten.","You must be able to stop within the distance you can see is clear. When meeting on a narrow road: within half of it."],
["#Stopplengde","Stopping distance"],
["Stopplengde = reaksjonslengde + bremselengde.","Stopping distance = reaction distance + braking distance."],
["Reaksjonstiden er ca. 1 sekund. Reaksjonslengden i meter ≈ farten i km/t delt på 3,6. I 50 km/t er det ca. 14 meter.","Reaction time is about 1 second. Reaction distance in metres ≈ speed in km/h divided by 3.6. At 50 km/h that is about 14 metres."],
["Bremselengden øker med kvadratet av farten: dobbel fart gir fire ganger så lang bremselengde.","Braking distance rises with the square of speed: double the speed, four times the braking distance."],
["På glatt is kan bremselengden bli mange ganger lengre enn på tørr asfalt.","On slippery ice the braking distance can be many times longer than on dry asphalt."],
["#Avstand og krefter","Following distance and forces"],
["Hold minst 3 sekunders avstand til bilen foran i gode forhold, mer på glatt føre, i mørke og i regn.","Keep at least 3 seconds from the car ahead in good conditions, more on slippery roads, in darkness and in rain."],
["Bevegelsesenergien øker med kvadratet av farten. Å kollidere i 50 km/t tilsvarer et fall fra ca. 10 meters høyde.","Kinetic energy rises with the square of speed. Crashing at 50 km/h is like falling from about 10 metres."],
["Vannplaning: dekkene flyter på vannet og du mister styringen. Slipp gassen forsiktig, ikke bråbrems, hold rattet rett.","Aquaplaning: the tyres ride on water and you lose steering. Ease off the throttle, don't brake hard, keep the wheel straight."],
["Med ABS: trå bremsen hardt inn og hold den inne. Du kan styre samtidig.","With ABS: press the brake hard and keep it down. You can steer at the same time."]
],
kj:[
["#Kontroll av bilen","Checking the car"],
["Før du kjører, skal du forvisse deg om at bilen er i forsvarlig stand og forsvarlig lastet, og sørge for at den er det under hele turen (vegtrafikkloven § 23). Det gjelder bremser, lys, dekk, ruter, speil og styring.","Before driving, make sure the car is roadworthy and properly loaded, and keep it so throughout the trip (Road Traffic Act § 23). That covers brakes, lights, tyres, windows, mirrors and steering."],
["Du skal straks stanse for kontroll når politiet eller Statens vegvesen krever det, og vise fram dokumentene du skal ha med (§ 10).","You must stop at once for a check when the police or Statens vegvesen require it, and show the documents you must carry (§ 10)."],
["Minste mønsterdybde er 1,6 mm på sommerdekk og 3 mm på vinterdekk når det er vinterføre.","Minimum tread depth is 1.6 mm on summer tyres and 3 mm on winter tyres in winter conditions."],
["Piggdekk er tillatt fra 1. november til første søndag etter 2. påskedag (i Nordland, Troms og Finnmark: 16. oktober–30. april). Når føret krever det, kan de brukes utenom perioden. Noen byer krever piggdekkgebyr.","Studded tyres are allowed from 1 November to the first Sunday after Easter Monday (Nordland, Troms and Finnmark: 16 October–30 April). They may be used outside the period when conditions require. Some cities charge a fee."],
["Rødt varsellys på dashbordet: stopp så snart det er trygt. Gult/oransje: sjekk snart.","Red warning light: stop as soon as it is safe. Yellow/orange: get it checked soon."],
["Bilen skal på EU-kontroll hvert annet år. En ny bil skal første gang innen 4 år.","Cars need an EU roadworthiness test every two years. A new car first within 4 years."],
["I bilen skal det være varseltrekant og refleksvest til føreren.","The car must carry a warning triangle and a hi-vis vest for the driver."],
["#Sikring","Restraints"],
["Alle skal bruke bilbelte. Føreren har ansvaret for at passasjerer under 15 år er sikret.","Everyone must wear a seatbelt. The driver is responsible for passengers under 15 being secured."],
["Barn under 135 cm skal alltid sikres i godkjent barnesikringsutstyr. Barn mellom 135 og 150 cm skal bruke det hvis det finnes i bilen, ellers vanlig bilbelte. Bakovervendt barnesete skal aldri stå foran en aktiv kollisjonspute.","Children under 135 cm must always use an approved child restraint. Children 135–150 cm must use one if the car has it, otherwise a normal seatbelt. A rear-facing child seat must never be in front of an active airbag."],
["Lasten skal sikres slik at den ikke kan forskyve seg eller falle av. Løse ting i bilen blir farlige prosjektiler i en kollisjon.","Load must be secured so it can't shift or fall off. Loose objects become dangerous projectiles in a crash."],
["Lasten må ikke hindre sikten eller skjule blinklys og bremselys.","The load must not block your view or hide indicators and brake lights."],
["Last sikres ved låsing, stenging, surring og dekking, med utstyr som fiberbånd, kjetting, nett og presenning.","Load is secured by locking, blocking, lashing and covering, using straps, chains, nets and tarpaulins."],
["Sjekk motorolje og drivstoff før du kjører. Går du tom, kan du bli stående på farlige steder, f.eks. i en tunnel.","Check engine oil and fuel before driving. Running out can leave you stranded somewhere dangerous, like a tunnel."],
["#Tilhenger","Trailer"],
["Med klasse B kan du trekke tilhenger med tillatt totalvekt opp til 750 kg, eller tyngre hvis bil og henger til sammen er høyst 3500 kg. Kode 96 utvider til 4250 kg.","With class B you may tow a trailer up to 750 kg, or heavier if car and trailer together are at most 3500 kg. Code 96 extends this to 4250 kg."],
["Høyeste fart med tilhenger er 80 km/t, også for tilhenger uten brems. Den gamle grensen på 60 km/t for tunge hengere uten brems ble fjernet i 2022. Noen hengere kan etter særskilt godkjenning kjøres i 100 km/t.","The top speed with a trailer is 80 km/h, braked or not. The old 60 km/h limit for heavy unbraked trailers was removed in 2022. Some trailers can be approved for 100 km/h."]
],
mi:[
["#Kjør økonomisk","Drive economically"],
["Kjør jevnt og planlegg: se langt fram, slipp gassen tidlig og unngå unødvendige oppbremsinger.","Drive smoothly and plan: look far ahead, lift off early and avoid needless braking."],
["Gir opp tidlig og kjør på høyt gir. Lavere fart gir lavere forbruk og mindre utslipp.","Shift up early and drive in a high gear. Lower speed means lower consumption and emissions."],
["Riktig dekktrykk, lite vekt og ingen takboks når du ikke trenger den, sparer drivstoff.","Correct tyre pressure, little weight and no roof box when not needed save fuel."],
["Unngå tomgangskjøring. Om vinteren reduserer motorvarmer slitasje og utslipp ved kaldstart.","Avoid idling. In winter, an engine heater reduces wear and cold-start emissions."],
["#Miljøet rundt vegen","The environment around the road"],
["Piggdekk river opp asfalten og gir svevestøv som er helseskadelig.","Studded tyres wear the asphalt and create harmful airborne dust."],
["Trafikkstøy øker med farten. Lav fart i boligområder gir mindre støy.","Traffic noise rises with speed. Lower speed in residential areas means less noise."],
["Elbiler kan gjenvinne energi når de bremser med motoren (regenerering).","Electric cars can recover energy by braking with the motor (regeneration)."]
],
vi:[
["#Grunnreglene","The basic rules"],
["Høyreregelen: der ingen skilt sier noe annet, har du vikeplikt for kjørende som kommer fra høyre.","The right-hand rule: unless signs say otherwise, give way to traffic coming from your right."],
["Vikeplikt betyr at du skal kjøre slik at den du har vikeplikt for, ikke må endre fart eller retning brått. Vis tydelig at du viker, ved å senke farten i god tid.","Giving way means driving so the other road user doesn't have to suddenly change speed or direction. Show it clearly by slowing down in good time."],
["Vikepliktskilt (trekant med spissen ned) og stoppskilt: vikeplikt for trafikk fra begge sider. Ved stopp skal du stanse helt.","Give-way sign (triangle pointing down) and stop sign: give way to traffic from both sides. At a stop sign you must stop completely."],
["Forkjørsveg (gul ruter): trafikk fra sidevegene har vikeplikt for deg.","Priority road (yellow diamond): side-road traffic must give way to you."],
["#Ut fra parkering og avkjørsel","Out of car parks and driveways"],
["Kjører du ut fra parkeringsplass, bensinstasjon, eiendom, gatetun, gang- og sykkelveg eller over fortau, har du vikeplikt for alle.","Leaving a car park, petrol station, property, home zone, footpath/cycle path or crossing a pavement, you must give way to everyone."],
["#Svinging","Turning"],
["Svinger du til venstre, har du vikeplikt for møtende trafikk.","Turning left, give way to oncoming traffic."],
["Når du svinger, har du vikeplikt for gående som krysser vegen du svinger inn på, og for syklister som kjører rett fram i sykkelfelt.","When turning, give way to pedestrians crossing the road you turn into, and to cyclists going straight in a cycle lane."],
["#Spesielle situasjoner","Special situations"],
["Rundkjøring: du har vikeplikt for dem som allerede er i rundkjøringen. Gi tegn til høyre før du kjører ut.","Roundabout: give way to those already in it. Signal right before you exit."],
["Utrykningskjøretøy med blålys og sirene skal slippes fram. Gjør plass, men pass på at du ikke lager farlige situasjoner.","Emergency vehicles with blue lights and siren must be let through. Make room without creating danger."],
["På veg med fartsgrense 60 km/t eller lavere har du vikeplikt for buss som gir tegn om at den skal kjøre ut fra holdeplassen (trafikkreglene § 7).","On roads with a limit of 60 km/h or less, you must give way to a bus signalling to pull out from its stop (traffic rules § 7)."],
["Når to felt går sammen til ett uten oppmerking eller vikeplikt, gjelder fletting (glidelås): én og én fra hvert felt.","When two lanes merge with no markings or give-way rules, merge in turn like a zipper: one from each lane."]
],
sk:[
["#Skiltgruppene","The sign groups"],
["Fareskilt: trekant med spissen opp og rød kant. Varsler om fare litt lenger fram.","Warning signs: triangle pointing up with a red border. Warn of danger ahead."],
["Vikepliktskilt: trekant med spissen ned, stopp, forkjørsveg og liknende. Forteller hvem som skal vike.","Priority signs: downward triangle, stop, priority road and similar. Tell who must give way."],
["Forbudsskilt: runde med rød kant. Påbudsskilt: runde og blå.","Prohibition signs: round with a red border. Mandatory signs: round and blue."],
["Opplysningsskilt, serviceskilt og vegvisningsskilt: firkantede, ofte blå, grønne eller hvite. Underskilt utfyller skiltet over.","Information, service and direction signs: rectangular, often blue, green or white. Plates below add to the sign above."],
["#Rekkefølgen","The order of priority"],
["Politiets tegn går foran lyssignal, lyssignal går foran skilt, og skilt går foran de vanlige trafikkreglene.","Police signals override traffic lights, lights override signs, and signs override the general traffic rules."],
["#Viktige detaljer","Important details"],
["Fartsgrenseskilt gjelder til et nytt skilt opphever det.","A speed limit sign applies until another sign ends it."],
["Forbudsskilt gjelder som hovedregel fra skiltet og fram til nærmeste vegkryss (skiltforskriften § 7). Unntak: Forbikjøring forbudt gjelder til skiltet «Slutt på forbikjøringsforbud», også gjennom kryss.","Prohibition signs generally apply from the sign up to the next junction (sign regulations § 7). Exception: No overtaking lasts until the 'End of no overtaking' sign, even through junctions."]
],
op:[
["#Linjer","Lines"],
["Gule linjer skiller trafikk i motsatt retning. Hvite linjer skiller trafikk i samme retning og markerer kanten.","Yellow lines separate opposing traffic. White lines separate traffic going the same way and mark the edge."],
["Sperrelinje (heltrukket) skal du ikke kjøre over eller på. Ledelinje (korte streker, lange mellomrom) kan du krysse når det er trygt.","A solid line must not be crossed or driven on. A broken guide line (short dashes, long gaps) may be crossed when safe."],
["Varsellinje (lange streker, korte mellomrom) varsler fare eller at det kommer en sperrelinje.","A warning line (long dashes, short gaps) warns of danger or that a solid line is coming."],
["Sperrelinje og ledelinje ved siden av hverandre: du kan krysse bare hvis ledelinjen er nærmest deg.","Solid line next to a broken line: you may cross only if the broken line is on your side."],
["Sperreområde (skraverte felt med heltrukken kant) skal du ikke kjøre inn i.","Hatched areas with a solid border must not be entered."],
["#Tvergående oppmerking","Markings across the road"],
["Haitenner (trekanter) er vikepliktlinje. Heltrukken tverrlinje er stopplinje.","'Shark teeth' (triangles) are a give-way line. A solid line across is a stop line."],
["Piler i kjørefeltene viser hvilken vei du skal kjøre fra feltet. Velg felt i god tid.","Arrows in the lanes show which way you must go from that lane. Pick your lane in good time."],
["#Lyssignal","Traffic lights"],
["Rekkefølgen er rødt, rødt og gult, grønt, gult, rødt.","The sequence is red, red-and-yellow, green, yellow, red."],
["Rødt og gult samtidig betyr at det snart blir grønt. Du skal fortsatt stå.","Red and yellow together mean green is coming. You must still wait."],
["Gult lys betyr stopp, med mindre du er så nær at du ikke kan stanse trygt.","Yellow means stop, unless you are too close to stop safely."],
["Blinkende gult: kjør forsiktig og følg skilt og vikepliktregler.","Flashing yellow: proceed carefully and follow signs and right-of-way rules."]
],
pl:[
["#Plassering","Positioning"],
["Hold deg så langt til høyre som det er praktisk mulig og forsvarlig.","Keep as far right as is practical and safe."],
["Gi tegn i god tid før du svinger, skifter felt eller kjører ut fra kanten. Tegnet gir deg ingen rett, bare informasjon til andre.","Signal in good time before turning, changing lanes or pulling out. Signalling gives no right, it only informs others."],
["Feltskifte: speil, blindsone, tegn, og skift bare når det er plass.","Lane change: mirror, blind spot, signal, and move only when there is room."],
["#Forbikjøring","Overtaking"],
["Forbikjøring skjer på venstre side. Du må ha god sikt og plass til å fullføre uten å hindre møtende.","Overtake on the left. You need a clear view and room to finish without hindering oncoming traffic."],
["Du kan kjøre forbi på høyre side når den foran svinger til venstre, og i tett trafikk der alle feltene i samme retning er fylt med kø (trafikkreglene § 12).","You may pass on the right when the vehicle ahead is turning left, and in dense traffic where every lane in your direction is queued (traffic rules § 12)."],
["Forbikjøring er forbudt der sikten er hindret av bakketopp eller sving, like foran eller i vegkryss (unntatt der det er to eller flere felt i din retning, lysregulering, eller vikeplikt for kryssende veg), og ved gangfelt der et kjøretøy skjuler gangfeltet.","Overtaking is banned where a crest or bend blocks the view, just before or in junctions (except with two or more lanes your way, traffic lights, or a give-way rule for the crossing road), and at crossings where a vehicle hides the crossing."],
["Står et kjøretøy stille foran et gangfelt, kan en gående være skjult. Senk farten og vær klar til å stanse.","If a vehicle has stopped before a crossing, a pedestrian may be hidden. Slow down and be ready to stop."],
["Når noen kjører forbi deg, skal du holde til høyre og ikke øke farten.","When being overtaken, keep right and don't speed up."],
["#Rygging og vending","Reversing and turning round"],
["Rygging og vending er forbudt på motorveg. Rygg kort og forsiktig, og få gjerne hjelp av noen utenfor.","Reversing and U-turns are banned on motorways. Reverse only briefly and carefully, ideally with someone guiding."]
],
ps:[
["#Hvor du kan stanse","Where you may stop"],
["Stans og parkering skal skje på høyre side i kjøreretningen. I envegskjørt gate kan du også stanse på venstre side.","Stop and park on the right in your direction of travel. In one-way streets also on the left."],
["Stans er forbudt i kryss og nærmere enn 5 meter fra kryss, i gangfelt og nærmere enn 5 meter foran gangfelt.","Stopping is banned in junctions and within 5 metres of them, on crossings and within 5 metres before them."],
["Stans er også forbudt der du hindrer sikten eller trafikken, f.eks. i uoversiktlige svinger, på bakketopper, i tunneler og i sykkelfelt.","Stopping is also banned where you block view or traffic, e.g. blind bends, hilltops, tunnels and cycle lanes."],
["Stans er også forbudt nærmere enn 5 meter fra planovergang, i kollektivfelt, sambruksfelt og sykkelfelt, og på motorveg og motortrafikkveg (trafikkreglene § 17).","Stopping is also banned within 5 metres of a level crossing, in bus lanes, shared lanes and cycle lanes, and on motorways and expressways (traffic rules § 17)."],
["Parkering er forbudt foran inn- eller utkjørsel, og nærmere enn 20 meter fra skiltet for en bussholdeplass (av- og påstigning som ikke hindrer bussen, er lov).","Parking is banned in front of a driveway, and within 20 metres of a bus stop sign (dropping off without blocking the bus is allowed)."],
["#Skiltene","The signs"],
["Parkering forbudt (én rød skråstrek): du kan stanse kort for av- og påstigning og av- og pålessing.","No parking (one red stripe): you may stop briefly to let people in or out and to load."],
["Stans forbudt (rødt kryss): ikke stans i det hele tatt.","No stopping (red cross): don't stop at all."],
["#Trygg parkering","Parking safely"],
["Se deg godt bak før du åpner døra. Syklister kommer fort.","Look carefully behind before opening the door. Cyclists come fast."],
["I bakke: trekk håndbremsen og vri hjulene mot fortauskanten.","On a slope: apply the handbrake and turn the wheels toward the kerb."]
],
my:[
["#Gående","Pedestrians"],
["Du har vikeplikt for gående som er i gangfeltet eller på vei ut i det.","Give way to pedestrians who are on a crossing or about to step onto it."],
["Barn er uforutsigbare og vanskelige å se. Senk farten ved skoler, barnehager og lekeplasser.","Children are unpredictable and hard to see. Slow down near schools, kindergartens and playgrounds."],
["Eldre trenger ofte mer tid og kan ha dårligere syn og hørsel.","Older people often need more time and may see and hear less well."],
["I mørket ser du en gående uten refleks på ca. 25–30 meter med nærlys. Med refleks ser du dem på ca. 140 meter.","In the dark you see a pedestrian without a reflector at about 25–30 m on dipped beam. With one, at about 140 m."],
["Gatetun: kjør i gangfart. De gående har fortrinnsrett.","Home zone: drive at walking pace. Pedestrians have priority."],
["#Syklister og MC","Cyclists and motorcycles"],
["Hold god avstand når du kjører forbi syklister (minst 1,5 meter anbefales), og vent hvis det ikke er plass.","Give cyclists plenty of room when passing (at least 1.5 m is recommended), and wait if there's no space."],
["Se etter syklister i blindsonen før du svinger til høyre.","Check for cyclists in your blind spot before turning right."],
["Motorsyklister er smale og vanskelige å se, og det er vanskelig å bedømme farten deres.","Motorcyclists are narrow and hard to see, and their speed is hard to judge."],
["#Andre","Others"],
["Ved buss eller trikk som står ved holdeplass: senk farten. Noen kan komme fram foran eller bak.","Passing a bus or tram at a stop: slow down. People may step out in front or behind."],
["Ridende og dyr: kjør sakte forbi med god avstand, og ikke bruk lydsignal.","Horses and animals: pass slowly with plenty of room and don't sound the horn."]
],
ut:[
["#Mørke og lys","Darkness and lights"],
["Du skal alltid kjøre med nærlys eller kjørelys, også om dagen. Parklys alene er ikke nok.","Always drive with dipped headlights or daytime running lights, even by day. Parking lights alone are not enough."],
["Bruk fjernlys når du kan, men blend av for møtende og når du kjører rett bak noen.","Use high beam when you can, but dip for oncoming traffic and when close behind someone."],
["Blir du blendet: senk farten og se mot høyre vegkant.","If dazzled: slow down and look toward the right edge of the road."],
["I tåke: nærlys og eventuelt tåkelys. Fjernlys reflekteres i tåka og gjør sikten dårligere. Tåkebaklys bare ved svært dårlig sikt.","In fog: dipped beam and fog lights if fitted. High beam reflects in fog. Rear fog light only in very poor visibility."],
["#Vinter","Winter"],
["Is er glattest rundt 0 °C, når det ligger vann på isen. Vær ekstra varsom på bruer, i skygge og i tunnelåpninger.","Ice is most slippery around 0 °C when there is water on it. Take extra care on bridges, in shade and at tunnel mouths."],
["Fjern snø og is fra alle ruter, lykter og taket før du kjører.","Clear snow and ice from all windows, lights and the roof before driving."],
["Hold større avstand, bremse tidlig og forsiktig, og unngå brå rattbevegelser.","Keep a bigger gap, brake early and gently, and avoid sudden steering."],
["Elg og hjort krysser ofte vegen i skumringen og om høsten og vinteren. Der det er ett dyr, kan det komme flere.","Moose and deer often cross at dusk and in autumn and winter. Where there's one, there may be more."],
["Mange alvorlige ulykker med unge førere er utforkjøringer og møteulykker. Tilpass farten til veg og føre, og velg møtepunkt og plassering med omhu.","Many serious crashes involving young drivers are run-off-road and head-on collisions. Adapt speed to the road and conditions, and choose where and how you meet traffic with care."],
["#Motorveg","Motorways"],
["På motorveg er stans, parkering, rygging og vending forbudt. Kjøretøy som ikke kan kjøre fortere enn 40 km/t, er ikke tillatt.","On motorways, stopping, parking, reversing and U-turns are banned. Vehicles that can't exceed 40 km/h are not allowed."],
["Bruk akselerasjonsfeltet til å få samme fart som trafikken. Du har vikeplikt når du kjører inn.","Use the acceleration lane to match the traffic's speed. You must give way when joining."],
["Når du skal av, kjør inn i retardasjonsfeltet før du senker farten.","When leaving, move into the deceleration lane before slowing down."],
["#Tunnel og planovergang","Tunnels and level crossings"],
["Ved inn- og utkjøring av tunnel kan sikt og veggrep endre seg brått.","Entering and leaving a tunnel, visibility and grip can change suddenly."],
["Brann i tunnel: stans, slå av motoren, la nøkkelen stå, og gå bort fra røyken til nærmeste nødutgang. Ring fra nødtelefon.","Fire in a tunnel: stop, turn off the engine, leave the key in, and walk away from the smoke to the nearest exit. Call from an emergency phone."],
["Planovergang: kjør aldri ut på sporet før du ser at du kommer helt over. Stans når lyset blinker eller bommen går ned.","Level crossing: never drive onto the tracks unless you can clear them completely. Stop when the lights flash or the barrier lowers."]
],
ul:[
["#Ved en ulykke","At an accident"],
["Alle som er innblandet i et trafikkuhell, med eller uten skyld, skal straks stanse og hjelpe mennesker og dyr som er skadet. Andre i nærheten har samme plikt om det trengs (vegtrafikkloven § 12).","Everyone involved in a traffic accident, at fault or not, must stop at once and help injured people and animals. Others nearby have the same duty if needed (Road Traffic Act § 12)."],
["De innblandede skal oppgi navn og adresse til hverandre. Føreren skal også oppgi eierens navn og adresse og bilens kjennemerke.","Those involved must give each other their names and addresses. The driver must also give the owner's name and address and the registration number."],
["Er noen drept eller skadet (ikke ubetydelig), skal politiet varsles snarest, og de innblandede skal ikke forlate stedet uten at det er nødvendig eller politiet samtykker.","If someone is killed or more than slightly injured, the police must be told as soon as possible, and those involved may not leave unless necessary or the police agree."],
["Skader du noe og eieren ikke er til stede, f.eks. en parkert bil, skal du snarest varsle eieren eller politiet.","If you damage property and the owner isn't there, e.g. a parked car, you must tell the owner or the police as soon as possible."],
["Unnlater du å hjelpe noen som ble skadet i et uhell du var med på å forårsake, mister du førerretten for alltid (§ 33).","If you fail to help someone injured in an accident you helped cause, you lose your licence for good (§ 33)."],
["Rekkefølge: skaff oversikt, sikre stedet (nødblink, refleksvest, varseltrekant), varsle, og gi førstehjelp.","Order: get an overview, secure the scene (hazard lights, hi-vis vest, warning triangle), call for help, give first aid."],
["Står bilen til fare eller hinder, skal varseltrekanten settes ut i god avstand, om mulig minst 150 meter fra bilen.","If the car is a danger or obstruction, place the warning triangle well back, if possible at least 150 metres away."],
["Nødnumre: 113 ambulanse, 112 politi, 110 brann.","Emergency numbers: 113 ambulance, 112 police, 110 fire."],
["Ved mindre skader på bilene fyller dere ut et felles skademeldingsskjema.","With minor damage to the cars, fill in a joint accident report form together."],
["Plikten til å stanse og hjelpe gjelder også dyr som er skadet, og du har meldeplikt hvis du skader et dyr.","The duty to stop and help also covers injured animals, and you must report it if you injure an animal."],
["#Førstehjelp","First aid"],
["Bevisstløs som puster normalt: legg personen i stabilt sideleie og hold frie luftveier.","Unconscious but breathing normally: put them in the recovery position and keep the airway open."],
["Puster ikke normalt: ring 113 og start hjerte-lunge-redning: 30 kompresjoner og 2 innblåsninger.","Not breathing normally: call 113 and start CPR: 30 compressions and 2 rescue breaths."],
["Kraftig blødning: trykk direkte på såret.","Heavy bleeding: press directly on the wound."],
["Hold den skadde varm, og flytt den skadde bare hvis det er fare på stedet.","Keep the injured person warm, and only move them if the scene is dangerous."]
]
};

/* ---------- Practice questions. The first option is always the correct one. ---------- */
const Q = [];
function q(ch,nb,en,a,b,c,xnb,xen){ Q.push({ch:ch,nb:nb,en:en,o:[a,b,c],xnb:xnb||"",xen:xen||""}); }
function qi(img,ch,nb,en,a,b,c,xnb,xen){ q(ch,nb,en,a,b,c,xnb,xen); Q[Q.length-1].img=img; }

/* ---------- Førerkort, opplæring og prøvetid ---------- */
q("fk","Hvor mange spørsmål har teoriprøven for klasse B?","How many questions are on the class B theory test?",["45","45"],["36","36"],["60","60"],"45 spørsmål, 90 minutter, høyst 7 feil.","45 questions, 90 minutes, at most 7 wrong.");
q("fk","Hvor mange feil kan du ha og likevel bestå teoriprøven?","How many mistakes can you make and still pass?",["7","7"],["5","5"],["10","10"]);
q("fk","Hvor gammel må du være for å få førerkort klasse B?","How old must you be for a class B licence?",["18 år","18"],["17 år","17"],["16 år","16"]);
q("fk","Når kan du begynne å øvelseskjøre med bil?","When can you start practice driving?",["Fra 16 år, etter trafikalt grunnkurs","From 16, after the basic traffic course"],["Fra 15 år, uten kurs","From 15, with no course"],["Fra 17 år, etter teoriprøven","From 17, after the theory test"]);
q("fk","Hvilket krav gjelder for ledsageren ved øvelseskjøring?","What applies to the supervisor during practice driving?",["Minst 25 år og hatt førerkort for klassen sammenhengende i 5 år","At least 25 and held a licence for the class continuously for 5 years"],["Minst 20 år og hatt førerkort i 2 år","At least 20 and held a licence for 2 years"],["Må være trafikklærer","Must be a driving instructor"]);
q("fk","Hvor lenge varer prøvetiden etter at du har fått førerkort?","How long is the probation period after getting your licence?",["2 år","2 years"],["1 år","1 year"],["3 år","3 years"]);
q("fk","Hva skjer med prikker du får i prøvetiden?","What happens to penalty points you get during probation?",["De teller dobbelt","They count double"],["De teller ikke","They don't count"],["De slettes etter ett år","They are deleted after a year"]);
q("fk","Hvor mange prikker innen 3 år gir tap av førerretten?","How many points within 3 years lead to losing your licence?",["8","8"],["12","12"],["5","5"],"8 prikker innen 3 år gir tap av førerretten i 6 måneder.","8 points in 3 years: licence lost for 6 months.");
q("fk","Du mister førerretten i prøvetiden. Hva må du gjøre for å få den tilbake?","You lose your licence during probation. What must you do to get it back?",["Ta ny førerprøve","Retake the driving test"],["Bare vente til tiden er ute","Simply wait out the period"],["Betale et gebyr","Pay a fee"]);
q("fk","Hvor mange passasjerer kan du ha med klasse B, i tillegg til deg selv?","How many passengers may you carry with class B, besides yourself?",["Høyst 8","At most 8"],["Høyst 5","At most 5"],["Høyst 12","At most 12"]);
q("fk","Hva er høyeste tillatte totalvekt for en bil du kan kjøre med klasse B?","What is the maximum permitted total weight of a car you may drive with class B?",["3500 kg","3500 kg"],["2500 kg","2500 kg"],["7500 kg","7500 kg"]);
q("fk","Må du ha førerkortet med deg når du kjører?","Must you carry your licence when driving?",["Ja, alltid","Yes, always"],["Nei, det holder at det er registrert","No, it's enough that it's registered"],["Bare på lange turer","Only on long trips"]);

q("fk","Hvor mange timer er trafikalt grunnkurs?","How many hours is the basic traffic course?",["17 timer","17 hours"],["8 timer","8 hours"],["30 timer","30 hours"],"Minst 5 samlinger, bare én samling per dag.","At least 5 sessions, only one per day.");
q("fk","Hva må være fullført før du kan begynne å øvingskjøre?","What must be completed before you can start practice driving?",["Trafikalt grunnkurs","The basic traffic course"],["Teoriprøven","The theory test"],["Sikkerhetskurs på veg","The road safety course"]);
q("fk","Hvor mange trinn har opplæringen i klasse B?","How many stages does class B training have?",["4","4"],["3","3"],["6","6"]);
q("fk","Når har du obligatorisk trinnvurdering?","When do you have a compulsory stage assessment?",["På slutten av trinn 2 og trinn 3","At the end of stages 2 and 3"],["Bare før førerprøven","Only before the driving test"],["Etter trafikalt grunnkurs","After the basic traffic course"]);
q("fk","Hva øver du på i sikkerhetskurs på øvingsbane?","What do you practise on the training-track safety course?",["Sikring av personer og last, og hvordan fart og veggrep påvirker bremsing og styring","Securing people and load, and how speed and grip affect braking and steering"],["Parallellparkering","Parallel parking"],["Kjøring i bykjernen","Driving in the city centre"]);
q("fk","Hvor mange timer er sikkerhetskurs på veg for klasse B?","How many hours is the class B road safety course?",["13 timer","13 hours"],["4 timer","4 hours"],["17 timer","17 hours"],"Bilkjøringens risiko 2 t, landeveg 5 t, variert trafikkmiljø 4 t, refleksjon 2 t.","Risks of driving 2 h, country road 5 h, varied traffic 4 h, reflection 2 h.");
q("fk","Hvor mange timer av trafikalt grunnkurs handler om å være trafikant i mørket?","How many hours of the basic course are about being a road user in the dark?",["3 timer","3 hours"],["1 time","1 hour"],["6 timer","6 hours"]);
q("fk","Hva er mengdetrening?","What is 'mengdetrening'?",["Å øve mye på noe du allerede har fått opplæring i","Practising a lot at something you've already been taught"],["Å kjøre med tung last","Driving with a heavy load"],["Å ta mange kjøretimer på én dag","Taking many lessons in one day"]);

q("fk","Hvor lenge må du vente før du kan ta teoriprøven på nytt hvis du stryker?","How long must you wait to retake the theory test if you fail?",["2 uker","2 weeks"],["1 dag","1 day"],["3 måneder","3 months"]);
q("fk","Hvor tidlig kan du ta teoriprøven for klasse B?","How early can you take the class B theory test?",["6 måneder før du fyller 18","6 months before you turn 18"],["Når du fyller 16","When you turn 16"],["Først etter at du har fylt 18","Only after you turn 18"]);

q("fk","Du blir tatt for å kjøre bil uten førerkort. Når kan du tidligst få førerett?","You're caught driving without a licence. When can you get one at the earliest?",["Tidligst 6 måneder etter den ulovlige kjøringen","No sooner than 6 months after the illegal driving"],["Med en gang du består førerprøven","As soon as you pass the test"],["Etter 5 år","After 5 years"],"Vegtrafikkloven § 24 a. Ett år hvis kjøringen voldte større skade.","Road Traffic Act § 24 a. One year if the driving caused major damage.");
q("fk","Hvem regnes som fører av bilen ved privat øvingskjøring?","Who counts as the driver during private practice driving?",["Ledsageren","The supervisor"],["Eleven","The learner"],["Eieren av bilen","The car's owner"],"Vegtrafikkloven § 26. Eleven må likevel følge trafikkreglene og rusreglene.","Road Traffic Act § 26. The learner must still follow the traffic and alcohol rules.");
q("fk","Eleven har drukket litt alkohol, men ledsageren er edru. Kan eleven øvingskjøre?","The learner has had some alcohol, but the supervisor is sober. May the learner practise?",["Nei, rusreglene gjelder også for eleven","No, the alcohol rules apply to the learner too"],["Ja, fordi ledsageren regnes som fører","Yes, because the supervisor counts as the driver"],["Ja, under 0,5 promille","Yes, under 0.5 per mille"]);
q("fk","Hvilke dokumenter skal være med når du kjører?","Which documents must you have with you when driving?",["Førerkortet ditt og bilens vognkort","Your licence and the car's registration document"],["Bare forsikringsbeviset","Only the insurance certificate"],["Ingen, alt er digitalt registrert","None, everything is registered digitally"]);

/* ---------- Mennesket bak rattet ---------- */
q("me","Hva er promillegrensen for bilførere i Norge?","What is the blood alcohol limit for drivers in Norway?",["0,2 promille","0.2 per mille"],["0,5 promille","0.5 per mille"],["0,8 promille","0.8 per mille"]);
q("me","Hva får promillen til å synke raskere?","What makes your blood alcohol drop faster?",["Ingenting. Bare tid hjelper.","Nothing. Only time helps."],["Sterk kaffe","Strong coffee"],["Mat og en kald dusj","Food and a cold shower"],"Kroppen forbrenner ca. 0,1–0,15 promille i timen.","The body burns about 0.1–0.15 per mille per hour.");
q("me","Du har vært i en ulykke og kan regne med politietterforskning. Hvor lenge kan du ikke drikke alkohol etter kjøringen?","You've been in an accident and can expect a police investigation. How long after driving may you not drink alcohol?",["6 timer","6 hours"],["2 timer","2 hours"],["24 timer","24 hours"]);
q("me","Hva betyr en rød trekant på en medisinpakke?","What does a red triangle on a medicine pack mean?",["Medisinen kan svekke evnen til å kjøre","The medicine may impair your driving"],["Medisinen må oppbevares kaldt","The medicine must be kept cold"],["Medisinen er reseptfri","The medicine is over the counter"]);
q("me","Du blir veldig trøtt under kjøringen. Hva bør du gjøre?","You get very tired while driving. What should you do?",["Stoppe på et trygt sted og hvile eller sove litt","Stop somewhere safe and rest or take a short nap"],["Åpne vinduet og skru opp musikken","Open the window and turn up the music"],["Kjøre fortere for å komme fram før","Drive faster to arrive sooner"]);
q("me","Hva er mikrosøvn?","What is micro-sleep?",["Du sovner i noen sekunder uten å merke det","You fall asleep for a few seconds without noticing"],["En kort hvil på en rasteplass","A short rest at a lay-by"],["Når du blunker ofte","When you blink a lot"]);
q("me","Hva gjelder for mobiltelefon under kjøring?","What applies to mobile phones while driving?",["Håndholdt bruk er forbudt og gir bot og 3 prikker","Handheld use is banned and gives a fine and 3 points"],["Det er lov å sende korte meldinger i kø","Short texts are allowed in queues"],["Det er lov hvis du holder telefonen lavt","It's allowed if you hold the phone low"]);
q("me","Du ser ned på telefonen i 2 sekunder i 80 km/t. Omtrent hvor langt kjører du i blinde?","You look at your phone for 2 seconds at 80 km/h. About how far do you drive blind?",["Over 40 meter","Over 40 metres"],["Ca. 10 meter","About 10 metres"],["Ca. 5 meter","About 5 metres"],"80 km/t er ca. 22 meter i sekundet.","80 km/h is about 22 metres per second.");
q("me","Hva skjer med synsfeltet ditt når farten øker?","What happens to your field of view as speed increases?",["Det blir smalere","It gets narrower"],["Det blir bredere","It gets wider"],["Det endrer seg ikke","It doesn't change"]);
q("me","Hvorfor skal du se over skulderen før du skifter felt?","Why look over your shoulder before changing lanes?",["For å sjekke blindsonen, som speilene ikke viser","To check the blind spot the mirrors don't show"],["Fordi det er påbudt i stedet for å bruke speil","Because it's required instead of using mirrors"],["For å se om politiet følger etter","To see if the police are following"]);
q("me","Du er sint og stresset etter en krangel. Hva er riktig?","You're angry and stressed after an argument. What's right?",["Sterke følelser gjør deg til en dårligere sjåfør, så vent eller kjør ekstra rolig","Strong emotions make you a worse driver, so wait or drive extra calmly"],["Det påvirker ikke kjøringen","It doesn't affect your driving"],["Du kjører bedre fordi du er mer våken","You drive better because you're more alert"]);

q("me","Hva sier grunnregelen i vegtrafikkloven § 3?","What does the basic rule in Road Traffic Act § 3 say?",["Ferdes hensynsfullt, vær aktpågivende og varsom, og ikke hindre annen trafikk unødig","Travel considerately, be attentive and careful, and don't needlessly obstruct others"],["Kjør alltid så fort som fartsgrensen tillater","Always drive as fast as the limit allows"],["Den som kommer først, har forkjørsrett","Whoever arrives first has priority"]);
q("me","Hva bygger nullvisjonen på?","What is Vision Zero built on?",["Delt ansvar mellom myndighetene og trafikantene","Shared responsibility between the authorities and road users"],["At bare politiet har ansvar","That only the police are responsible"],["At ulykker ikke kan unngås","That accidents can't be avoided"]);

q("me","Hva er grensen for alkohol i utåndingsluften?","What is the alcohol limit in your breath?",["0,1 milligram per liter luft","0.1 milligrams per litre of air"],["0,2 milligram per liter luft","0.2 milligrams per litre of air"],["0,5 milligram per liter luft","0.5 milligrams per litre of air"],"Det tilsvarer 0,2 promille i blodet (vegtrafikkloven § 22).","That matches 0.2 per mille in the blood (Road Traffic Act § 22).");
q("me","Hvilken straff gir som regel kjøring med over 1,2 promille?","What penalty does driving at over 1.2 per mille usually bring?",["Bot og ubetinget fengsel","A fine and actual prison"],["Bare bot","Only a fine"],["En advarsel","A warning"],"Vegtrafikkloven § 31. I tillegg mister du førerretten i minst 1 år.","Road Traffic Act § 31. You also lose your licence for at least 1 year.");
q("me","Du blir tatt med 0,7 promille. Hvor lenge mister du minst førerretten?","You're caught at 0.7 per mille. For how long at least do you lose your licence?",["1 år","1 year"],["1 måned","1 month"],["Ingenting, bare bot","Nothing, just a fine"],"Vegtrafikkloven § 33: minst 1 år ved over 0,5 promille.","Road Traffic Act § 33: at least 1 year above 0.5 per mille.");
q("me","Du er syk og føler deg svekket, men er ikke ruset. Kan du kjøre?","You're ill and feel weak, but aren't intoxicated. May you drive?",["Nei, ikke hvis du ikke er skikket til å kjøre trygt","No, not if you're not fit to drive safely"],["Ja, det er bare rus som er forbudt","Yes, only intoxication is banned"],["Ja, hvis turen er kort","Yes, if the trip is short"],"Vegtrafikkloven § 21 gjelder rus, sykdom, svekkelse og tretthet.","Road Traffic Act § 21 covers intoxicants, illness, weakness and tiredness.");

/* ---------- Fart, avstand og fysikk ---------- */
q("fy","Hva er fartsgrensen i tettbygd strøk når det ikke er skiltet noe annet?","What is the speed limit in built-up areas when nothing else is signed?",["50 km/t","50 km/h"],["30 km/t","30 km/h"],["60 km/t","60 km/h"]);
q("fy","Hva er fartsgrensen utenfor tettbygd strøk når det ikke er skiltet noe annet?","What is the speed limit outside built-up areas when nothing else is signed?",["80 km/t","80 km/h"],["90 km/t","90 km/h"],["70 km/t","70 km/h"]);
q("fy","Hva er stopplengde?","What is stopping distance?",["Reaksjonslengde + bremselengde","Reaction distance + braking distance"],["Bare bremselengden","Just the braking distance"],["Avstanden til bilen foran","The distance to the car ahead"]);
q("fy","Du dobler farten. Hva skjer med bremselengden?","You double your speed. What happens to the braking distance?",["Den blir omtrent fire ganger så lang","It becomes about four times as long"],["Den blir dobbelt så lang","It doubles"],["Den blir like lang","It stays the same"]);
q("fy","Omtrent hvor lang er reaksjonslengden i 50 km/t, med 1 sekunds reaksjonstid?","About how long is the reaction distance at 50 km/h, with 1 second reaction time?",["Ca. 14 meter","About 14 metres"],["Ca. 5 meter","About 5 metres"],["Ca. 50 meter","About 50 metres"],"Farten i km/t delt på 3,6 gir meter per sekund.","Speed in km/h divided by 3.6 gives metres per second.");
q("fy","Hvor stor avstand bør du minst holde til bilen foran i gode forhold?","What is the minimum gap to keep behind the car ahead in good conditions?",["3 sekunder","3 seconds"],["1 sekund","1 second"],["En billengde","One car length"]);
q("fy","Hva er hovedregelen for å velge fart?","What is the main rule for choosing your speed?",["Du skal kunne stanse på den delen av vegen du kan se er fri","You must be able to stop within the distance you can see is clear"],["Du skal alltid holde fartsgrensen","You should always drive at the limit"],["Du skal holde samme fart som de andre","You should match everyone else"]);
q("fy","Å kollidere i 50 km/t tilsvarer omtrent et fall fra hvilken høyde?","Crashing at 50 km/h is about like falling from what height?",["Ca. 10 meter","About 10 metres"],["Ca. 2 meter","About 2 metres"],["Ca. 50 meter","About 50 metres"]);
q("fy","Bilen begynner å vannplane. Hva gjør du?","The car starts aquaplaning. What do you do?",["Slipper gassen forsiktig, holder rattet rett og bremser ikke hardt","Ease off the throttle, keep the wheel straight and don't brake hard"],["Bremser så hardt du kan","Brake as hard as you can"],["Gir mer gass for å komme gjennom","Accelerate to get through"]);
q("fy","Hva er riktig nødbremsing i en bil med ABS?","What is the right emergency stop in a car with ABS?",["Trå bremsen hardt inn, hold den inne og styr unna","Press the brake hard, keep it down and steer around"],["Pump bremsen raskt","Pump the brake quickly"],["Bremse forsiktig for å ikke låse hjulene","Brake gently so the wheels don't lock"]);
q("fy","Hvorfor gir vannplaning størst fare?","What increases the risk of aquaplaning most?",["Høy fart, slitte dekk og mye vann på vegen","High speed, worn tyres and lots of water on the road"],["Lav fart i tørt vær","Low speed in dry weather"],["Nye vinterdekk","New winter tyres"]);
q("fy","Du møter en bil på en smal veg. Hvor kort må du kunne stanse?","You meet a car on a narrow road. Within what distance must you be able to stop?",["På halvparten av den frie strekningen du ser","Within half the clear distance you can see"],["På hele strekningen du ser","Within the whole distance you can see"],["Det er ingen regel","There's no rule"]);
qi("fart50","fy","Du har passert dette skiltet. Når slutter fartsgrensen å gjelde?","You've passed this sign. When does the limit stop applying?",["Når et nytt fartsgrenseskilt sier noe annet","When a new speed sign says otherwise"],["Etter neste kryss","After the next junction"],["Etter 1 kilometer","After 1 kilometre"]);

/* ---------- Kjøretøyet, last og tilhenger ---------- */
q("kj","Hva er minste lovlige mønsterdybde på vinterdekk når det er vinterføre?","What is the minimum legal tread depth on winter tyres in winter conditions?",["3 mm","3 mm"],["1,6 mm","1.6 mm"],["5 mm","5 mm"]);
q("kj","Hva er minste lovlige mønsterdybde på sommerdekk?","What is the minimum legal tread depth on summer tyres?",["1,6 mm","1.6 mm"],["3 mm","3 mm"],["0,8 mm","0.8 mm"]);
q("kj","Når er piggdekk tillatt i Sør-Norge?","When are studded tyres allowed in southern Norway?",["Fra 1. november til første søndag etter 2. påskedag","From 1 November to the first Sunday after Easter Monday"],["Hele året","All year"],["Fra 1. desember til 1. mars","From 1 December to 1 March"]);
q("kj","Et rødt varsellys tennes på dashbordet. Hva gjør du?","A red warning light comes on. What do you do?",["Stopper så snart det er trygt og finner ut hva det er","Stop as soon as it's safe and find out what it is"],["Kjører videre til neste service","Keep driving until the next service"],["Ignorerer det hvis bilen går fint","Ignore it if the car seems fine"]);
q("kj","Hvem har ansvaret for at bilen er i forsvarlig stand når du kjører?","Who is responsible for the car being roadworthy when you drive?",["Føreren","The driver"],["Eieren alene","The owner alone"],["Verkstedet","The garage"]);
q("kj","Hvem har ansvaret for at en passasjer på 12 år bruker bilbelte?","Who is responsible for a 12-year-old passenger wearing a seatbelt?",["Føreren","The driver"],["Barnet selv","The child"],["Foreldrene, selv om de ikke er med","The parents, even if absent"],"Føreren har ansvar for at passasjerer under 15 år er sikret.","The driver is responsible for passengers under 15 being secured.");
q("kj","Hvor kan et bakovervendt barnesete IKKE plasseres?","Where must a rear-facing child seat NOT be placed?",["Foran en aktiv kollisjonspute","In front of an active airbag"],["I baksetet","In the back seat"],["Bak føreren","Behind the driver"]);
q("kj","Barn under hvilken høyde skal bruke godkjent barnesikringsutstyr?","Children under what height must use an approved child restraint?",["135 cm","135 cm"],["120 cm","120 cm"],["150 cm","150 cm"],"Mellom 135 og 150 cm skal barnet bruke sikringsutstyr hvis det finnes i bilen.","Between 135 and 150 cm the child must use a restraint if the car has one.");
q("kj","Hva skal alltid ligge i bilen?","What must always be in the car?",["Varseltrekant og refleksvest til føreren","A warning triangle and a hi-vis vest for the driver"],["Brannslukker og førstehjelpsskrin","A fire extinguisher and first-aid kit"],["Reservehjul og snøkjetting","A spare wheel and snow chains"]);
q("kj","Hvor ofte skal en vanlig personbil på EU-kontroll?","How often must a normal car have an EU roadworthiness test?",["Hvert annet år (første gang innen 4 år)","Every two years (first within 4 years)"],["Hvert år","Every year"],["Hvert femte år","Every five years"]);
q("kj","Hvor tung tilhenger kan du alltid trekke med klasse B, uansett vekten på bilen?","How heavy a trailer may you always tow with class B, whatever the car weighs?",["750 kg tillatt totalvekt","750 kg permitted total weight"],["1500 kg","1500 kg"],["3500 kg","3500 kg"]);
q("kj","Hva er normalt høyeste tillatte fart med tilhenger?","What is the normal top speed with a trailer?",["80 km/t","80 km/h"],["60 km/t","60 km/h"],["90 km/t","90 km/h"],"Gjelder også hengere uten brems. 60 km/t-grensen for dem ble fjernet i 2022.","Also for unbraked trailers. Their 60 km/h limit was removed in 2022.");
q("kj","Hvorfor skal løse gjenstander i bilen sikres?","Why must loose objects in the car be secured?",["I en kollisjon blir de farlige prosjektiler","In a crash they become dangerous projectiles"],["Fordi det er stygt","Because it looks untidy"],["Fordi de gjør bilen tyngre","Because they make the car heavier"]);

q("kj","Hvordan kan last i bilen gjøre det vanskelig for andre trafikanter?","How can load in the car cause problems for other road users?",["Den kan skjule blinklys og bremselys eller hindre sikten","It can hide indicators and brake lights or block the view"],["Den gjør bilen roligere","It makes the car calmer"],["Det kan den ikke","It can't"]);
q("kj","Hvilke metoder brukes for å sikre last?","Which methods are used to secure load?",["Låsing, stenging, surring og dekking","Locking, blocking, lashing and covering"],["Bare å legge lasten tungt","Just packing it heavily"],["Å kjøre sakte","Driving slowly"]);
q("kj","Hvorfor bør du sjekke drivstoff og motorolje før en lang tur?","Why check fuel and engine oil before a long trip?",["Så du ikke blir stående på et farlig sted, f.eks. i en tunnel","So you don't get stranded somewhere dangerous, like a tunnel"],["Fordi det er påbudt hver dag","Because it's required daily"],["For å få bedre radio","For better radio"]);

q("kj","Politiet eller Statens vegvesen gir deg tegn til å stanse for kontroll. Hva gjelder?","The police or Statens vegvesen signal you to stop for a check. What applies?",["Du skal straks stanse og vise fram påbudte dokumenter","You must stop at once and show the required documents"],["Du kan kjøre videre hvis du har det travelt","You can carry on if you're in a hurry"],["Bare politiet kan stanse deg","Only the police can stop you"],"Vegtrafikkloven § 10.","Road Traffic Act § 10.");

/* ---------- Miljø og økonomisk kjøring ---------- */
q("mi","Hva sparer mest drivstoff?","What saves the most fuel?",["Jevn kjøring, se langt fram og gire opp tidlig","Smooth driving, looking far ahead and shifting up early"],["Kjøre på lavt gir lenge","Staying in low gear for a long time"],["Bråbremse og akselerere fort","Braking hard and accelerating fast"]);
q("mi","Hvorfor bør du fjerne takboksen når du ikke trenger den?","Why remove the roof box when you don't need it?",["Den øker luftmotstanden og forbruket","It increases drag and fuel use"],["Det er påbudt om vinteren","It's required in winter"],["Den gjør bilen ustabil i lav fart","It makes the car unstable at low speed"]);
q("mi","Hva er ulempen med piggdekk for miljøet?","What is the environmental downside of studded tyres?",["De sliter asfalten og gir svevestøv","They wear the asphalt and create airborne dust"],["De øker CO₂-utslippet kraftig","They sharply increase CO₂"],["De lager oljesøl","They cause oil spills"]);
q("mi","Hvorfor er motorvarmer lurt om vinteren?","Why is an engine heater a good idea in winter?",["Mindre slitasje og lavere utslipp ved kaldstart","Less wear and lower emissions at cold start"],["Det gjør bilen raskere","It makes the car faster"],["Det er påbudt","It's required"]);
q("mi","Hva skjer med støy og utslipp når farten går ned?","What happens to noise and emissions when speed goes down?",["De blir mindre","They go down"],["De blir større","They go up"],["De er like","They stay the same"]);
q("mi","Hva bør du gjøre når du venter med bilen i flere minutter?","What should you do when waiting in the car for several minutes?",["Slå av motoren og unngå tomgangskjøring","Turn off the engine and avoid idling"],["La motoren gå for å holde batteriet i gang","Keep the engine running for the battery"],["Gi litt gass innimellom","Rev the engine now and then"]);
q("mi","Hvordan påvirker for lavt dekktrykk bilen?","How does tyre pressure that's too low affect the car?",["Høyere forbruk og dårligere veigrep","Higher fuel use and worse grip"],["Lavere forbruk","Lower fuel use"],["Ingen ting","Nothing"]);

/* ---------- Vikeplikt og kryss ---------- */
q("vi","Hva er høyreregelen?","What is the right-hand rule?",["Du har vikeplikt for kjørende som kommer fra høyre","You must give way to traffic from your right"],["Du har forkjørsrett for alle som kommer fra høyre","You have priority over traffic from your right"],["Du skal alltid svinge til høyre i kryss","You must always turn right at junctions"]);
q("vi","Hva betyr det å ha vikeplikt?","What does giving way mean?",["Å kjøre slik at den andre ikke må endre fart eller retning brått","Driving so the other road user doesn't have to suddenly change speed or direction"],["Å stoppe helt i alle kryss","Stopping fully at every junction"],["Å blinke med lysene","Flashing your lights"]);
qi("vikeplikt","vi","Du kommer til dette skiltet. Hvem har du vikeplikt for?","You reach this sign. Who must you give way to?",["Trafikk fra begge sider på vegen du skal inn på","Traffic from both sides on the road you're entering"],["Bare trafikk fra høyre","Only traffic from the right"],["Ingen, du har forkjørsrett","No one, you have priority"]);
qi("stopp","vi","Hva krever dette skiltet?","What does this sign require?",["Full stans, deretter vikeplikt for trafikk fra begge sider","A full stop, then give way to traffic from both sides"],["Stans bare hvis det kommer biler","Stop only if cars are coming"],["Senk farten til 10 km/t","Slow to 10 km/h"]);
qi("forkjorsveg","vi","Du kjører på en veg med dette skiltet. Hva gjelder i kryssene?","You're on a road with this sign. What applies at junctions?",["Trafikk fra sidevegene har vikeplikt for deg","Side-road traffic must give way to you"],["Høyreregelen","The right-hand rule"],["Du har vikeplikt for alle","You must give way to everyone"]);
q("vi","Du kjører ut fra en parkeringsplass. Hvem har du vikeplikt for?","You drive out of a car park. Who must you give way to?",["Alle på vegen du kjører inn på","Everyone on the road you're entering"],["Bare dem fra høyre","Only those from the right"],["Ingen hvis du blinker","No one if you signal"]);
q("vi","Du kjører ut fra en bensinstasjon. Hva gjelder?","You drive out of a petrol station. What applies?",["Du har vikeplikt for alle","You must give way to everyone"],["Høyreregelen","The right-hand rule"],["Du har forkjørsrett","You have priority"]);
q("vi","Du skal svinge til venstre i et kryss uten skilt. Det kommer en bil rett imot deg. Hvem kjører først?","You're turning left at an unsigned junction. A car is coming straight towards you. Who goes first?",["Den møtende bilen","The oncoming car"],["Du, fordi du kom først","You, because you arrived first"],["Den som blinker først","Whoever signals first"]);
q("vi","Du svinger til høyre, og en fotgjenger krysser vegen du svinger inn på. Hva gjør du?","You turn right and a pedestrian is crossing the road you're turning into. What do you do?",["Lar fotgjengeren gå over først","Let the pedestrian cross first"],["Kjører først fordi det ikke er gangfelt","Go first because there's no crossing"],["Tuter for å varsle","Sound the horn to warn them"]);
q("vi","Du svinger til høyre over et sykkelfelt der en syklist kjører rett fram. Hvem har vikeplikt?","You turn right across a cycle lane where a cyclist is going straight. Who must give way?",["Du","You"],["Syklisten","The cyclist"],["Den som er raskest","Whoever is faster"]);
q("vi","Hvem har vikeplikt i en rundkjøring?","Who must give way at a roundabout?",["De som skal inn, for dem som allerede er i rundkjøringen","Those entering, for those already in it"],["De som er i rundkjøringen, for dem som skal inn","Those in it, for those entering"],["Den som kommer fra høyre","Whoever comes from the right"]);
q("vi","Når skal du gi tegn i en rundkjøring?","When must you signal in a roundabout?",["Til høyre før du kjører ut","Right, before you exit"],["Aldri","Never"],["Bare når du kjører inn","Only when entering"]);
q("vi","Du hører sirene og ser blålys bak deg. Hva gjør du?","You hear a siren and see blue lights behind you. What do you do?",["Gjør plass så fort det er trygt, f.eks. ved å kjøre til siden","Make room as soon as it's safe, e.g. by pulling over"],["Bråbremser midt i feltet","Brake hard in the middle of the lane"],["Kjører over på rødt for å komme unna uansett","Drive through a red light whatever happens"]);
q("vi","En buss gir tegn for å kjøre ut fra holdeplassen. Fartsgrensen er 50 km/t. Hva gjør du?","A bus signals to pull out from its stop. The limit is 50 km/h. What do you do?",["Slipper bussen ut, du har vikeplikt","Let the bus out, you must give way"],["Kjører forbi, du har forkjørsrett","Pass it, you have priority"],["Tuter så bussen venter","Honk so the bus waits"],"Vikeplikten gjelder på veg med fartsgrense 60 km/t eller lavere.","This applies on roads with a limit of 60 km/h or less.");
q("vi","To felt går sammen til ett uten oppmerking. Hvordan skal dere flette?","Two lanes merge into one with no markings. How should you merge?",["Én og én fra hvert felt (glidelås)","One from each lane in turn (zipper)"],["Bilene i venstre felt kjører først","Cars in the left lane go first"],["Den som kjører fortest, kjører først","Whoever is fastest goes first"]);
qi("sluttForkjorsveg","vi","Du passerer dette skiltet. Hva gjelder fra nå i kryss uten andre skilt?","You pass this sign. What applies now at junctions with no other signs?",["Høyreregelen","The right-hand rule"],["Du har fortsatt forkjørsrett","You still have priority"],["Du har vikeplikt for alle","You must give way to everyone"]);
q("vi","Du kjører ut fra en gang- og sykkelveg og inn på en bilveg. Hva gjelder?","You drive from a footpath/cycle path onto a road. What applies?",["Du har vikeplikt for alle","You must give way to everyone"],["Høyreregelen","The right-hand rule"],["Du har forkjørsrett","You have priority"]);

/* ---------- Trafikkskilt ---------- */
qi("innkjoringForbudt","sk","Hva betyr dette skiltet?","What does this sign mean?",["Innkjøring forbudt","No entry"],["Stans forbudt","No stopping"],["Envegskjøring","One-way street"]);
qi("kjoringForbudt","sk","Hva betyr dette skiltet?","What does this sign mean?",["Kjøring forbudt for alle motorvogner","No motor vehicles"],["Fartsgrense opphører","End of speed limit"],["Parkering tillatt","Parking allowed"]);
qi("parkeringForbudt","sk","Hva kan du gjøre der dette skiltet står?","What may you do where this sign stands?",["Stanse kort for av- og påstigning eller av- og pålessing","Stop briefly to let people in or out, or to load"],["Ingenting, stans er forbudt","Nothing, stopping is banned"],["Parkere i inntil 1 time","Park for up to 1 hour"]);
qi("stansForbudt","sk","Hva betyr dette skiltet?","What does this sign mean?",["Stans forbudt, også for av- og påstigning","No stopping, not even to drop someone off"],["Parkering forbudt, men kort stans tillatt","No parking, but a short stop is fine"],["Kjøring forbudt","No vehicles"]);
qi("forbikjoringForbudt","sk","Hva betyr dette skiltet?","What does this sign mean?",["Forbikjøring forbudt","No overtaking"],["Møteplikt","Give way to oncoming traffic"],["Kø fram","Queue ahead"]);
qi("pabudtHoyre","sk","Hva slags skilt er dette, og hva betyr det?","What kind of sign is this, and what does it mean?",["Påbudsskilt: du må kjøre til høyre","Mandatory sign: you must go right"],["Opplysningsskilt: veg til høyre","Information sign: road to the right"],["Fareskilt: sving til høyre","Warning sign: bend to the right"]);
qi("gangfelt","sk","Hva viser dette skiltet?","What does this sign show?",["Gangfelt","A pedestrian crossing"],["Gangveg, kjøring forbudt","A footpath, no driving"],["Skole i nærheten","School nearby"]);
qi("envegskjoring","sk","Hva betyr dette skiltet?","What does this sign mean?",["Envegskjøring: all trafikk i pilens retning","One-way traffic: all traffic in the arrow's direction"],["Påbudt å kjøre rett fram i neste kryss","You must go straight at the next junction"],["Forkjørsveg","Priority road"]);
qi("parkering","sk","Hva betyr dette skiltet?","What does this sign mean?",["Parkering tillatt","Parking allowed"],["Politistasjon","Police station"],["Pause-plass for lastebiler","Truck rest stop"]);
qi("annenFare","sk","Hvilken gruppe hører dette skiltet til?","Which group does this sign belong to?",["Fareskilt","Warning signs"],["Forbudsskilt","Prohibition signs"],["Vikepliktskilt","Priority signs"]);
qi("farligSving","sk","Hva varsler dette skiltet?","What does this sign warn about?",["Farlig sving til høyre","A dangerous bend to the right"],["Påbudt å svinge til høyre","You must turn right"],["Avkjørsel til høyre","An exit on the right"]);
q("sk","Hvilken form og farge har forbudsskilt?","What shape and colour are prohibition signs?",["Runde med rød kant","Round with a red border"],["Runde og blå","Round and blue"],["Trekantede med rød kant","Triangular with a red border"]);
q("sk","Hvilken form og farge har påbudsskilt?","What shape and colour are mandatory signs?",["Runde og blå","Round and blue"],["Firkantede og blå","Square and blue"],["Runde med rød kant","Round with a red border"]);
q("sk","En politibetjent gir deg tegn til å kjøre, men lyset er rødt. Hva gjør du?","A police officer signals you to go, but the light is red. What do you do?",["Følger politiets tegn","Follow the officer's signal"],["Venter til det blir grønt","Wait for green"],["Kjører bare hvis ingen andre kjører","Go only if no one else does"],"Politiets tegn går foran lyssignal, og lyssignal går foran skilt.","Police signals override lights, and lights override signs.");
q("sk","Lyskrysset virker, men det står også et vikepliktskilt der. Hva følger du?","The traffic light is working, but there's also a give-way sign. Which do you follow?",["Lyssignalet","The traffic light"],["Vikepliktskiltet","The give-way sign"],["Høyreregelen","The right-hand rule"]);
q("sk","Hva er et underskilt?","What is a supplementary plate?",["Et lite skilt under et annet skilt som utfyller eller begrenser det","A small plate under a sign that adds to or limits it"],["Et midlertidig skilt ved vegarbeid","A temporary sign at roadworks"],["Et skilt som står på bakken","A sign standing on the ground"]);

/* ---------- Vegoppmerking og lyssignal ---------- */
q("op","Hva betyr gule linjer i vegbanen?","What do yellow lines on the road mean?",["De skiller trafikk i motsatt retning","They separate traffic going in opposite directions"],["De skiller trafikk i samme retning","They separate traffic going the same way"],["De markerer sykkelfelt","They mark cycle lanes"]);
qi("sperrelinje","op","Kan du kjøre over denne linjen?","May you cross this line?",["Nei, det er en sperrelinje","No, it's a solid no-crossing line"],["Ja, når det er trygt","Yes, when it's safe"],["Ja, for å kjøre forbi syklister","Yes, to pass cyclists"]);
qi("ledelinje","op","Hva slags linje er dette?","What kind of line is this?",["Ledelinje, du kan krysse den når det er trygt","A guide line, you may cross when it's safe"],["Sperrelinje","A no-crossing line"],["Kantlinje","An edge line"]);
qi("sperreOgLedelinje","op","Du kjører i høyre felt (ledelinjen er nærmest deg). Kan du krysse linjene for å kjøre forbi?","You're in the right lane (the broken line is on your side). May you cross to overtake?",["Ja, når det er trygt","Yes, when it's safe"],["Nei, aldri","No, never"],["Bare om natten","Only at night"]);
qi("haitenner","op","Hva betyr denne oppmerkingen tvers over feltet?","What does this marking across the lane mean?",["Vikepliktlinje","Give-way line"],["Fartsdump","Speed bump"],["Stopplinje","Stop line"]);
q("op","Hva betyr en varsellinje (lange streker, korte mellomrom)?","What does a warning line (long dashes, short gaps) mean?",["Den varsler fare eller at en sperrelinje kommer","It warns of danger or that a solid line is coming"],["At du kan parkere langs den","That you may park along it"],["At forbikjøring alltid er tillatt","That overtaking is always allowed"]);
q("op","Hva gjelder for et sperreområde (skravert felt med heltrukken kant)?","What applies to a hatched area with a solid border?",["Du skal ikke kjøre inn i det","You must not drive into it"],["Du kan bruke det til forbikjøring","You may use it for overtaking"],["Du kan parkere der","You may park there"]);
q("op","Det er piler i kjørefeltet ditt som viser bare rett fram. Hva gjelder?","Your lane has arrows pointing straight only. What applies?",["Du må kjøre rett fram fra dette feltet","You must go straight from this lane"],["Det er bare en anbefaling","It's only a suggestion"],["Du kan svinge hvis du blinker","You may turn if you signal"]);
qi("lysRodGul","op","Hva betyr det når rødt og gult lyser samtidig?","What does red and yellow together mean?",["Det blir snart grønt, men du skal fortsatt stå","Green is coming, but you must still wait"],["Du kan kjøre hvis det er klart","Go if it's clear"],["Lyset er i ustand","The light is broken"]);
qi("lysGul","op","Lyset skifter fra grønt til gult rett før du kommer fram. Hva gjør du?","The light changes from green to yellow just before you arrive. What do you do?",["Stanser, med mindre du er så nær at du ikke kan stanse trygt","Stop, unless you're too close to stop safely"],["Gir gass for å rekke det","Speed up to make it"],["Kjører alltid videre","Always carry on"]);
q("op","Hva er rekkefølgen på lyssignalene i Norge?","What is the traffic light sequence in Norway?",["Rødt, rødt og gult, grønt, gult, rødt","Red, red and yellow, green, yellow, red"],["Rødt, grønt, gult, rødt","Red, green, yellow, red"],["Rødt, gult, grønt, rødt","Red, yellow, green, red"]);
q("op","Lyskrysset blinker gult. Hva gjelder?","The traffic light is flashing yellow. What applies?",["Kjør forsiktig og følg skilt og vikepliktregler","Proceed carefully and follow signs and right-of-way rules"],["Du har alltid forkjørsrett","You always have priority"],["Du skal stanse helt","You must stop completely"]);
q("op","Hva er en stopplinje?","What is a stop line?",["En heltrukken hvit linje tvers over feltet, der du stanser","A solid white line across the lane where you stop"],["En gul linje langs vegkanten","A yellow line along the edge"],["Trekanter tvers over feltet","Triangles across the lane"]);

/* ---------- Plassering, feltskifte og forbikjøring ---------- */
q("pl","Hvor skal du normalt plassere bilen på vegen?","Where should you normally position the car on the road?",["Så langt til høyre som det er praktisk og forsvarlig","As far right as is practical and safe"],["Midt i vegen","In the middle of the road"],["Helt inntil midtlinjen","Right next to the centre line"]);
q("pl","På hvilken side skal du normalt kjøre forbi?","On which side do you normally overtake?",["Venstre","Left"],["Høyre","Right"],["Den siden det er mest plass","Whichever has more room"]);
q("pl","Når kan du kjøre forbi på høyre side?","When may you overtake on the right?",["Når kjøretøyet foran svinger til venstre","When the vehicle ahead is turning left"],["Når som helst på landeveg","Any time on a country road"],["Når den foran kjører under fartsgrensen","When the vehicle ahead is under the limit"]);
q("pl","Hvor er forbikjøring farlig og ikke tillatt?","Where is overtaking dangerous and not allowed?",["Foran bakketopper og i uoversiktlige svinger","Before hilltops and in blind bends"],["På rett veg med god sikt","On a straight road with good visibility"],["På motorveg","On a motorway"]);
q("pl","En bil i feltet ved siden av deg har stanset foran et gangfelt. Hva gjør du?","A car in the next lane has stopped before a crossing. What do you do?",["Senker farten og er klar til å stanse, en gående kan være skjult","Slow down and be ready to stop, a pedestrian may be hidden"],["Kjører forbi i samme fart","Pass at the same speed"],["Tuter og kjører forbi","Honk and pass"]);
q("pl","Noen kjører forbi deg. Hva skal du gjøre?","Someone is overtaking you. What should you do?",["Holde til høyre og ikke øke farten","Keep right and don't speed up"],["Øke farten så det går fortere","Speed up so it's quicker"],["Bremse kraftig","Brake hard"]);
q("pl","Hva er riktig rekkefølge før feltskifte?","What's the right order before changing lanes?",["Speil, blindsone, tegn, skift felt","Mirror, blind spot, signal, change lane"],["Tegn, skift felt, speil","Signal, change lane, mirror"],["Skift felt, så tegn","Change lane, then signal"]);
q("pl","Gir blinklyset deg rett til å skifte felt?","Does signalling give you the right to change lanes?",["Nei, det informerer bare andre","No, it only informs others"],["Ja, de andre må slippe deg inn","Yes, others must let you in"],["Ja, etter 3 blink","Yes, after 3 blinks"]);
q("pl","Hvor er det forbudt å rygge og vende?","Where are reversing and U-turns banned?",["På motorveg","On motorways"],["På parkeringsplasser","In car parks"],["I boligområder","In residential areas"]);
q("pl","Du skal svinge til venstre fra en veg med ett felt i hver retning. Hvor plasserer du deg?","You're turning left from a road with one lane each way. Where do you position yourself?",["Inntil midtlinjen i ditt eget felt","Close to the centre line in your own lane"],["Helt ute til høyre","Far right"],["Over i motgående felt","In the oncoming lane"]);
q("pl","Du kjører forbi en syklist og møtende trafikk kommer. Det er ikke plass. Hva gjør du?","You're about to pass a cyclist and oncoming traffic is coming. There's no room. What do you do?",["Venter bak syklisten til det er plass","Wait behind the cyclist until there's room"],["Kjører tett forbi syklisten","Squeeze past the cyclist"],["Tuter så syklisten flytter seg","Honk so the cyclist moves"]);

/* ---------- Stans og parkering ---------- */
q("ps","På hvilken side av vegen skal du parkere?","Which side of the road should you park on?",["Høyre side i kjøreretningen (begge sider i envegskjørt gate)","The right in your direction of travel (either side in a one-way street)"],["Hvilken som helst side","Either side"],["Venstre side","The left"]);
q("ps","Hvor nær et gangfelt kan du stanse?","How close to a crossing may you stop?",["Ikke nærmere enn 5 meter foran gangfeltet","No closer than 5 metres before it"],["Helt inntil gangfeltet","Right up to it"],["Ikke nærmere enn 20 meter","No closer than 20 metres"]);
q("ps","Hvor nær et kryss kan du stanse?","How close to a junction may you stop?",["Ikke nærmere enn 5 meter fra krysset","No closer than 5 metres from it"],["Inntil krysset","Right at it"],["Ikke nærmere enn 50 meter","No closer than 50 metres"]);
q("ps","Hvor nær skiltet for en bussholdeplass kan du parkere?","How close to a bus stop sign may you park?",["Ikke nærmere enn 20 meter","No closer than 20 metres"],["Helt inntil skiltet","Right next to the sign"],["Ikke nærmere enn 5 meter","No closer than 5 metres"]);
q("ps","Hvor nær en planovergang kan du stanse?","How close to a level crossing may you stop?",["Ikke nærmere enn 5 meter","No closer than 5 metres"],["Inntil bommen","Right up to the barrier"],["Ikke nærmere enn 50 meter","No closer than 50 metres"]);
q("ps","Hvor er stans forbudt?","Where is stopping banned?",["I uoversiktlige svinger og på bakketopper","In blind bends and on hilltops"],["På parkeringsplasser","In car parks"],["Langs fortauet i boligområder","Along the kerb in residential areas"]);
q("ps","Du har parkert i en gate. Hva gjør du før du åpner døra?","You've parked in a street. What do you do before opening the door?",["Ser bakover etter syklister og biler","Look back for cyclists and cars"],["Åpner raskt så du ikke hindrer trafikken","Open quickly so you don't block traffic"],["Tuter for å varsle","Sound the horn"]);
q("ps","Du parkerer i en nedoverbakke med fortauskant. Hvordan vrir du hjulene?","You park facing downhill with a kerb. How do you turn the wheels?",["Mot fortauskanten","Toward the kerb"],["Rett fram","Straight"],["Ut mot vegen","Out toward the road"]);
q("ps","Kan du stanse i et sykkelfelt for å slippe av en passasjer?","May you stop in a cycle lane to drop off a passenger?",["Nei","No"],["Ja, i inntil 2 minutter","Yes, for up to 2 minutes"],["Ja, med nødblink","Yes, with hazard lights"],"Stans er forbudt i sykkelfelt, kollektivfelt og sambruksfelt (trafikkreglene § 17).","Stopping is banned in cycle, bus and shared lanes (traffic rules § 17).");
q("ps","Er det lov å parkere foran en innkjørsel?","May you park in front of a driveway?",["Nei","No"],["Ja, hvis det er din egen","Yes, if it's your own"],["Ja, om natten","Yes, at night"]);

/* ---------- Myke trafikanter ---------- */
q("my","En person står ved gangfeltet og er på vei ut. Hva gjør du?","Someone at a crossing is about to step out. What do you do?",["Stanser og lar personen gå","Stop and let them cross"],["Kjører videre fordi de ikke er i gangfeltet ennå","Drive on, they're not on it yet"],["Tuter for å varsle","Honk to warn them"]);
q("my","Omtrent på hvilken avstand ser du en gående uten refleks i mørket med nærlys?","At about what distance do you see a pedestrian without a reflector in the dark on dipped beam?",["25–30 meter","25–30 metres"],["140 meter","140 metres"],["100 meter","100 metres"],"Med refleks ser du dem på ca. 140 meter.","With a reflector, about 140 metres.");
q("my","Du kjører forbi en skole og ser barn på fortauet. Hva gjør du?","You pass a school and see children on the pavement. What do you do?",["Senker farten og er klar til å stanse","Slow down and be ready to stop"],["Tuter så de holder seg unna","Honk so they stay back"],["Kjører midt i vegen i samme fart","Drive in the middle at the same speed"]);
q("my","Hvorfor må du være spesielt oppmerksom på motorsyklister?","Why be especially aware of motorcyclists?",["De er smale, vanskelige å se, og farten er vanskelig å bedømme","They're narrow, hard to see, and their speed is hard to judge"],["De har alltid vikeplikt","They always have to give way"],["De kjører alltid sakte","They always ride slowly"]);
q("my","Du skal svinge til høyre. Hva må du sjekke spesielt?","You're turning right. What must you check in particular?",["Blindsonen, etter syklister på høyre side","Your blind spot, for cyclists on the right"],["Venstre speil","The left mirror"],["Bakluka","The boot"]);
q("my","Hvilken fart gjelder i et gatetun?","What speed applies in a home zone?",["Gangfart","Walking pace"],["30 km/t","30 km/h"],["50 km/t","50 km/h"]);
q("my","En buss står ved holdeplassen. Hva bør du forvente?","A bus is at its stop. What should you expect?",["At noen kan gå ut i vegen foran eller bak bussen","That people may step out in front of or behind it"],["At bussen alltid blir stående lenge","That it'll stay a long time"],["Ingenting spesielt","Nothing in particular"]);
q("my","Du møter en person som rir. Hva gjør du?","You meet someone riding a horse. What do you do?",["Kjører sakte forbi med god avstand og bruker ikke lydsignal","Pass slowly with plenty of room and don't honk"],["Tuter så hesten ser deg","Honk so the horse notices you"],["Kjører fort forbi så det går raskt","Pass quickly to get it over with"]);
q("my","Hvor stor avstand anbefales når du kjører forbi en syklist?","What gap is recommended when passing a cyclist?",["Minst 1,5 meter","At least 1.5 metres"],["30 cm","30 cm"],["Det er ingen anbefaling","There's no recommendation"]);
q("my","Hvorfor er eldre fotgjengere ekstra utsatt?","Why are older pedestrians extra vulnerable?",["De kan trenge mer tid og ha dårligere syn og hørsel","They may need more time and see and hear less well"],["De går alltid på rødt","They always cross on red"],["De har ikke vikeplikt","They never have to give way"]);
q("my","Kan du kjøre i et sykkelfelt?","May you drive in a cycle lane?",["Nei, bare krysse det når du svinger eller skal inn til en eiendom","No, only cross it when turning or entering a property"],["Ja, hvis det er tomt","Yes, if it's empty"],["Ja, i kø","Yes, in a queue"]);

/* ---------- Mørke, vinter, tunnel og motorveg ---------- */
q("ut","Hvilket lys skal du bruke når du kjører om dagen?","Which lights must you use when driving by day?",["Nærlys eller kjørelys","Dipped headlights or daytime running lights"],["Ingen lys","No lights"],["Bare parklys","Only parking lights"]);
q("ut","Når skal du blende av fjernlyset?","When must you dip your high beam?",["Når du møter noen og når du kjører rett bak noen","When meeting someone and when close behind someone"],["Bare i tettbygd strøk","Only in built-up areas"],["Aldri på landeveg","Never on country roads"]);
q("ut","Du blir blendet av en møtende bil. Hva gjør du?","You're dazzled by an oncoming car. What do you do?",["Senker farten og ser mot høyre vegkant","Slow down and look toward the right edge"],["Setter på fjernlys tilbake","Flash your high beam back"],["Ser rett inn i lyset","Look straight into the light"]);
q("ut","Hvilket lys bør du bruke i tett tåke?","Which lights should you use in thick fog?",["Nærlys og eventuelt tåkelys","Dipped beam and fog lights if fitted"],["Fjernlys","High beam"],["Bare parklys","Only parking lights"]);
q("ut","Ved hvilken temperatur er isen ofte glattest?","At what temperature is ice often most slippery?",["Rundt 0 °C","Around 0 °C"],["Rundt −20 °C","Around −20 °C"],["Rundt −10 °C","Around −10 °C"]);
q("ut","Hvor kan det være glatt selv om resten av vegen er bar?","Where can it be slippery even if the rest of the road is bare?",["På bruer og i skygge","On bridges and in shade"],["Rett etter en bensinstasjon","Right after a petrol station"],["I tettbygd strøk","In built-up areas"]);
q("ut","Hva skal du gjøre før du kjører en morgen med snø på bilen?","What must you do before driving on a snowy morning?",["Fjerne snø og is fra alle ruter, lykter og taket","Clear snow and ice from all windows, lights and the roof"],["Skrape en liten glugge i frontruta","Scrape a small peephole in the windscreen"],["Kjøre sakte til snøen blåser av","Drive slowly until it blows off"]);
q("ut","Når er faren for elg på vegen størst?","When is the risk of moose on the road highest?",["I skumringen og om høsten og vinteren","At dusk and in autumn and winter"],["Midt på dagen om sommeren","Midday in summer"],["Når det regner","When it rains"]);
q("ut","Hvilke kjøretøy er ikke tillatt på motorveg?","Which vehicles aren't allowed on motorways?",["Kjøretøy som ikke kan kjøre fortere enn 40 km/t","Vehicles that can't exceed 40 km/h"],["Bil med tilhenger","Cars with trailers"],["Elbiler","Electric cars"]);
q("ut","Hvordan kjører du inn på motorvegen?","How do you join a motorway?",["Bruker akselerasjonsfeltet til å få samme fart, og har vikeplikt","Use the acceleration lane to match speed, and give way"],["Stanser i enden av påkjøringen og venter","Stop at the end of the slip road and wait"],["Kjører rett inn, de andre må vike","Drive straight in, others must give way"]);
q("ut","Når skal du senke farten når du skal av motorvegen?","When should you slow down to leave a motorway?",["Når du er inne i retardasjonsfeltet","Once you're in the deceleration lane"],["I god tid før avkjøringen, i høyre felt","Well before the exit, in the right lane"],["Først når du er på rampen","Only on the ramp"]);
q("ut","Det brenner i en tunnel og bilen din står fast. Hva gjør du?","There's a fire in a tunnel and your car is stuck. What do you do?",["Slår av motoren, lar nøkkelen stå og går bort fra røyken til nødutgang","Turn off the engine, leave the key and walk away from the smoke to an exit"],["Blir sittende i bilen med vinduene lukket","Stay in the car with windows shut"],["Rygger ut av tunnelen","Reverse out of the tunnel"]);
q("ut","Lyset blinker ved en planovergang og bommen begynner å gå ned. Hva gjør du?","Lights are flashing at a level crossing and the barrier starts lowering. What do you do?",["Stanser","Stop"],["Kjører fort over før bommen er nede","Hurry across before it's down"],["Kjører rundt bommen","Drive around the barrier"]);
q("ut","Hvorfor er det farlig å bruke fjernlys i tåke?","Why is high beam dangerous in fog?",["Lyset reflekteres i tåka og gjør sikten dårligere","The light reflects off the fog and cuts visibility"],["Det tømmer batteriet","It drains the battery"],["Det er ikke farlig","It isn't dangerous"]);

/* ---------- Ulykker og førstehjelp ---------- */
q("ul","Du kommer først til en trafikkulykke. Hva gjør du først?","You're first at a road accident. What do you do first?",["Skaffer oversikt og sikrer stedet","Get an overview and secure the scene"],["Flytter alle skadde ut av bilene","Pull all injured people out"],["Tar bilder av skadene","Take photos of the damage"]);
q("ul","Hvilket nummer ringer du for ambulanse?","Which number do you call for an ambulance?",["113","113"],["112","112"],["110","110"],"113 ambulanse, 112 politi, 110 brann.","113 ambulance, 112 police, 110 fire.");
q("ul","Hvordan sikrer du et ulykkessted?","How do you secure an accident scene?",["Nødblink, refleksvest og varseltrekant i god avstand (om mulig minst 150 m)","Hazard lights, hi-vis vest and a warning triangle well back (if possible at least 150 m)"],["Ved å stå midt i vegen og vinke","By standing in the road and waving"],["Det er politiets jobb","That's the police's job"]);
q("ul","En skadet person er bevisstløs, men puster normalt. Hva gjør du?","An injured person is unconscious but breathing normally. What do you do?",["Legger personen i stabilt sideleie","Put them in the recovery position"],["Starter hjerte-lunge-redning","Start CPR"],["Gir personen vann","Give them water"]);
q("ul","En person puster ikke normalt. Hva er riktig HLR-rytme?","A person isn't breathing normally. What's the right CPR rhythm?",["30 kompresjoner og 2 innblåsninger","30 compressions and 2 breaths"],["15 kompresjoner og 5 innblåsninger","15 compressions and 5 breaths"],["5 kompresjoner og 1 innblåsning","5 compressions and 1 breath"]);
q("ul","En person blør kraftig fra armen. Hva gjør du?","Someone is bleeding heavily from the arm. What do you do?",["Trykker direkte på såret","Press directly on the wound"],["Venter på ambulansen","Wait for the ambulance"],["Gir personen noe å drikke","Give them a drink"]);
q("ul","Har du plikt til å stanse hvis du er innblandet i en ulykke?","Must you stop if you're involved in an accident?",["Ja, og hjelpe til","Yes, and help"],["Bare hvis du har skyld","Only if it's your fault"],["Bare hvis politiet kommer","Only if the police arrive"]);
q("ul","Når bør du flytte en skadd person?","When should you move an injured person?",["Bare når det er fare på stedet, f.eks. brann","Only when the scene is dangerous, e.g. fire"],["Alltid, så de ligger bedre","Always, so they're more comfortable"],["Aldri","Never"]);
q("ul","To biler har en mindre kollisjon uten personskader. Hva gjør dere?","Two cars have a minor collision with no injuries. What do you do?",["Fyller ut et felles skademeldingsskjema","Fill in a joint accident report together"],["Kjører videre uten å si noe","Drive on without a word"],["Venter på politiet uansett","Wait for the police no matter what"]);
q("ul","Hvorfor skal du holde en skadd person varm?","Why keep an injured person warm?",["For å motvirke sjokk og nedkjøling","To counter shock and hypothermia"],["For at de skal sovne","So they fall asleep"],["Det spiller ingen rolle","It doesn't matter"]);
q("ul","Du kjører på et rådyr. Hva gjelder?","You hit a deer. What applies?",["Du skal stanse, og du har meldeplikt","You must stop, and you must report it"],["Du kan kjøre videre hvis bilen er hel","You can drive on if the car is fine"],["Du må bare melde det hvis bilen er skadet","You only report it if the car is damaged"]);
q("ut","Hvilke ulykker er blant de vanligste og alvorligste for unge førere?","Which crashes are among the most common and serious for young drivers?",["Utforkjøringer og møteulykker","Run-off-road and head-on collisions"],["Ulykker på parkeringsplasser","Car-park bumps"],["Rygge-uhell","Reversing accidents"]);
q("ul","Når skal politiet varsles etter et trafikkuhell?","When must the police be told after a traffic accident?",["Når noen er drept eller skadet, og skaden ikke er ubetydelig","When someone is killed or injured, and the injury isn't trivial"],["Bare når en bil må taues","Only when a car must be towed"],["Aldri, det ordner forsikringen","Never, insurance handles it"],"Vegtrafikkloven § 12. De innblandede skal ikke forlate stedet uten at det er nødvendig eller politiet samtykker.","Road Traffic Act § 12. Those involved may not leave unless necessary or the police agree.");
q("ul","Du rygger inn i en parkert bil, og eieren er ikke der. Hva gjør du?","You reverse into a parked car and the owner isn't there. What do you do?",["Varsler eieren eller politiet snarest mulig","Tell the owner or the police as soon as possible"],["Kjører videre hvis skaden er liten","Drive on if the damage is small"],["Venter til neste dag","Wait until the next day"],"Vegtrafikkloven § 12.","Road Traffic Act § 12.");
q("ul","Hva skal de innblandede i et trafikkuhell oppgi til hverandre?","What must those involved in an accident give each other?",["Navn og adresse, og føreren også eierens navn og adresse og bilens kjennemerke","Name and address, and the driver also the owner's name and address and the registration number"],["Bare telefonnummer","Just phone numbers"],["Ingenting hvis ingen er skadet","Nothing if no one is hurt"]);
q("ul","Hva skjer hvis du ikke hjelper noen som ble skadet i et uhell du var med på å forårsake?","What happens if you don't help someone injured in an accident you helped cause?",["Du mister førerretten for alltid","You lose your licence for good"],["Du får en advarsel","You get a warning"],["Ingenting, hvis du ringte 113 senere","Nothing, if you called 113 later"],"Vegtrafikkloven § 33.","Road Traffic Act § 33.");
