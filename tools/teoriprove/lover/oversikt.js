/* ════════════════════════════════════════════════════════════════
   LOVER (the "Laws" tab): which law texts there are, what's in them,
   and the sections that matter most for the theory test.

   The texts themselves are in lover/<id>.js. They are copied word for word
   from lovdata.no by lover/hent-lover.py and only load when someone opens them.
   To refresh them after a law changes, run that script again (see its top comment).

   key: [§ exactly as written in the law file, chapter ids from data.js it belongs to,
         short note (nb), short note (en)]. The notes show up in the Laws tab and,
         per chapter, as "📜 I lovteksten" buttons under the notes in the Read tab.
═════════════════════════════════════════════════════════════════ */
const LAWS = [
  {id:"tr", nb:"Trafikkreglene", en:"The traffic rules", ref:"FOR-1986-03-21-747",
   x:["Forskrift om kjørende og gående trafikk. Hvordan du kjører: vikeplikt, plassering, forbikjøring, fart, lys, stans og parkering. Den viktigste for prøven.",
      "Regulation on driving and walking traffic. How you drive: right of way, positioning, overtaking, speed, lights, stopping and parking. The most important one for the test."],
   key:[
    ["§ 1",["vi","ps"],"Definisjoner: veg, vegkryss, kjørefelt, fortau, parkering, tettbygd strøk og mer.","Definitions: road, junction, lane, pavement, parking, built-up area and more."],
    ["§ 3",["vi","op"],"Hva som går foran: politiet før alt annet, lyssignal før vikepliktskilt, og lys, skilt og oppmerking før de vanlige trafikkreglene.","What wins: the police over everything else, traffic lights over give-way signs, and lights, signs and markings over the ordinary traffic rules."],
    ["§ 4",["pl","ut"],"Bruk kjørebanen. Motorveg bare for kjøretøy som kan kjøre minst 40 km/t.","Use the carriageway. Motorways only for vehicles that can do at least 40 km/h."],
    ["§ 5",["pl"],"Hold til høyre og bruk høyre felt. Kollektivfelt. Avstand til bilen foran. Kryss du ikke kommer ut av.","Keep right and use the right lane. Bus lanes. Gap to the car ahead. Junctions you can't get out of."],
    ["§ 6",["vi","pl"],"Svinging: riktig felt i god tid, møtende kan svinge til venstre for hverandre.","Turning: the right lane in good time; oncoming cars may turn left in front of each other."],
    ["§ 7",["vi"],"Vikeplikt: høyreregelen, gående og syklende når du svinger, fra parkeringsplass og eiendom, buss fra holdeplass (60 km/t eller lavere).","Giving way: the right-hand rule, pedestrians and cyclists when you turn, leaving car parks and property, buses leaving a stop (60 km/h or less)."],
    ["§ 8",["pl"],"Feltskifte: vikeplikt for dem i feltet. Glidelås når feltene blir færre.","Changing lanes: give way to those in the lane. Zip merge when lanes run out."],
    ["§ 9",["my"],"Gående: vikeplikt ved gangfelt uten lys og når du krysser fortau eller gangveg.","Pedestrians: give way at crossings without lights and when you cross a pavement or footpath."],
    ["§ 10",["vi","ut"],"Gi fri veg for blått lys, tog og sporvogn.","Make way for blue lights, trains and trams."],
    ["§ 11",["pl"],"Rygging og vending: du har vikeplikt. Forbudt på motorveg.","Reversing and U-turns: you give way. Banned on motorways."],
    ["§ 12",["pl"],"Forbikjøring: til venstre (med unntak), sjekk før du starter, ikke like foran eller i kryss og gangfelt.","Overtaking: on the left (with exceptions), check before you start, not just before or in junctions and crossings."],
    ["§ 13",["fy","my"],"Du må kunne stanse på strekningen du ser. Ekstra varsom ved barn, skolepatrulje, hvit stokk. Gangfart i gatetun. Høyst 80 km/t med tilhenger.","You must be able to stop within the distance you can see. Extra care near children, school patrols, white canes. Walking pace in home zones. Max 80 km/h with a trailer."],
    ["§ 14",["op"],"Gi tegn når du svinger eller flytter deg sideveis. Utrykningskjøretøy varsler med blått lys.","Signal when you turn or move sideways. Emergency vehicles warn with blue lights."],
    ["§ 15",["ut"],"Lys: nærlys, fjernlys eller kjørelys alltid på. Ikke blend andre. Tåkelys ikke sammen med nærlys.","Lights: dipped, main or daytime lights always on. Don't dazzle others. No fog lights together with dipped beam."],
    ["§ 16",["mi"],"Ikke unødig tomgang, støy eller forstyrrende kjøring der folk bor.","No needless idling, noise or disturbing driving where people live."],
    ["§ 17",["ps"],"Stans forbudt: uoversiktlig sted, 5 m fra kryss, gangfelt og planovergang, 20 m fra holdeplass-skilt. Parkering forbudt foran inn- og utkjørsel m.m.","No stopping: blind spots, 5 m from junctions, crossings and level crossings, 20 m from a bus stop sign. No parking in front of driveways etc."]
   ]},
  {id:"vtl", nb:"Vegtrafikkloven", en:"The Road Traffic Act", ref:"LOV-1965-06-18-4",
   x:["Selve loven som de andre reglene bygger på: grunnregelen, fartsgrenser, plikter ved uhell, rus, førerkort og øvingskjøring, straff og tap av førerett.",
      "The act the other rules are built on: the basic rule, speed limits, accident duties, alcohol and drugs, licences and practice driving, penalties and losing your licence."],
   key:[
    ["§ 3",["me"],"Grunnregelen: vær hensynsfull, aktpågivende og varsom.","The basic rule: be considerate, attentive and careful."],
    ["§ 5",["sk","op"],"Du skal rette deg etter skilt, signaler og oppmerking.","You must obey signs, signals and road markings."],
    ["§ 6",["fy"],"Tilpass farten. Uten skilt: 50 km/t i tettbygd strøk, 80 km/t utenfor.","Adapt your speed. Without signs: 50 km/h in built-up areas, 80 km/h outside."],
    ["§ 12",["ul"],"Ved uhell: stans, hjelp, oppgi navn og adresse, varsle politiet hvis noen er skadet.","At an accident: stop, help, give name and address, tell the police if someone is hurt."],
    ["§ 17",["fk"],"Vognkortet skal alltid følge med bilen.","The registration document must always be in the vehicle."],
    ["§ 21",["me"],"Ikke kjør når du er syk, sliten, trett eller ruset.","Don't drive when ill, worn out, tired or impaired."],
    ["§ 22",["me"],"Rus: grensen er 0,2 promille i blodet eller 0,1 mg per liter utåndingsluft.","Alcohol: the limit is 0.2 per mille in the blood or 0.1 mg per litre of breath."],
    ["§ 24",["fk"],"Ha alltid førerkortet med. 18 år for personbil.","Always carry your licence. 18 to drive a car."],
    ["§ 26",["fk"],"Øvingskjøring: tidligst 2 år før aldersgrensen. Ledsager minst 25 år med 5 års sammenhengende førerett.","Practice driving: at the earliest 2 years before the age limit. Supervisor at least 25 with 5 years' unbroken licence."],
    ["§ 31",["me"],"Straff for ruskjøring: bot opp til 0,5 promille, fengsel kan komme over 0,5, ubetinget fengsel over 1,2.","Penalties for impaired driving: a fine up to 0.5 per mille, prison possible above 0.5, actual prison above 1.2."],
    ["§ 33",["fk","me"],"Tap av førerett: minst 1 år ved straff for ruskjøring over 0,5 promille, og i prøvetiden også under.","Losing your licence: at least 1 year if punished for impaired driving above 0.5 per mille, and on probation also below that."]
   ]},
  {id:"skilt", nb:"Skiltforskriften", en:"The sign regulations", ref:"FOR-2005-10-07-1219",
   x:["Alle offentlige trafikkskilt med bilde og betydning, og reglene for vegoppmerking og lyssignaler.",
      "Every official traffic sign with its picture and meaning, plus the rules for road markings and traffic lights."],
   key:[
    ["§ 4",["sk"],"Fareskilt (100-skiltene): trekant med rød kant.","Warning signs (the 100s): triangle with a red border."],
    ["§ 6",["sk","vi"],"Vikeplikt- og forkjørsskilt (200-skiltene).","Give-way and priority signs (the 200s)."],
    ["§ 7",["sk"],"Forbudsskilt gjelder fra skiltet og fram til nærmeste kryss, om ikke annet er sagt.","Prohibition signs apply from the sign to the next junction, unless stated otherwise."],
    ["§ 8",["sk","ps"],"Forbudsskilt (300-skiltene), blant annet fartsgrense, stans og parkering forbudt.","Prohibition signs (the 300s), incl. speed limits, no stopping and no parking."],
    ["§ 10",["sk"],"Påbudsskilt (400-skiltene): blå runde skilt.","Mandatory signs (the 400s): round blue signs."],
    ["§ 12",["sk","ut"],"Opplysningsskilt (500-skiltene): motorveg, tettbygd strøk, gatetun, parkering m.m.","Information signs (the 500s): motorway, built-up area, home zone, parking etc."],
    ["§ 18",["sk"],"Underskilt (800-skiltene): gjelder sammen med skiltet over.","Supplementary plates (the 800s): apply with the sign above."],
    ["§ 22",["op"],"Vegoppmerking: linjer og symboler på vegen.","Road markings: lines and symbols on the road."],
    ["§ 24",["op"],"Trafikklyssignaler: hva rødt, gult og grønt betyr.","Traffic lights: what red, amber and green mean."],
    ["§ 25",["op"],"Politiets tegn: arm ut til siden, arm rett opp, rød lykt som svinges.","Police signals: arm out to the side, arm straight up, a red lamp swung back and forth."]
   ]},
  {id:"bruk", nb:"Bruksforskriften", en:"Vehicle use regulations", ref:"FOR-1990-01-25-92",
   x:["Forskrift om bruk av kjøretøy: utsyn, dekk og mønsterdybde, varseltrekant og refleksvest, passasjerer, last og tilhenger. Mye av den gjelder tunge kjøretøy.",
      "Regulation on the use of vehicles: visibility, tyres and tread depth, warning triangle and hi-vis vest, passengers, load and trailers. Much of it is about heavy vehicles."],
   key:[
    ["§ 1-3",["kj","ut"],"Utsyn: snø, is og dugg skal bort fra rutene.","Visibility: clear snow, ice and mist off the windows."],
    ["§ 1-4",["kj","ut"],"Dekk: godt nok veggrep for føret, mønsterdybde minst 1,6 mm sommer og 3 mm vinter, piggdekk-perioden.","Tyres: enough grip for the conditions, tread at least 1.6 mm in summer and 3 mm in winter, the studded-tyre season."],
    ["§ 1-6",["ul"],"Varseltrekant om mulig minst 150 m unna. Refleksvest skal være i bilen.","Warning triangle at least 150 m away if possible. A hi-vis vest must be in the car."],
    ["§ 1-7",["ps"],"Sikre bilen når du forlater den.","Secure the car when you leave it."],
    ["§ 3-1",["kj"],"Ikke flere personer enn bilen er registrert for.","No more people than the car is registered for."],
    ["§ 3-2",["kj"],"Last: plassert og sikret, uten å dekke lys eller kjennemerker.","Load: placed and secured, without covering lights or number plates."],
    ["§ 3-4",["kj"],"Last som stikker ut: grenser og merking.","Load that sticks out: limits and marking."]
   ]},
  {id:"fk", nb:"Førerkortforskriften", en:"Driving licence regulations", ref:"FOR-2004-01-19-298", part:true,
   x:["Utdrag (kapittel 3, 4 og 11): hva klasse B gir deg rett til, prøvetiden og tap av førerett.",
      "Extract (chapters 3, 4 and 11): what class B lets you drive, the probation period and losing your licence."],
   key:[
    ["§ 3-5",["fk","kj"],"Klasse B: bil til 3500 kg og 8 passasjerer, tilhenger til 750 kg, eller vogntog til 3500 kg (4250 kg med kode 96).","Class B: car up to 3500 kg and 8 passengers, trailer up to 750 kg, or combination up to 3500 kg (4250 kg with code 96)."],
    ["§ 4-2",["fk"],"Prøvetid 2 år. Mister du førerretten i prøvetiden, må du ta full førerprøve igjen.","2-year probation. Lose your licence during probation and you must retake the full test."]
   ]},
  {id:"op", nb:"Trafikkopplæringsforskriften", en:"Driver training regulations", ref:"FOR-2004-10-01-1339", part:true,
   x:["Utdrag (kapittel 2, 3, 8, 11 og 29): øvingskjøring, ledsager, trafikalt grunnkurs, opplæringen i klasse B og førerprøven.",
      "Extract (chapters 2, 3, 8, 11 and 29): practice driving, the supervisor, the basic course, class B training and the driving test."],
   key:[
    ["§ 2-1",["fk"],"Øvingskjøring tidligst 2 år før aldersgrensen, og først etter trafikalt grunnkurs.","Practice driving at the earliest 2 years before the age limit, and only after the basic course."],
    ["§ 3-1",["fk"],"Ledsager: fylt 25 år, førerett uavbrutt de siste 5 årene.","Supervisor: 25 or older, licence held unbroken for the last 5 years."],
    ["§ 3-2",["fk"],"Øvingsbilen: ekstra speil til ledsageren og skilt med rød L bak.","The practice car: an extra mirror for the supervisor and a red L sign at the back."],
    ["§ 8-1",["fk"],"Trafikalt grunnkurs.","The basic traffic course."],
    ["§ 11-1",["fk"],"Hovedmålet for opplæringen i klasse B, og trinnene etter den.","The main goal of class B training, and the stages that follow."],
    ["§ 29-5",["fk"],"Teoriprøven: kan tas 6 måneder før du fyller 18.","The theory test: can be taken 6 months before you turn 18."]
   ]},
  {id:"tap", nb:"Tapsforskriften", en:"Licence loss regulations", ref:"FOR-2003-12-19-1660",
   x:["Forskrift om tap av retten til å føre motorvogn: hvor lenge du mister førerretten for for høy fart, ruskjøring og andre brudd.",
      "Regulation on losing the right to drive: how long you lose your licence for speeding, impaired driving and other offences."],
   key:[
    ["§ 2-2",["fy"],"Tabellene: hvor lenge du mister førerretten for hver fartsgrense og fart.","The tables: how long you lose your licence for each speed limit and speed."],
    ["§ 6-1",["ul"],"Hjelper du ikke en skadet etter et uhell du var med på, mister du førerretten for alltid (som regel).","Fail to help someone hurt in an accident you were part of, and you lose your licence for good (as a rule)."],
    ["§ 8-4",["fk"],"Mister du førerretten i prøvetiden for brudd på trafikkreglene, må du ta full førerprøve igjen.","Lose your licence on probation for breaking traffic rules, and you must retake the full test."]
   ]},
  {id:"prikk", nb:"Prikkforskriften", en:"Penalty points regulations", ref:"FOR-2003-09-19-1164",
   x:["Forskrift om prikkbelastning: hvilke brudd som gir prikker, hvor mange, og når du mister førerretten.",
      "Regulation on penalty points: which offences give points, how many, and when you lose your licence."],
   key:[
    ["§ 2",["fk","fy","vi"],"Hva som gir prikker: for høy fart, kjøring på rødt, ulovlig forbikjøring, brudd på vikeplikt, for kort avstand, manglende sikring av barn m.m.","What gives points: speeding, running a red, illegal overtaking, failing to give way, tailgating, not securing children and more."],
    ["§ 3",["fk"],"Som regel 3 prikker per brudd (2 for de minste fartsbruddene). Dobbelt i prøvetiden.","Usually 3 points per offence (2 for the smallest speeding offences). Double on probation."],
    ["§ 4",["fk"],"8 prikker i løpet av 3 år: du mister førerretten i 6 måneder.","8 points within 3 years: you lose your licence for 6 months."]
   ]}
];
