/* ════════════════════════════════════════════════════════════════
   NORSKPRØVEN B1–B2: reading texts, listening clips, writing tasks and speaking tasks.

   All texts were written for this tool, modelled on the task TYPES HK-dir describes
   for the B1–B2 test (prove.hkdir.no, checked October 2026). People, places and
   numbers in them are made up.

   Questions: q: the question, o: the options. The FIRST option is always the right one
   (the app shuffles them). x: optional explanation shown after answering.
═════════════════════════════════════════════════════════════════ */

/* ---------- LESE: reading texts ----------
   p: paragraphs (may contain <b>…</b>). "[ ? ]" marks a gap.
   ord: hard words shown after you've answered: [norsk, English]. */
const READ = [
{id:"fire",lvl:"B2",type:"Avisartikkel",title:"Fire dager i uka – suksess eller hodepine?",
 p:["I fjor høst startet Sandvik kommune et forsøk med firedagersuke for de ansatte i hjemmetjenesten. De ansatte jobber like mange timer som før, men fordelt på fire lengre dager. Målet var å gjøre det lettere å rekruttere sykepleiere, som det har vært stor mangel på i flere år.",
    "Etter ett år er resultatene blandet. Sykefraværet har gått ned fra 11 til 8 prosent, og flere ansatte sier at de trives bedre. «Jeg har fått mye mer tid med barna mine», forteller sykepleier Amira Haddad. Samtidig melder flere eldre brukere at de savner å se de samme ansiktene hver dag.",
    "Ifølge enhetsleder Tor Eggen har det også vært utfordrende å få turnusen til å gå opp. «Lange vakter krever god planlegging. Vi har måttet leie inn vikarer i helgene, og det koster penger», sier han.",
    "Kommunestyret skal i desember bestemme om forsøket skal bli permanent. Fagforeningen ønsker at ordningen fortsetter, mens flere politikere vil vente på en ekstern evaluering før de tar stilling."],
 qs:[
  {q:"Hvorfor startet kommunen forsøket?",o:["Fordi det er vanskelig å få tak i sykepleiere","For å spare penger på lønn","Fordi de ansatte ville jobbe færre timer","Fordi brukerne ønsket det"]},
  {q:"Hva sier teksten om arbeidstiden?",o:["De ansatte jobber like mange timer som før","De ansatte jobber færre timer enn før","De ansatte jobber bare i helgene"]},
  {q:"Hva er et problem med ordningen, ifølge enhetslederen?",o:["Det har blitt dyrere å få folk til helgevaktene","Sykefraværet har økt","De ansatte trives dårligere"]},
  {q:"Hva mener politikerne?",o:["Noen vil vente på en evaluering før de bestemmer seg","Alle vil gjøre ordningen permanent","De vil stoppe forsøket med en gang"]},
  {q:"Hvilket ord i teksten betyr omtrent det samme som «vanskelig»?",o:["utfordrende","permanent","blandet","ekstern"]}],
 ord:[["et forsøk","a trial"],["hjemmetjenesten","home care service"],["å rekruttere","to recruit"],["mangel på","shortage of"],["sykefravær","sick leave (absence)"],["å savne","to miss"],["en vikar","a temp, substitute"],["å ta stilling","to make up one's mind"]]},

{id:"dugnad",lvl:"B1",type:"Oppslag",title:"Vårdugnad i Solbakken borettslag",
 p:["Hei, alle beboere! Lørdag 26. april klokka 10–14 er det vårdugnad i Solbakken borettslag. Vi skal rake plenene, feie asfalten etter vinteren og male benkene på lekeplassen. Styret sørger for verktøy, maling og hansker. Etter dugnaden griller vi pølser i bakgården – også vegetarpølser!",
    "Alle husstander bør stille med minst én person. Hvis du ikke kan komme, kan du heller ta en oppgave en annen dag. Gi i så fall beskjed til Linda i styret innen 20. april, så finner vi noe som passer.",
    "Husk: Containeren for grovavfall står i bakgården fra fredag kveld til søndag morgen. Den er bare for møbler og andre store ting – ikke for farlig avfall som maling og batterier.",
    "Hilsen styret"],
 qs:[
  {q:"Hva skal beboerne gjøre på dugnaden?",o:["Gjøre uteområdet fint etter vinteren","Pusse opp trappeoppgangene","Bygge en ny lekeplass"]},
  {q:"Hva må beboerne ta med selv?",o:["Ingenting, styret skaffer utstyret","Egen maling","Hansker og verktøy"]},
  {q:"Hva skal du gjøre hvis du ikke kan komme på lørdag?",o:["Kontakte Linda før 20. april","Betale en avgift til styret","Komme søndag morgen i stedet"]},
  {q:"Hva kan du IKKE kaste i containeren?",o:["Gamle malingsbokser","En gammel sofa","En ødelagt bokhylle"]}],
 ord:[["en beboer","a resident"],["å rake","to rake"],["å feie","to sweep"],["styret","the board"],["å sørge for","to provide, make sure of"],["en husstand","a household"],["å stille med","to turn up with, provide"],["grovavfall","bulky waste"]]},

{id:"buss",lvl:"B1",type:"Leserinnlegg",title:"Gi oss lørdagsbussen tilbake!",
 p:["Fra 1. januar kjører buss 34 ikke lenger på lørdager. Kollektivselskapet sier at det er for få passasjerer, og at pengene trengs andre steder. Jeg forstår at de må spare, men denne beslutningen rammer dem som allerede har minst.",
    "Jeg bor på Haugland og har ikke bil. Det har heller ikke mange av naboene mine, som er pensjonister. Lørdag var dagen vi tok bussen til sentrum for å handle, gå på biblioteket eller besøke familie. Nå må vi bestille drosje, som koster nesten 400 kroner hver vei, eller bli sittende hjemme.",
    "Selskapet hevder at bussen var nesten tom. Det stemmer ikke med min erfaring. Om formiddagen var det ofte vanskelig å få sitteplass. Kanskje ble passasjerene talt på feil tidspunkt?",
    "Jeg foreslår at selskapet prøver en mindre buss med færre avganger, for eksempel tre turer i løpet av dagen. Det ville vært billigere, og vi ville fortsatt vært en del av byen.",
    "<b>Ragnhild Moe, Haugland</b>"],
 qs:[
  {q:"Hva er hovedpoenget til Ragnhild Moe?",o:["Hun vil at bussen skal gå på lørdager igjen","Hun vil at drosjer skal bli billigere","Hun vil at biblioteket skal ha lengre åpningstid","Hun vil flytte til sentrum"]},
  {q:"Hvorfor er endringen spesielt vanskelig for folk på Haugland?",o:["Mange av dem har ikke bil","De jobber i sentrum på lørdager","Det er ingen butikker i sentrum"]},
  {q:"Hva mener hun om selskapets påstand om passasjertallet?",o:["Hun tror ikke at den stemmer","Hun er helt enig","Hun mener den ikke er viktig"]},
  {q:"Hva foreslår hun?",o:["Færre turer med en mindre buss","At pensjonister får gratis drosje","At bussen kjører hver time også på søndager"]},
  {q:"Hvilket ord i teksten betyr omtrent det samme som «påstår»?",o:["hevder","rammer","foreslår","trengs"]}],
 ord:[["en beslutning","a decision"],["å ramme","to hit, affect"],["en drosje","a taxi"],["å hevde","to claim"],["en erfaring","an experience"],["en avgang","a departure"]]},

{id:"forste",lvl:"B1",type:"Personlig tekst · flytt avsnitt",title:"Mitt første år i Norge",
 p:["Da jeg kom til Norge for to år siden, kunne jeg nesten ikke norsk. Jeg hadde jobbet som ingeniør i hjemlandet mitt, men her fikk jeg ikke godkjent utdanningen min med en gang.",
    "[ ? ]",
    "Etter et halvt år fikk jeg tilbud om praksisplass i et byggefirma. Der lærte jeg mer norsk på tre måneder enn på et helt år på skolen. Kollegaene mine snakket dialekt, så i begynnelsen forsto jeg nesten ingenting i lunsjen.",
    "I dag har jeg fast jobb i det samme firmaet. Jeg snakker fortsatt ikke perfekt, men jeg tør å si fra når jeg ikke forstår. Det er kanskje det viktigste jeg har lært."],
 qs:[
  {q:"Hvilket avsnitt passer best der det står [ ? ]?",o:["Derfor begynte jeg på norskkurs fem dager i uka. Om ettermiddagene jobbet jeg som renholder på et kontorbygg. Det var slitsomt, men jeg fikk i hvert fall litt penger og litt kontakt med nordmenn.","Firmaet har nå over hundre ansatte og bygger både skoler og sykehus over hele landet.","Til slutt bestemte jeg meg for å flytte tilbake til hjemlandet mitt, der familien min fortsatt bor."],x:"Avsnittet må forklare hva som skjedde mellom ankomsten og praksisplassen. «Derfor» peker tilbake på at utdanningen ikke ble godkjent."},
  {q:"Hvor lærte forfatteren mest norsk?",o:["På praksisplassen","På norskkurset","Hjemme"]},
  {q:"Hva var vanskelig i lunsjen?",o:["Å forstå dialekten til kollegaene","Å finne et sted å sitte","Å spise norsk mat"]},
  {q:"Hva er det viktigste forfatteren har lært?",o:["Å tørre å si fra når noe er uklart","Å snakke perfekt norsk","Å snakke dialekt"]}],
 ord:[["godkjent","approved, recognised"],["en praksisplass","a work placement"],["en renholder","a cleaner"],["slitsom","tiring"],["å tørre","to dare"],["å si fra","to speak up, let someone know"]]},

{id:"luke",lvl:"B1",type:"E-post · lukeoppgave",title:"Beskjed fra norskkurset",
 p:["Hei alle sammen!",
    "Neste uke blir det noen endringer i timeplanen. Tirsdag er klasserommet opptatt, <b>(1)</b> vi har undervisning på biblioteket i stedet. Onsdag er læreren deres på kurs, og <b>(2)</b> blir det ingen undervisning den dagen. Bruk gjerne tiden på å <b>(3)</b> til prøven i mai.",
    "Husk at påmeldingen stenger fredag. Hvis dere lurer på <b>(4)</b> dere bør ta prøven på A2–B1 eller B1–B2, kan dere snakke med meg etter timen på torsdag.",
    "Vennlig hilsen Marit"],
 qs:[
  {q:"Hvilket ord passer i luke (1)?",o:["så","fordi","selv om"],x:"«så» viser følgen: rommet er opptatt, så vi er på biblioteket."},
  {q:"Hvilket ord passer i luke (2)?",o:["derfor","fordi","men"],x:"«derfor» + inversjon: «derfor blir det»."},
  {q:"Hvilket ord passer i luke (3)?",o:["øve","øver","øvd"],x:"Etter «å» kommer infinitiv."},
  {q:"Hvilket ord passer i luke (4)?",o:["om","hvis","at"],x:"Indirekte ja/nei-spørsmål: «om»."},
  {q:"Hvor skal klassen være på tirsdag?",o:["På biblioteket","I klasserommet","Hjemme"]}],
 ord:[["en endring","a change"],["en timeplan","a timetable"],["opptatt","busy, occupied"],["undervisning","teaching, lessons"],["påmeldingen","registration"],["å lure på","to wonder"]]},

{id:"hytta",lvl:"B2",type:"Reportasje",title:"Hytta – mer enn et hus",
 p:["Mange nordmenn har tilgang til en hytte, enten de eier den selv eller låner den av familien. For mange er hytta et symbol på et enkelt liv nær naturen: vedfyring, utedo og vann som må bæres fra bekken.",
    "Men hyttelivet har endret seg. De siste tiårene har nye hytter blitt stadig større, og mange har både innlagt vann, oppvaskmaskin og raskt internett. Noen hytteområder ligner mer på små boligfelt enn på den tradisjonelle hytta i skogen.",
    "Utviklingen skaper debatt. Naturvernere advarer mot at utbyggingen ødelegger viktige leveområder for dyr, og at myrer som lagrer karbon, blir bygd ned. Tilhengerne peker på at hyttene gir arbeidsplasser og inntekter til små kommuner som ellers sliter med fraflytting.",
    "Forskere mener at hyttas betydning ikke først og fremst handler om standard. «Det viktigste er følelsen av å komme bort fra hverdagen», sier en kulturforsker. «Den følelsen kan man få både i en luksushytte og i en enkel bu uten strøm.»"],
 qs:[
  {q:"Hva handler andre avsnitt om?",o:["At hyttene har blitt mer moderne","At færre har hytte enn før","At hytter er billige å kjøpe"]},
  {q:"Hva er naturverneres bekymring?",o:["At naturen og dyrenes leveområder blir ødelagt","At hyttene blir for dyre","At det blir for dårlig internett"]},
  {q:"Hvilket argument har de som er for utbyggingen?",o:["Det gir jobber og penger til små kommuner","Det gjør hyttene billigere","Det stopper klimaendringene"]},
  {q:"Hva mener kulturforskeren?",o:["At følelsen av å komme bort er viktigere enn standarden","At luksushytter er bedre enn enkle hytter","At hytter uten strøm bør forbys"]},
  {q:"Hvilket ord i teksten betyr «de som er for noe»?",o:["tilhengerne","naturvernere","forskere"]}],
 ord:[["tilgang til","access to"],["vedfyring","wood heating"],["utedo","outside toilet"],["en bekk","a stream"],["innlagt vann","running water"],["å advare","to warn"],["et leveområde","a habitat"],["en myr","a bog"],["en tilhenger","a supporter"],["fraflytting","people moving away"]]},

{id:"frivillig",lvl:"B2",type:"Hvem handler det om?",title:"Fire om frivillig arbeid",
 p:["<b>Jonas:</b> Jeg begynte som trener for jentelaget i fotball da datteren min startet der. Nå har hun sluttet, men jeg fortsetter. Jeg hadde aldri trodd at jeg skulle like å stå på en kald bane tre kvelder i uka.",
    "<b>Fatima:</b> Hver torsdag hjelper jeg til med leksehjelp på biblioteket. Mange av elevene har foreldre som ikke kan hjelpe dem med norsken. Jeg husker selv hvor vanskelig det var.",
    "<b>Kjell:</b> Etter at jeg ble pensjonist, kjente jeg at dagene ble lange. En venn tipset meg om besøkstjenesten i Røde Kors. Nå går jeg tur med en eldre mann hver uke. Egentlig tror jeg det betyr like mye for meg som for ham.",
    "<b>Sunniva:</b> Jeg synes det er flott at folk engasjerer seg, men jeg har ærlig talt ikke tid. Med to små barn og full jobb får det holde å stille på dugnad i barnehagen to ganger i året."],
 qs:[
  {q:"Hvem fortsetter selv om grunnen til at de begynte, ikke lenger finnes?",o:["Jonas","Fatima","Kjell","Sunniva"]},
  {q:"Hvem bruker sine egne erfaringer i det frivillige arbeidet?",o:["Fatima","Jonas","Kjell","Sunniva"]},
  {q:"Hvem gjør bare det som er forventet?",o:["Sunniva","Jonas","Fatima","Kjell"]},
  {q:"Hvem sier at det frivillige arbeidet også hjelper dem selv?",o:["Kjell","Jonas","Fatima","Sunniva"]}],
 ord:[["et lag","a team"],["en bane","a pitch, field"],["leksehjelp","homework help"],["å tipse","to tip off"],["en besøkstjeneste","a visiting service"],["å engasjere seg","to get involved"],["ærlig talt","honestly"]]},

{id:"lege",lvl:"B1",type:"Informasjon",title:"Nytt fra Storgata legekontor",
 p:["Fra 1. september må alle timer bestilles på Helsenorge eller på telefon mellom klokka 08.00 og 11.00. Vi tar ikke lenger imot bestillinger på e-post.",
    "Hvis du ikke kan komme til timen din, må du avbestille senest 24 timer før. Timer som ikke blir avbestilt, må betales, også om du har frikort. Gebyret er det samme som en vanlig egenandel.",
    "Trenger du ny resept på medisiner du bruker fast, kan du sende en melding på Helsenorge. Det tar opptil tre virkedager før resepten er klar.",
    "Ved akutt sykdom utenom åpningstiden: ring legevakten på 116 117. Ved livstruende situasjoner: ring 113."],
 qs:[
  {q:"Hvordan kan du IKKE bestille time lenger?",o:["På e-post","På Helsenorge","På telefon om morgenen"]},
  {q:"Du har time på fredag klokka 10. Når må du senest avbestille?",o:["Torsdag klokka 10","Fredag klokka 8","Onsdag klokka 10"]},
  {q:"Hva skjer hvis du ikke møter opp og ikke har avbestilt?",o:["Du må betale, selv om du har frikort","Du mister fastlegen din","Ingenting, hvis du har frikort"]},
  {q:"Du trenger ny resept på en medisin du bruker hver dag. Hva gjør du?",o:["Sender en melding på Helsenorge","Ringer 116 117","Ringer 113"]}],
 ord:[["å avbestille","to cancel"],["senest","at the latest"],["et gebyr","a fee"],["en egenandel","a patient fee"],["fast","regularly, permanently"],["en virkedag","a working day"],["livstruende","life-threatening"]]},

{id:"lekser",lvl:"B2",type:"Debattinnlegg",title:"Fjern leksene i barneskolen",
 p:["Hver kveld utspiller det samme dramaet seg i tusenvis av norske hjem: Et slitent barn, en sliten forelder og et lekseark ingen av dem har lyst til å se på. Jeg mener det er på tide å fjerne leksene i barneskolen.",
    "For det første er det lite som tyder på at lekser gjør yngre barn flinkere. Det de trenger etter en lang skoledag, er lek, bevegelse og søvn. For det andre forsterker leksene forskjellene mellom elevene. Barn som har foreldre med god tid og gode norskkunnskaper, får hjelp. De andre blir sittende alene.",
    "Noen vil hevde at lekser lærer barna å ta ansvar. Det er et poeng, men ansvar kan også læres på skolen, for eksempel gjennom faste arbeidsøkter der læreren er til stede.",
    "Skolen bør være stedet der læringen skjer. Hjemmet bør være stedet der familien får være familie.",
    "<b>Henrik Aas, lærer og småbarnsfar</b>"],
 qs:[
  {q:"Hva er hovedsynspunktet i teksten?",o:["Barneskoleelever bør ikke få lekser","Lekser bør bli vanskeligere","Foreldre bør hjelpe mer med leksene","Skoledagen bør bli kortere"]},
  {q:"Hvorfor mener forfatteren at lekser skaper urettferdighet?",o:["Ikke alle barn får hjelp hjemme","Noen lærere gir mer lekser enn andre","Lekser tar tid fra fritidsaktiviteter"]},
  {q:"Hvordan svarer forfatteren på motargumentet om ansvar?",o:["Ansvar kan læres på skolen","Barn trenger ikke å lære ansvar","Foreldre må lære barna ansvar"]},
  {q:"Hvilket uttrykk i teksten betyr omtrent «gjør større»?",o:["forsterker","tyder på","utspiller seg"]}],
 ord:[["å utspille seg","to take place, play out"],["et lekseark","a homework sheet"],["å tyde på","to suggest, indicate"],["å forsterke","to strengthen, increase"],["en arbeidsøkt","a work session"],["til stede","present"]]}
];

/* ---------- LYTTE: listening clips ----------
   lines: [speaker, text]. Speakers: k = a woman, m = a man, n = announcer.
   lvl B1 = you may play it twice, B2 = once (like the real test). Then the text is shown. */
const LISTEN = [
{id:"legebeskjed",lvl:"B1",type:"Telefonbeskjed",title:"Beskjed fra legekontoret",
 lines:[["k","Hei, dette er Ingrid fra Storgata legekontor. Jeg ringer angående timen din hos doktor Lie på torsdag. Dessverre er legen syk den dagen, så vi må flytte timen. Vi kan tilby deg mandag neste uke klokka kvart over ni, eller tirsdag klokka to. Ring oss tilbake så snart som mulig, så vi får avtalt et nytt tidspunkt. Ha en fin dag!"]],
 qs:[{q:"Hvorfor ringer Ingrid?",o:["Timen må flyttes fordi legen er syk","For å minne deg på timen på torsdag","Fordi du ikke møtte opp til timen"]},
     {q:"Hvilke tider kan du velge mellom?",o:["Mandag 09.15 eller tirsdag 14.00","Mandag 09.45 eller tirsdag 12.00","Torsdag 09.15 eller fredag 14.00"]}]},
{id:"vakt",lvl:"B1",type:"Samtale på jobben",title:"Bytte vakt",
 lines:[["k","Hei, Ali. Har du et øyeblikk?"],["m","Ja da, hva gjelder det?"],["k","Jeg lurte på om du kunne ta vakten min på lørdag. Søsteren min skal gifte seg, og jeg fikk ikke vite datoen før i går."],["m","Lørdag, ja … Jeg har egentlig lovet å hjelpe en kompis med å flytte. Men hvis du tar søndagsvakten min neste helg, kan jeg flytte det."],["k","Det passer perfekt. Tusen takk! Jeg sier fra til sjefen med en gang."]],
 qs:[{q:"Hvorfor vil kvinnen bytte vakt?",o:["Hun skal i bryllup","Hun skal flytte","Hun er syk"]},
     {q:"Hva blir de enige om?",o:["Kvinnen jobber for mannen neste søndag","Mannen jobber begge helgene","De spør sjefen om fri"]}]},
{id:"tog",lvl:"B1",type:"Høyttalermelding",title:"På togstasjonen",
 lines:[["n","Informasjon til reisende med regiontoget til Bergen, avgang klokka 16.05. På grunn av en signalfeil er toget innstilt mellom Voss og Bergen. Det er satt opp buss for tog fra Voss stasjon. Bussene går fra parkeringsplassen foran stasjonsbygningen. Regn med at reisen tar omtrent én time lenger enn planlagt. Vi beklager."]],
 qs:[{q:"Hva er problemet?",o:["Toget kjører ikke hele veien til Bergen","Toget er fullt","Toget går fra et annet spor"]},
     {q:"Hva må de reisende gjøre?",o:["Ta buss fra Voss","Vente på neste tog","Kjøpe ny billett"]}]},
{id:"nabo",lvl:"B1",type:"Samtale mellom naboer",title:"Dugnaden",
 lines:[["m","Hei, Hilde! Så du lappen om dugnaden på lørdag?"],["k","Ja, men jeg rekker det nok ikke. Vi skal på hytta hele helgen."],["m","Å, synd. Det blir mye å gjøre, med hekken og alt."],["k","Jeg vet. Kanskje jeg kan klippe hekken på min side på torsdag i stedet? Da har jeg fri fra jobben."],["m","Det blir nok styret glad for. Du kan låne hekksaksen min, hvis du vil."],["k","Så snilt! Jeg stikker innom og henter den onsdag kveld."]],
 qs:[{q:"Hvorfor kan ikke Hilde komme på dugnaden?",o:["Hun skal bort i helgen","Hun skal jobbe","Hun er syk"]},
     {q:"Hva skal Hilde gjøre på onsdag?",o:["Hente en hekksaks hos naboen","Klippe hekken","Snakke med styret"]}]},
{id:"jakke",lvl:"B1",type:"I butikken",title:"Jakka",
 lines:[["m","Hei, jeg kjøpte denne jakka her for to uker siden, men glidelåsen er allerede ødelagt."],["k","Så kjedelig. Har du med kvitteringen?"],["m","Nei, dessverre. Men jeg betalte med kort, hvis det hjelper."],["k","Det går fint, da kan jeg finne kjøpet i systemet. Vil du ha en ny jakke eller pengene tilbake?"],["m","Hvis dere har den samme i medium, tar jeg heller en ny."],["k","Jeg skal sjekke på lageret. Et lite øyeblikk."]],
 qs:[{q:"Hva er problemet med jakka?",o:["Glidelåsen er ødelagt","Den er for liten","Den har feil farge"]},
     {q:"Hva vil kunden helst?",o:["Bytte til en ny jakke","Få pengene tilbake","Få rabatt"]}]},
{id:"barnehage",lvl:"B1",type:"Beskjed",title:"Tur med barnehagen",
 lines:[["k","Hei til alle foreldre på avdeling Blåbær. På fredag skal vi på tur til skogen ved Kvernsjøen. Vi går fra barnehagen klokka ni, så barna må være her senest kvart på ni. Husk gode sko, regntøy og ekstra votter, for det er meldt kaldt. Barnehagen tar med varm saft, men barna trenger egen matpakke. Vi er tilbake rundt klokka to."]],
 qs:[{q:"Når må barna være i barnehagen på fredag?",o:["Senest 08.45","Senest 09.00","Senest 09.15"]},
     {q:"Hva må foreldrene sende med?",o:["Matpakke og ekstra votter","Varm saft","Sovepose"]}]},
{id:"flytt1",lvl:"B1",type:"Tema-serie (1 av 4)",title:"Hvorfor flyttet de? Person 1",series:"flytt",
 lines:[["k","Vi bodde i en liten treroms i Oslo, og husleia spiste opp nesten halve lønna. Her ute får vi et helt hus for den samme prisen."]],
 qs:[{q:"Hvorfor valgte personen å flytte?",o:["Billigere bolig","Jobb","Familie","Natur og friluftsliv"]}]},
{id:"flytt2",lvl:"B1",type:"Tema-serie (2 av 4)",title:"Hvorfor flyttet de? Person 2",series:"flytt",
 lines:[["m","Jeg fikk tilbud om fast stilling på verkstedet her, og det kunne jeg ikke si nei til. Kona mi fant heldigvis også jobb ganske fort."]],
 qs:[{q:"Hvorfor valgte personen å flytte?",o:["Jobb","Billigere bolig","Familie","Natur og friluftsliv"]}]},
{id:"flytt3",lvl:"B1",type:"Tema-serie (3 av 4)",title:"Hvorfor flyttet de? Person 3",series:"flytt",
 lines:[["k","Mamma begynte å bli dårlig, og jeg ville være nær henne. Nå bor jeg bare fem minutter unna og kan stikke innom hver dag."]],
 qs:[{q:"Hvorfor valgte personen å flytte?",o:["Familie","Jobb","Billigere bolig","Natur og friluftsliv"]}]},
{id:"flytt4",lvl:"B1",type:"Tema-serie (4 av 4)",title:"Hvorfor flyttet de? Person 4",series:"flytt",
 lines:[["m","Jeg har alltid vært glad i å gå på ski og fiske. Nå har jeg fjellet rett utenfor døra, og jeg kan gå en tur før jobb."]],
 qs:[{q:"Hvorfor valgte personen å flytte?",o:["Natur og friluftsliv","Jobb","Familie","Billigere bolig"]}]},
{id:"sovn",lvl:"B2",type:"Radiointervju",title:"Sover vi for lite?",
 lines:[["m","Mange av oss sover for lite. Hvor stort er egentlig problemet?"],["k","Det er vanskelig å gi et presist tall, men undersøkelser tyder på at mange voksne sover mindre enn anbefalt. Det som bekymrer meg mest, er ungdommene. De legger seg stadig senere, mens skolen begynner like tidlig som før."],["m","Er det mobilens skyld?"],["k","Den er en del av forklaringen, men ikke hele. Ungdom har en naturlig døgnrytme som er forskjøvet. De blir rett og slett ikke trøtte før sent på kvelden. Derfor mener jeg at vi bør diskutere om skoledagen kunne startet litt senere, i stedet for bare å skylde på skjermene."]],
 qs:[{q:"Hva er forskeren mest bekymret for?",o:["At unge sover for lite","At voksne sover for mye","At mobiler er farlige"]},
     {q:"Hva mener forskeren om mobilbruk?",o:["Den forklarer bare en del av problemet","Den er den eneste årsaken","Den har ingenting med søvn å gjøre"]},
     {q:"Hva foreslår forskeren?",o:["Å vurdere senere skolestart","Å forby mobil på skolen","At voksne bør sove mer"]}]},
{id:"bilfritt",lvl:"B2",type:"Debatt",title:"Bilfritt sentrum",
 lines:[["k","Når vi stenger sentrum for biler, blir lufta renere og gatene tryggere for barn. Erfaringer fra andre byer viser at folk faktisk bruker sentrum mer når det er hyggelig å gå der."],["m","Det er lett å si for dem som bor i sentrum. Kundene mine kommer fra hele regionen, og mange av dem har ikke noe godt busstilbud. Siden parkeringsplassene forsvant, har omsetningen min gått ned med nesten tjue prosent."],["k","Jeg forstår at overgangen er tøff. Derfor har vi foreslått gratis innfartsparkering og flere bussavganger."],["m","Forslag hjelper ikke meg. Tiltakene må komme på plass før, ikke etter at butikkene har lagt ned."]],
 qs:[{q:"Hva er kvinnens viktigste argument?",o:["Sentrum blir et bedre sted å være","Butikkene tjener mer","Bussene blir billigere"]},
     {q:"Hvorfor er mannen negativ?",o:["Han har mistet kunder","Han bor langt fra sentrum","Han liker ikke å gå"]},
     {q:"Hva mener mannen om forslagene?",o:["De kommer for sent","De er for dyre","De er en god løsning"]}]},
{id:"intervju",lvl:"B2",type:"Jobbintervju",title:"Fra tall til mennesker",
 lines:[["m","Du har jobbet som regnskapsfører i mange år. Hvorfor vil du bytte til en stilling i kundeservice?"],["k","Jeg har trivdes med tall, men jeg har savnet å jobbe med mennesker. I den forrige jobben min var det jeg som tok imot spørsmål fra kunder om fakturaer, og det var faktisk den delen av jobben jeg likte best."],["m","Hvordan håndterer du en kunde som er sint?"],["k","Jeg prøver først å lytte uten å avbryte. Ofte blir folk roligere når de føler seg hørt. Så sier jeg tydelig hva jeg kan gjøre, og når de kan regne med å få svar."]],
 qs:[{q:"Hvorfor søker kvinnen denne jobben?",o:["Hun vil jobbe mer med mennesker","Hun vil tjene mer","Hun liker ikke tall"]},
     {q:"Hva gjør hun først med en sint kunde?",o:["Hun lytter","Hun forklarer reglene","Hun henter sjefen"]}]},
{id:"dialekt",lvl:"B2",type:"Podkast",title:"Dialektsjokket",
 lines:[["k","Mange som lærer norsk, blir frustrerte når de går fra kurset og ut i virkeligheten. Plutselig snakker ingen som i læreboka."],["m","Ja, jeg flyttet til Stavanger etter å ha gått på kurs i Oslo, og den første uka trodde jeg at kollegaene mine snakket et annet språk."],["k","Hva gjorde du?"],["m","Jeg begynte å skrive ned ord jeg hørte ofte, og spurte hva de betydde. Folk syntes det var morsomt, og det ble en fin måte å bli kjent på. Nå sier jeg selv «eg» i stedet for «jeg» når jeg er sliten."],["k","Så dialekten ble en vei inn i arbeidsmiljøet?"],["m","Absolutt. Jeg vil ikke anbefale å lære dialekt fra en bok. Vær heller nysgjerrig."]],
 qs:[{q:"Hva var problemet for mannen da han flyttet?",o:["Han forsto ikke dialekten","Han fant ikke jobb","Han savnet Oslo"]},
     {q:"Hva er mannens råd?",o:["Vær nysgjerrig og spør","Lær dialekt fra en bok","Snakk bare bokmål"]}]},
{id:"uke1",lvl:"B2",type:"Hva uttrykker personen? (1 av 4)",title:"Firedagersuke – person 1",series:"uke",
 lines:[["m","Fire dager? Det høres for godt ut til å være sant. Jeg tror ikke vi klarer å gjøre den samme jobben på kortere tid, uansett hva forskerne sier."]],
 qs:[{q:"Hva uttrykker personen?",o:["Skepsis","Begeistring","Bekymring","Likegyldighet"]}]},
{id:"uke2",lvl:"B2",type:"Hva uttrykker personen? (2 av 4)",title:"Firedagersuke – person 2",series:"uke",
 lines:[["k","Endelig! Jeg har ventet på dette i årevis. Tenk å få en ekstra dag med barna hver eneste uke!"]],
 qs:[{q:"Hva uttrykker personen?",o:["Begeistring","Skepsis","Bekymring","Likegyldighet"]}]},
{id:"uke3",lvl:"B2",type:"Hva uttrykker personen? (3 av 4)",title:"Firedagersuke – person 3",series:"uke",
 lines:[["m","For meg spiller det egentlig ingen rolle. Jeg jobber turnus uansett, så jeg merker nok ikke så mye."]],
 qs:[{q:"Hva uttrykker personen?",o:["Likegyldighet","Begeistring","Skepsis","Bekymring"]}]},
{id:"uke4",lvl:"B2",type:"Hva uttrykker personen? (4 av 4)",title:"Firedagersuke – person 4",series:"uke",
 lines:[["k","Jeg er redd for at de lange dagene blir for slitsomme, spesielt for de eldre arbeidstakerne. Hva skjer med helsa vår på sikt?"]],
 qs:[{q:"Hva uttrykker personen?",o:["Bekymring","Begeistring","Skepsis","Likegyldighet"]}]}
];

/* ---------- SKRIVE: writing tasks (B1–B2 test: task 1 email + task 2 argument, 2 hours) ----------
   EMAIL: a situation to complain about. ARG: a question to argue about. */
const EMAIL = [
  {id:"e-trening",t:"Treningssenteret",to:"daglig leder på treningssenteret",s:"Treningssenteret ditt har bestemt at det ikke lenger skal være gruppetimer om morgenen. Du har trent på morgentimene i to år."},
  {id:"e-husleie",t:"Husleia",to:"utleieren din",s:"Utleieren din skriver at husleia skal øke med 2000 kroner i måneden fra neste måned. Badet i leiligheten har hatt fuktproblemer lenge."},
  {id:"e-buss",t:"Bussruten",to:"kollektivselskapet",s:"Kollektivselskapet vil legge ned bussruten som går forbi huset ditt. Du tar bussen til jobb hver dag."},
  {id:"e-sofa",t:"Sofaen",to:"nettbutikken",s:"Du bestilte en sofa på nett. Den kom tre uker for sent, og det var en stor flekk på den. Nettbutikken tilbyr deg 10 prosent rabatt."},
  {id:"e-barnehage",t:"Barnehagen",to:"styreren i barnehagen",s:"Barnehagen til barnet ditt skal stenge klokka 16.00 i stedet for 16.30 fra høsten."},
  {id:"e-kurs",t:"Norskkurset",to:"lederen for norskkurset",s:"Norskkurset ditt skal flyttes fra kveldstid til dagtid. Du jobber fulltid."},
  {id:"e-bibliotek",t:"Biblioteket",to:"kommunen",s:"Kommunen har bestemt at biblioteket i bydelen din skal holde stengt på lørdager for å spare penger."},
  {id:"e-parkering",t:"Parkeringen",to:"styret i borettslaget",s:"Styret i borettslaget vil at beboerne skal betale 600 kroner i måneden for å parkere utenfor blokka. Til nå har parkeringen vært gratis."},
  {id:"e-fly",t:"Flyet",to:"flyselskapet",s:"Flyet ditt ble kansellert, og du kom fram ett døgn for sent. Flyselskapet tilbyr deg bare et gavekort på 500 kroner."},
  {id:"e-turnus",t:"Ny turnus",to:"lederen din",s:"Arbeidsplassen din innfører en ny turnus der alle må jobbe hver tredje helg i stedet for hver fjerde."},
  {id:"e-lekeplass",t:"Lekeplassen",to:"kommunen",s:"Kommunen vil bygge parkeringsplasser der lekeplassen i nabolaget ditt ligger i dag."},
  {id:"e-frukt",t:"Skolefrukt",to:"rektor på skolen",s:"Skolen til barnet ditt slutter å servere gratis frukt hver dag."}
];
const EMAIL_POINTS = ["Fortell hvorfor du skriver","Si hva du mener om situasjonen","Begrunn meningen din","Foreslå hva som bør gjøres"];

const ARG = [
  {id:"a-mobil",t:"Mobil i skolen",q:"Noen mener at mobiltelefoner bør være forbudt i hele skoletiden, også i friminuttene. Hva mener du?",h:["konsentrasjon og læring","kontakt med foreldre","sosialt liv i friminuttene"]},
  {id:"a-hjemmekontor",t:"Hjemmekontor",q:"Mange jobber hjemmefra en eller flere dager i uka. Er dette en positiv utvikling?",h:["tid og reisevei","samarbeid og kollegaer","familieliv"]},
  {id:"a-by",t:"By eller land",q:"Er det bedre å vokse opp på landet enn i en by?",h:["natur og trygghet","tilbud og aktiviteter","skole og venner"]},
  {id:"a-kollektiv",t:"Gratis kollektivtransport",q:"Bør buss og tog være gratis for alle?",h:["miljø","økonomi for folk og for staten","trafikk i byene"]},
  {id:"a-pensjon",t:"Pensjonsalder",q:"Bør folk jobbe lenger før de går av med pensjon?",h:["helse","økonomi","erfaring på arbeidsplassen"]},
  {id:"a-kjott",t:"Dyrere kjøtt",q:"Bør kjøtt bli dyrere for å beskytte miljøet?",h:["klima","helse","folk med dårlig råd"]},
  {id:"a-some",t:"Sosiale medier",q:"Gjør sosiale medier oss mer eller mindre sosiale?",h:["kontakt med familie langt unna","ensomhet","barn og unge"]},
  {id:"a-karakter",t:"Karakterer",q:"Bør elever få karakterer allerede på barneskolen?",h:["motivasjon","press og stress","informasjon til foreldre"]},
  {id:"a-sondag",t:"Søndagsåpne butikker",q:"Bør alle butikker få holde åpent på søndager?",h:["fritid for de ansatte","praktisk for kundene","tradisjon"]},
  {id:"a-lonn",t:"Lønn eller trivsel",q:"Hva er viktigst når man velger jobb: høy lønn eller et godt arbeidsmiljø?",h:["økonomi og trygghet","helse og trivsel","utvikling"]},
  {id:"a-skjerm",t:"Skjermtid",q:"Bør foreldre bestemme hvor mye tid barna bruker på skjerm?",h:["søvn og helse","læring","barnas frihet"]},
  {id:"a-bolig",t:"Eie eller leie",q:"Er det bedre å eie enn å leie bolig?",h:["økonomi","frihet til å flytte","trygghet"]},
  {id:"a-turist",t:"Turister og natur",q:"Bør turister betale for å besøke populære naturområder i Norge?",h:["slitasje på naturen","allemannsretten","lokalsamfunnet"]},
  {id:"a-dugnad",t:"Dugnad",q:"Er dugnad fortsatt en god tradisjon, eller er den gammeldags?",h:["fellesskap","tid og plikt","integrering"]},
  {id:"a-frivillig",t:"Frivillig arbeid i skolen",q:"Bør alle ungdommer gjøre frivillig arbeid som en del av skolen?",h:["erfaring","tvang og frivillighet","hjelp til samfunnet"]},
  {id:"a-digital",t:"Et digitalt samfunn",q:"Har det blitt for vanskelig å klare seg i Norge uten digitale ferdigheter?",h:["eldre","BankID, NAV og banken","effektivitet"]}
];

/* ---------- SNAKKE: speaking tasks (B1–B2 oral test) ----------
   MENING: say what you think (2–3 min). SAMTALE: talk with a partner (5–7 min).
   PASTAND: take a stand on a statement (2–3 min alone, then 2–3 min follow-up questions). */
const MENING = [
  {q:"Hva synes du om at de fleste barn i Norge begynner i barnehagen når de er ett år gamle?",f:["Hvordan var det der du vokste opp?","Hva er viktig i en god barnehage?"]},
  {q:"Er det viktig å kunne norsk for å få venner i Norge?",f:["Hvordan fikk du venner her?","Hva kan nordmenn gjøre for å bli bedre kjent med nye innbyggere?"]},
  {q:"Hva synes du om at nesten alt skal gjøres digitalt i dag, for eksempel i banken og hos NAV?",f:["Hvem kan få problemer?","Hva er fordelene?"]},
  {q:"Bør alle barn lære å lage mat på skolen?",f:["Hvem lærte deg å lage mat?","Hvilken rett vil du lære bort?"]},
  {q:"Er det bedre å bo i en leilighet eller i et hus?",f:["Hvor bor du nå?","Hvordan vil du bo om ti år?"]},
  {q:"Hva synes du om dugnad?",f:["Har du vært med på dugnad?","Finnes det noe lignende i hjemlandet ditt?"]},
  {q:"Bør det være lov å bruke mobilen når familien spiser middag sammen?",f:["Hvordan er det hjemme hos deg?","Hvorfor er det viktig å spise sammen?"]},
  {q:"Hva synes du om at mange butikker er stengt på søndager i Norge?",f:["Hva gjør du på søndager?","Hva er vanlig i hjemlandet ditt?"]},
  {q:"Er det en god idé å jobbe ved siden av studiene?",f:["Hvilke jobber passer for studenter?","Hva kan gå ut over studiene?"]},
  {q:"Bør barn hjelpe til hjemme, for eksempel med rydding og oppvask?",f:["Hvor gamle bør de være?","Bør de få betalt?"]},
  {q:"Hva er viktigst for deg i en jobb?",f:["Hvordan er en god sjef?","Har du hatt en jobb du likte godt?"]},
  {q:"Er det bedre å feriere i Norge eller i utlandet?",f:["Hvor har du vært på ferie i Norge?","Hva betyr miljøet for valget ditt?"]},
  {q:"Er det viktig å trene regelmessig?",f:["Hva gjør du for å holde deg i form?","Hva kan få flere til å trene?"]},
  {q:"Bør folk få ta med hunder og katter på buss og tog?",f:["Hva med folk som er allergiske?","Har du kjæledyr?"]},
  {q:"Hva synes du om at mange unge bor hjemme hos foreldrene lenge?",f:["Når flyttet du hjemmefra?","Hva gjør det vanskelig for unge å flytte?"]}
];
const SAMTALE = [
  "Bør skoleelever bruke skoleuniform?",
  "Er det bedre å ha mange venner eller noen få gode venner?",
  "Bør barn få lommepenger? Hvor mye, og hva skal de gjøre for dem?",
  "Hva er den beste måten å lære et nytt språk på?",
  "Bør det være forbudt å kjøre bil i sentrum av de største byene?",
  "Bør eldre mennesker bo hjemme så lenge som mulig, eller flytte på sykehjem?",
  "Hva er de tre viktigste tingene en ny innbygger i kommunen bør få vite?",
  "Bør alle bruke mindre penger på klær og andre ting de egentlig ikke trenger?",
  "Er det riktig at man må betale for å parkere ved sykehus?",
  "Bør skoledagen begynne senere for ungdom?",
  "Er det best å jobbe på et stort eller et lite arbeidssted?",
  "Bør det være gratis å gå på kino, museum og konserter for barn?"
];
const PASTAND = [
  {q:"Det er foreldrenes ansvar, ikke skolens, å lære barn gode matvaner.",f:["Hva lærte du om mat da du var barn?","Hva kan skolen gjøre?","Bør skolemat være gratis?"]},
  {q:"Alle som bor i Norge, bør kunne snakke norsk.",f:["Hvordan har du lært norsk?","Hva bør samfunnet gjøre for å hjelpe?","Finnes det noen som ikke trenger å kunne norsk?"]},
  {q:"Sosiale medier gjør mer skade enn nytte.",f:["Hvilke sosiale medier bruker du?","Hvordan påvirker de barn og unge?","Bør det være en aldersgrense?"]},
  {q:"Det burde vært gratis å reise kollektivt.",f:["Hvordan reiser du til jobb eller skole?","Hvem skal betale for det?","Hva er viktigst: lav pris eller flere avganger?"]},
  {q:"Man blir lykkeligere av å bo på landet enn i byen.",f:["Hvor vokste du opp?","Hva savner man på landet?","Hvor vil du helst bo når du blir gammel?"]},
  {q:"Arbeidsgivere bør la de ansatte jobbe hjemmefra så mye de vil.",f:["Hvilke jobber passer ikke for hjemmekontor?","Hva er utfordringene?","Hvordan påvirker det arbeidsmiljøet?"]},
  {q:"Det er viktigere å ha en jobb man liker, enn å tjene mye penger.",f:["Hva er drømmejobben din?","Kan man være lykkelig uten penger?","Hva betyr kollegaene for deg?"]},
  {q:"Barn bruker altfor mye tid foran skjermen.",f:["Hvor mye skjermtid er greit?","Hva gjorde du da du var barn?","Hva kan foreldre gjøre?"]},
  {q:"Turismen ødelegger den norske naturen.",f:["Hvor bør turister reise i Norge?","Bør det koste penger å gå på populære turer?","Hva betyr turismen for små steder?"]},
  {q:"Alle unge burde gjøre ett år med frivillig arbeid etter videregående.",f:["Hva slags arbeid kunne det vært?","Hva lærer man av frivillig arbeid?","Bør de få betalt?"]},
  {q:"Vi kjøper altfor mye ting vi ikke trenger.",f:["Hva kjøpte du sist som du ikke trengte?","Hvordan kan vi bruke mindre?","Hva betyr reklame?"]},
  {q:"Kontanter bør forsvinne helt.",f:["Bruker du kontanter?","Hvem trenger kontanter?","Hva skjer hvis datasystemene stopper?"]},
  {q:"Det er viktig å ta vare på tradisjonene fra hjemlandet sitt.",f:["Hvilke tradisjoner er viktige for deg?","Hvilke norske tradisjoner liker du?","Hvordan kan barn lære om begge kulturene?"]},
  {q:"Fire dagers arbeidsuke burde vært normalen i Norge.",f:["Hva ville du gjort med en ekstra fridag?","Hvilke yrker kan ikke ha fire dagers uke?","Hvem skal betale for det?"]},
  {q:"Eldre mennesker blir ikke tatt godt nok vare på i Norge.",f:["Hvordan tar man vare på eldre i hjemlandet ditt?","Hvem har ansvaret: familien eller staten?","Hva kan vi gjøre for å hindre ensomhet?"]}
];
