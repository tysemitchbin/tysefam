/* ════════════════════════════════════════════════════════════════
   NORSKPRØVEN B1–B2: grammar notes, grammar questions, word cards and phrases.
   (Reading texts, listening clips and writing/speaking tasks are in oppgaver.js.)

   Everything here was written for this tool. None of it is copied from the real test.
   Every pair is [norsk, English].

   How to add a grammar question (copy a line and change it):
     g("ord", "Norwegian prompt", "English prompt",
       "the RIGHT answer",                 ← always first (the app shuffles the order)
       ["wrong answer", "wrong answer"],
       "optional explanation (nb)", "optional explanation (en)");
   gs(...) is a short form for "Hvilken setning er riktig?" (Which sentence is correct?).
═════════════════════════════════════════════════════════════════ */

/* Grammar topics. m = which group they belong to. */
const CH = [
  {id:"ord", m:1, nb:"Ordstilling (V2)", en:"Word order (V2)"},
  {id:"ledd",m:1, nb:"Leddsetninger", en:"Subordinate clauses"},
  {id:"bind",m:1, nb:"Bindeord", en:"Linking words"},
  {id:"verb",m:2, nb:"Verb og tid", en:"Verbs and tenses"},
  {id:"pass",m:2, nb:"Passiv og s-verb", en:"Passive and -s verbs"},
  {id:"adj", m:2, nb:"Substantiv og adjektiv", en:"Nouns and adjectives"},
  {id:"pron",m:2, nb:"Pronomen (sin/hans, seg)", en:"Pronouns (sin/hans, seg)"},
  {id:"prep",m:2, nb:"Preposisjoner", en:"Prepositions"},
  {id:"skr", m:3, nb:"Rettskriving og komma", en:"Spelling and commas"},
  {id:"ordf",m:3, nb:"Ord som ofte blandes", en:"Words people mix up"}
];
const MOD = {
  1:["Setningen","The sentence"],
  2:["Ordene","The words"],
  3:["Skriv riktig","Write it right"]
};

/* ---------- Notes for each topic ("#" at the start = a heading) ---------- */
const NOTES = {
ord:[
  ["#Verbet på plass 2","The verb in second place"],
  ["I en helsetning står det bøyde verbet alltid på <b>plass 2</b>. <i>Jeg <b>jobber</b> i dag.</i>","In a main clause the finite verb is always in <b>second place</b>. <i>I work today.</i>"],
  ["Hvis noe annet enn subjektet står først, bytter subjektet og verbet plass (<b>inversjon</b>): <i>I dag <b>jobber jeg</b>.</i> Aldri: <i>I dag jeg jobber.</i>","If something other than the subject comes first, the subject and verb swap (<b>inversion</b>): <i>Today work I.</i> Never: <i>Today I work.</i>"],
  ["Plass 1 kan være lang: <i>Da vi flyttet til Norge for fem år siden, <b>kunne vi</b> ingen norsk.</i> Hele leddsetningen er plass 1.","Place 1 can be long: a whole subordinate clause counts as place 1, so the verb comes straight after it."],
  ["#Adverb: ikke, aldri, alltid, ofte, også","Adverbs: ikke, aldri, alltid, ofte, også"],
  ["Setningsadverb står <b>etter det bøyde verbet</b>: <i>Jeg liker <b>ikke</b> kaffe.</i> <i>Han har <b>aldri</b> vært der.</i>","Sentence adverbs go <b>after the finite verb</b>: <i>I like not coffee.</i> <i>He has never been there.</i>"],
  ["Med inversjon kommer subjektet først, så adverbet: <i>I dag har <b>jeg ikke</b> tid.</i>","With inversion the subject comes first, then the adverb: <i>Today have I not time.</i>"],
  ["#Spørsmål","Questions"],
  ["Spørreord + verb + subjekt: <i>Hvor lenge <b>har du</b> bodd her?</i> Ja/nei-spørsmål starter med verbet: <i><b>Har du</b> barn?</i>","Question word + verb + subject. Yes/no questions start with the verb."],
  ["#Konjunksjoner endrer ikke ordstillingen","Conjunctions don't change the word order"],
  ["<b>og, men, eller, for</b> binder sammen to helsetninger. Etter dem kommer vanlig ordstilling: <i>…, men <b>det regnet</b>.</i>","<b>og, men, eller, for</b> join two main clauses. Normal word order follows: <i>…, but it rained.</i>"],
  ["Ord som <b>derfor, likevel, dessuten, i tillegg, etterpå</b> er adverb, ikke konjunksjoner. Står de først, får du inversjon: <i>Derfor <b>ble jeg</b> hjemme.</i>","Words like <b>derfor, likevel, dessuten, i tillegg, etterpå</b> are adverbs. At the start they cause inversion: <i>Therefore stayed I at home.</i>"]
],
ledd:[
  ["#Hva er en leddsetning?","What is a subordinate clause?"],
  ["En leddsetning kan ikke stå alene. Den starter med en <b>subjunksjon</b>: at, som, fordi, når, da, hvis, om, selv om, mens, før, etter at, siden, slik at, for at, dersom, ettersom – eller et spørreord (hvor, hva, hvem, hvordan) i indirekte spørsmål.","A subordinate clause can't stand alone. It starts with a <b>subordinating conjunction</b> (at, som, fordi, når…) or a question word in an indirect question."],
  ["#BIFF-regelen","The BIFF rule"],
  ["<b>B</b>isetninger: <b>I</b>kke <b>F</b>lyttes <b>F</b>oran (verbet). Rekkefølge: subjunksjon + subjekt + <i>ikke</i> + verb. <i>…fordi jeg <b>ikke har</b> tid.</i>","In subordinate clauses, <i>ikke</i> (and other adverbs) moves <b>in front of</b> the verb: <i>…because I not have time.</i>"],
  ["Det samme gjelder aldri, alltid, ofte, også, bare, kanskje: <i>Hun sier at hun <b>aldri har</b> vært i Bergen.</i>","Same for aldri, alltid, ofte, også, bare, kanskje."],
  ["#Leddsetning først → inversjon","Subordinate clause first → inversion"],
  ["<i>Når jeg kommer hjem, <b>lager jeg</b> middag.</i> Sett komma etter leddsetningen.","<i>When I come home, make I dinner.</i> Put a comma after the subordinate clause."],
  ["#da eller når?","da or når?"],
  ["<b>da</b> = én gang eller én periode i fortiden: <i>Da jeg var barn, …</i>. <b>når</b> = nå, i framtiden, eller flere ganger i fortiden: <i>Når jeg kommer, …</i> / <i>Når vi var hos bestemor, fikk vi alltid vafler.</i>","<b>da</b> = one time or period in the past. <b>når</b> = present, future, or repeatedly in the past."],
  ["#hvis eller om?","hvis or om?"],
  ["<b>hvis</b> = vilkår (if): <i>Hvis det regner, …</i>. <b>om</b> = indirekte ja/nei-spørsmål (whether): <i>Jeg lurer på <b>om</b> han kommer.</i>","<b>hvis</b> = condition (if). <b>om</b> = indirect yes/no question (whether)."],
  ["#Indirekte spørsmål og indirekte tale","Indirect questions and reported speech"],
  ["Ingen inversjon i indirekte spørsmål: <i>Vet du hvor <b>hun bor</b>?</i> (ikke «hvor bor hun»).","No inversion in indirect questions: <i>Do you know where she lives?</i>"],
  ["Indirekte tale i fortid: verbet går ofte ett steg tilbake: <i>Hun sa: «Jeg er trøtt.» → Hun sa at hun <b>var</b> trøtt.</i>","Reported speech in the past: the verb usually moves one step back in time."],
  ["#som","som (who/which/that)"],
  ["<b>som</b> kan sløyfes når det ikke er subjekt: <i>Boka (som) jeg leser, …</i>. Men ikke her: <i>Mannen <b>som</b> bor her, …</i> (som = subjekt).","<b>som</b> can be dropped when it isn't the subject of its clause, but not when it is."]
],
bind:[
  ["#Bindeord gir teksten sammenheng","Linking words make a text hang together"],
  ["På B2 forventer sensor <b>varierte bindeord</b>. Bruk flere enn «og» og «men».","At B2 the examiner expects <b>varied linking words</b>, not just «og» and «men»."],
  ["Tillegg: <b>dessuten, i tillegg, også, videre</b>","Adding: moreover, in addition, also, furthermore"],
  ["Motsetning: <b>men, likevel, derimot, imidlertid, selv om, til tross for</b>","Contrast: but, nevertheless, on the other hand, however, even though, despite"],
  ["Årsak: <b>fordi, siden, ettersom, på grunn av</b>","Cause: because, since, as, because of"],
  ["Følge: <b>derfor, så, slik at, dermed, følgelig</b>","Result: therefore, so, so that, thus, consequently"],
  ["Formål: <b>for å</b> + infinitiv, <b>for at</b> + setning","Purpose: <b>for å</b> + infinitive, <b>for at</b> + clause"],
  ["Eksempel: <b>for eksempel, blant annet</b>. Oppsummering: <b>alt i alt, kort sagt, til slutt</b>","Example: for example, among other things. Summing up: all in all, in short, finally"],
  ["#Tre typer, tre ordstillinger","Three kinds, three word orders"],
  ["<b>Konjunksjon</b> (og, men, eller, for, så): vanlig ordstilling etterpå. <i>…, men vi gikk likevel.</i>","<b>Conjunction</b>: normal word order after it."],
  ["<b>Subjunksjon</b> (fordi, selv om, siden, slik at): leddsetning, BIFF. <i>…fordi vi <b>ikke hadde</b> bil.</i>","<b>Subordinating conjunction</b>: subordinate clause, BIFF rule."],
  ["<b>Adverb</b> (derfor, likevel, dessuten, i tillegg): inversjon når de står først. <i>Derfor <b>tok vi</b> bussen.</i>","<b>Adverb</b>: inversion when it comes first."],
  ["#Substantiv eller setning?","Noun or clause?"],
  ["<b>på grunn av</b> og <b>til tross for</b> + substantiv: <i>på grunn av været</i>. <b>fordi</b> og <b>selv om</b> + setning: <i>fordi været var dårlig</i>.","<b>på grunn av</b> / <b>til tross for</b> + noun. <b>fordi</b> / <b>selv om</b> + clause."]
],
verb:[
  ["#Fire tider du må kunne","Four tenses you must know"],
  ["<b>Presens</b>: jeg jobber. <b>Preteritum</b>: jeg jobbet. <b>Perfektum</b>: jeg har jobbet. <b>Pluskvamperfektum</b>: jeg hadde jobbet.","Present, past, present perfect, past perfect."],
  ["#Preteritum eller perfektum?","Past or present perfect?"],
  ["<b>Preteritum</b> = avsluttet tid: <i>i går, i fjor, da jeg var ung, for to år siden</i>.","<b>Past</b> = finished time: yesterday, last year, when I was young, two years ago."],
  ["<b>Perfektum</b> = har betydning nå, erfaring eller fram til nå: <i>Jeg <b>har bodd</b> her i fem år</i> (og bor her fortsatt). <i>Har du <b>vært</b> i Tromsø?</i>","<b>Present perfect</b> = relevant now, experience, or up to now: <i>I have lived here for five years</i> (still do)."],
  ["<b>Pluskvamperfektum</b> = før noe annet i fortiden: <i>Da jeg kom, <b>hadde</b> toget gått.</i>","<b>Past perfect</b> = before something else in the past."],
  ["#Svake verb (regelmessige)","Weak (regular) verbs"],
  ["-et: kaste – kastet – har kastet · -te: lese – leste – har lest · -de: prøve – prøvde – har prøvd · -dde: bo – bodde – har bodd","Four patterns: -et, -te, -de, -dde."],
  ["#Sterke verb (uregelmessige) – lær disse","Strong (irregular) verbs – learn these"],
  ["gå – gikk – gått · få – fikk – fått · se – så – sett · si – sa – sagt · gjøre – gjorde – gjort · vite – visste – visst · ta – tok – tatt · gi – ga – gitt · komme – kom – kommet · bli – ble – blitt · være – var – vært","go, get, see, say, do, know, take, give, come, become, be"],
  ["skrive – skrev – skrevet · finne – fant – funnet · sitte – satt – sittet · ligge – lå – ligget · legge – la – lagt · sette – satte – satt · spørre – spurte – spurt · selge – solgte – solgt · velge – valgte – valgt · hjelpe – hjalp – hjulpet","write, find, sit, lie, lay, put, ask, sell, choose, help"],
  ["#Modalverb + infinitiv uten «å»","Modal verbs + infinitive without «å»"],
  ["<b>kan, må, skal, vil, bør, får</b> + infinitiv: <i>Jeg må <b>gå</b>.</i> Ikke: <i>Jeg må å gå.</i>","<b>kan, må, skal, vil, bør, får</b> take a bare infinitive."],
  ["Andre verb tar «å»: <i>Jeg liker <b>å</b> lese. Jeg prøver <b>å</b> forstå.</i>","Other verbs take «å»: I like to read."],
  ["#Framtid og «hvis»","Future and «if»"],
  ["<b>skal</b> = plan, <b>kommer til å</b> = spådom, <b>vil</b> = ønske. <i>Hvis jeg <b>hadde</b> tid, <b>ville</b> jeg reise mer.</i> <i>Hvis du <b>hadde</b> sagt fra, <b>hadde</b> jeg hjulpet deg.</i>","<b>skal</b> = plan, <b>kommer til å</b> = prediction, <b>vil</b> = want. Hypothetical: hadde … ville / hadde … hadde."]
],
pass:[
  ["#To måter å lage passiv på","Two ways to make the passive"],
  ["<b>bli + perfektum partisipp</b>: <i>Huset <b>ble bygget</b> i 1950.</i> <i>Saken <b>har blitt</b> diskutert.</i>","<b>bli + past participle</b>: <i>The house was built in 1950.</i>"],
  ["<b>s-passiv</b>: mest etter modalverb og i presens: <i>Søknaden <b>må sendes</b> innen fredag.</i> <i>Billetter <b>selges</b> i luka.</i>","<b>-s passive</b>: mostly after modal verbs and in the present: <i>The application must be sent by Friday.</i>"],
  ["Den som gjør handlingen, kommer etter <b>av</b>: <i>Romanen ble skrevet <b>av</b> Sigrid Undset.</i>","The doer comes after <b>av</b> (by)."],
  ["Passiv er vanlig i formelle tekster og beskjeder: <i>Det <b>må ikke</b> parkeres her.</i>","Passive is common in formal texts and notices."],
  ["#s-verb som IKKE er passiv","-s verbs that are NOT passive"],
  ["Noen verb ender alltid på -s, men betyr aktiv handling: <b>synes, trives, finnes/fins, lykkes, minnes, møtes</b> (= møter hverandre). <i>Jeg <b>trives</b> i Norge.</i> <i>Vi <b>møtes</b> klokka åtte.</i>","Some verbs always end in -s but are active: synes (think), trives (thrive), finnes (exist), lykkes (succeed), møtes (meet each other)."]
],
adj:[
  ["#Substantiv: kjønn og bøying","Nouns: gender and endings"],
  ["en bil – bilen – biler – bilene · ei/en jente – jenta/jenten – jenter – jentene · et hus – huset – hus – husene","Masculine, feminine, neuter. Short neuter nouns often have no ending in the indefinite plural (hus)."],
  ["Uregelmessige: mann – menn, bok – bøker, bror – brødre, barn – barn, øye – øyne, sko – sko","Irregular plurals."],
  ["#Adjektiv må passe til substantivet","Adjectives agree with the noun"],
  ["en stor bil · et stor<b>t</b> hus · stor<b>e</b> biler · den stor<b>e</b> bilen · det stor<b>e</b> huset · min ny<b>e</b> bil","Add -t for neuter, -e for plural and after den/det/de and possessives."],
  ["Dobbel bestemmelse: <b>den</b> store bil<b>en</b>, <b>det</b> gamle hus<b>et</b>.","Double definiteness: den/det + adjective + noun with ending."],
  ["Ingen -t i intetkjønn for adjektiv på <b>-ig, -isk, -sk</b>: et viktig møte, et praktisk valg, et norsk ord.","No -t in the neuter for adjectives ending in -ig, -isk, -sk."],
  ["liten – lita – lite – små · den lille – de små · ny – nytt · blå – blått","Irregular: liten (small), ny (new), blå (blue)."],
  ["#Gradbøying","Comparison"],
  ["stor – større – størst · god – bedre – best · gammel – eldre – eldst · ung – yngre – yngst · liten – mindre – minst · mange – flere – flest · mye – mer – mest","Irregular comparison."],
  ["Lange adjektiv: <i>interessant – <b>mer</b> interessant – <b>mest</b> interessant</i>. Bestemt form: <i>den stør<b>ste</b> byen</i>.","Long adjectives use mer/mest."],
  ["#mange eller mye?","mange or mye?"],
  ["<b>mange</b> + ting du kan telle (mange bøker). <b>mye</b> + ting du ikke kan telle (mye tid, mye vann). Det samme med <b>få/lite</b> og <b>flere/mer</b>.","<b>mange</b> = many (countable). <b>mye</b> = much (uncountable)."]
],
pron:[
  ["#Subjekt- og objektform","Subject and object forms"],
  ["jeg/meg · du/deg · han/ham · hun/henne · vi/oss · dere/dere · <b>de/dem</b>. <i><b>De</b> bor her. Jeg kjenner <b>dem</b>.</i>","<b>de</b> = they, <b>dem</b> = them. A very common mistake."],
  ["#Refleksivt: seg","Reflexive: seg"],
  ["Når subjekt og objekt er samme person: <i>Han vasker <b>seg</b>. Vi gleder <b>oss</b>. De gleder <b>seg</b>.</i>","When subject and object are the same person."],
  ["Vanlige verb: glede seg, føle seg, sette seg, legge seg, bestemme seg, skynde seg, interessere seg for, kjede seg.","Common reflexive verbs."],
  ["#sin/si/sitt/sine eller hans/hennes?","sin or hans/hennes?"],
  ["<b>sin</b> peker tilbake på <b>subjektet i samme setning</b>: <i>Per vasker bilen <b>sin</b></i> (Pers egen). <i>Per vasker bilen <b>hans</b></i> (en annen manns).","<b>sin</b> refers back to the <b>subject of the same clause</b>. <b>hans</b> = someone else's."],
  ["<b>sin</b> kan aldri være en del av subjektet: <i>Kari og mannen <b>hennes</b> har flyttet.</i> Ikke: <i>Kari og mannen sin.</i>","<b>sin</b> can never be part of the subject itself."],
  ["#den eller det?","den or det?"],
  ["<i>Jeg har en sofa. <b>Den</b> er grønn.</i> <i>Jeg har et hus. <b>Det</b> er stort.</i> Formelt subjekt: <i><b>Det</b> regner. <b>Det</b> er viktig å sove.</i>","Refer back with den (en-words) or det (et-words). Dummy subject: det."],
  ["#ingen og noen","ingen and noen"],
  ["<i>Jeg har <b>ingen</b> penger = Jeg har <b>ikke noen</b> penger.</i> Men med sammensatt verb: <i>Jeg har <b>ikke sett noen</b>.</i> Ikke: <i>Jeg har sett ingen.</i>","With compound verbs use <b>ikke … noen</b>, not <b>ingen</b> after the main verb."],
  ["<b>hverandre</b> = each other: <i>De hjelper hverandre.</i> · <b>selv</b> = -self: <i>Hun gjorde det selv.</i>","each other, -self"]
],
prep:[
  ["#Tid","Time"],
  ["<b>i</b> dag, i går, i fjor, i sommer, i 2020, i tre år (hvor lenge) · <b>på</b> mandag, på søndager, på 1800-tallet · <b>om</b> morgenen (vanligvis), om to dager (fram i tid) · <b>for</b> tre år <b>siden</b> · <b>innen</b> fredag (frist)","Time prepositions."],
  ["#Sted og retning","Place and direction"],
  ["<b>i</b> Norge, i Oslo, i huset · <b>på</b> jobb, på skolen, på butikken, på kino, på sykehuset · <b>hos</b> legen, hos meg · <b>til</b> Oslo, til butikken (retning)","Place: i (countries, cities, inside), på (many places), hos (at someone's). Direction: til."],
  ["Retning eller sted: <b>hjem / hjemme</b>, <b>inn / inne</b>, <b>ut / ute</b>, <b>opp / oppe</b>. <i>Jeg går hjem. Jeg er hjemme.</i>","Direction vs. place: hjem (home, movement) / hjemme (at home)."],
  ["#Faste uttrykk – lær dem som ett ord","Fixed phrases – learn them as one unit"],
  ["interessert <b>i</b> · glad <b>i</b> · flink <b>til</b> · redd <b>for</b> · fornøyd <b>med</b> · lei <b>av</b> · opptatt <b>av</b> · avhengig <b>av</b> · stolt <b>av</b> · vant <b>til</b>","interested in, fond of, good at, afraid of, happy with, tired of, concerned with, dependent on, proud of, used to"],
  ["enig <b>med</b> noen / enig <b>i</b> noe · vente <b>på</b> · tenke <b>på</b> · tro <b>på</b> · passe <b>på</b> · ta vare <b>på</b> · lete <b>etter</b> · søke <b>på</b> en jobb · søke <b>om</b> permisjon · bry seg <b>om</b>","agree with someone / with something, wait for, think about, believe in, look after, take care of, look for, apply for a job, apply for leave, care about"],
  ["glede seg <b>til</b> (framtid) / <b>over</b> (nå) · klage <b>på</b> · ha råd <b>til</b> · føre <b>til</b> · bidra <b>til</b> · løsning <b>på</b> · grunn <b>til</b>","look forward to / be glad about, complain about, afford, lead to, contribute to, solution to, reason for"],
  ["Etter preposisjon kommer infinitiv med <b>å</b>: <i>flink til <b>å</b> lage mat</i>, <i>gleder meg til <b>å</b> reise</i>.","After a preposition use <b>å</b> + infinitive."]
],
skr:[
  ["#og eller å?","og or å?"],
  ["<b>og</b> binder sammen (and): <i>brød <b>og</b> melk</i>. <b>å</b> står foran infinitiv (to): <i>Jeg liker <b>å</b> lese.</i> Test: kan du si «to» på engelsk? Da er det «å».","<b>og</b> = and. <b>å</b> = to (before an infinitive)."],
  ["#Komma","Commas"],
  ["Komma <b>etter</b> en leddsetning som står først: <i>Hvis det regner<b>,</b> blir vi inne.</i>","Comma <b>after</b> a subordinate clause at the start."],
  ["Komma foran <b>men</b>, og foran <b>og/eller</b> når begge sider er hele setninger: <i>Jeg lagde middag<b>,</b> og han vasket opp.</i>","Comma before <b>men</b>, and before <b>og/eller</b> joining two full main clauses."],
  ["Komma etter en innskutt leddsetning: <i>Boka som jeg lånte<b>,</b> var god.</i>","Comma after a subordinate clause inside the sentence."],
  ["<b>Ikke</b> komma foran «at»: <i>Jeg tror at det blir fint.</i>","<b>No</b> comma before «at» (that)."],
  ["#Liten forbokstav","Lowercase letters"],
  ["Dager, måneder, språk og nasjonaliteter: <i>mandag, juli, norsk, en nordmann</i>. Navn på land og byer har stor: <i>Spania, Bergen</i>.","Days, months, languages and nationalities are lowercase. Countries and cities are capitalised."],
  ["#Sammensatte ord skrives i ett","Compound words are written as one"],
  ["<i>arbeidsplass, sykehus, bussjåfør</i>. Deler du ordet, kan betydningen endre seg: <i>røykfritt</i> (ingen røyking) – <i>røyk fritt</i> (røyk så mye du vil)!","Splitting a compound can change the meaning."],
  ["#m på slutten, et eller ett","Final m, et or ett"],
  ["Ord slutter aldri på -mm: <i>rom, dum, hjem, kom, som</i>. Men: <i>rommet, dumme, komme</i>.","Words never end in -mm."],
  ["<b>et</b> = artikkel (a). <b>ett</b> = tallet 1: <i>Jeg har bare <b>ett</b> barn.</i>","<b>et</b> = a, <b>ett</b> = one."]
],
ordf:[
  ["#vite, kjenne, kunne","vite, kjenne, kunne"],
  ["<b>vite</b> = ha informasjon: <i>Jeg vet hvor hun bor.</i> · <b>kjenne</b> = kjenne en person/et sted: <i>Jeg kjenner ham.</i> · <b>kunne</b> = ferdighet: <i>Kan du svømme?</i>","know a fact / know a person or place / know how to"],
  ["#legge – ligge, sette – sitte","lay – lie, put – sit"],
  ["<b>legge</b> (la, lagt) = noen legger noe: <i>Legg nøklene på bordet.</i> · <b>ligge</b> (lå, ligget) = er der: <i>Nøklene ligger på bordet.</i>","<b>legge</b> = put something down. <b>ligge</b> = lie / be lying."],
  ["<b>sette</b> (satte, satt) = plassere: <i>Sett deg!</i> · <b>sitte</b> (satt, sittet) = være i sittende stilling: <i>Vi satt i sofaen.</i>","<b>sette</b> = put/place. <b>sitte</b> = sit."],
  ["#synes, tro, tenke","synes, tro, tenke"],
  ["<b>synes</b> = mening etter erfaring: <i>Jeg synes filmen var bra.</i> · <b>tro</b> = mene uten å vite sikkert: <i>Jeg tror toget går klokka åtte.</i> · <b>tenke</b> = bruke hodet: <i>Jeg tenker på deg.</i>","<b>synes</b> = opinion, <b>tro</b> = believe/guess, <b>tenke</b> = think about."],
  ["#Andre par","Other pairs"],
  ["<b>bli</b> = forandring (become) · <b>være</b> = tilstand (be). <i>Det blir kaldere.</i>","become vs. be"],
  ["<b>lære</b> = learn eller teach · <b>lære seg</b> = learn (selv) · <b>studere</b> = ved universitet","learn/teach, learn by yourself, study at university"],
  ["<b>litt</b> = a little · <b>lite</b> = not much · <b>liten</b> = small. <b>også</b> i positive setninger, <b>heller</b> i negative: <i>Ikke jeg heller.</i>","a little / not much / small. also / neither."],
  ["<b>låne</b> = borrow (og lend) · <b>låne ut</b> = lend","borrow / lend"]
]
};

/* ---------- Grammar questions ---------- */
const Q = [];
function g(ch,nb,en,right,wrong,xnb,xen){Q.push({ch:ch,nb:nb,en:en,o:[right].concat(wrong),xnb:xnb||"",xen:xen||""})}
function gs(ch,right,wrong,xnb,xen){g(ch,"Hvilken setning er riktig?","Which sentence is correct?",right,wrong,xnb,xen)}

/* ordstilling */
gs("ord","I morgen skal jeg begynne på et nytt kurs.",["I morgen jeg skal begynne på et nytt kurs.","I morgen skal begynne jeg på et nytt kurs."],"Verbet står på plass 2. Når «i morgen» står først, kommer subjektet etter verbet.","The verb is in second place. When «i morgen» comes first, the subject follows the verb.");
gs("ord","Etter jobben trener hun på senteret.",["Etter jobben hun trener på senteret.","Etter jobben hun på senteret trener."],"«Etter jobben» er plass 1, så verbet «trener» må komme rett etter.","«Etter jobben» is place 1, so the verb must come right after.");
gs("ord","Jeg liker ikke fiskeboller.",["Jeg ikke liker fiskeboller.","Ikke jeg liker fiskeboller."],"I helsetninger står «ikke» etter det bøyde verbet.","In main clauses «ikke» comes after the finite verb.");
gs("ord","Han har aldri vært i Nord-Norge.",["Han aldri har vært i Nord-Norge.","Han har vært aldri i Nord-Norge."],"«aldri» står etter det bøyde verbet «har», foran hovedverbet.","«aldri» goes after the finite verb «har», before the main verb.");
gs("ord","Derfor bestemte vi oss for å flytte.",["Derfor vi bestemte oss for å flytte.","Derfor bestemte oss vi for å flytte."],"«Derfor» er et adverb. Står det først, får vi inversjon.","«Derfor» is an adverb. At the start it causes inversion.");
gs("ord","Likevel var det mange som kom.",["Likevel det var mange som kom.","Likevel var mange det som kom."],"«Likevel» først → verb + subjekt.","«Likevel» first → verb + subject.");
gs("ord","Vi ville gå tur, men det regnet hele dagen.",["Vi ville gå tur, men regnet det hele dagen.","Vi ville gå tur, men det hele dagen regnet."],"«men» er en konjunksjon og endrer ikke ordstillingen.","«men» is a conjunction and doesn't change the word order.");
gs("ord","Hvor lenge har du bodd i Norge?",["Hvor lenge du har bodd i Norge?","Hvor lenge har bodd du i Norge?"],"Spørreord + verb + subjekt.","Question word + verb + subject.");
gs("ord","I dag har jeg ikke tid.",["I dag jeg har ikke tid.","I dag ikke har jeg tid."],"Inversjon: verb + subjekt, så «ikke».","Inversion: verb + subject, then «ikke».");
gs("ord","Da vi flyttet til Norge, kunne vi ikke et ord norsk.",["Da vi flyttet til Norge, vi kunne ikke et ord norsk.","Da flyttet vi til Norge, vi kunne ikke et ord norsk."],"Hele leddsetningen er plass 1. Etter kommaet kommer verbet.","The whole subordinate clause is place 1. The verb comes right after the comma.");
gs("ord","Du burde egentlig ha sagt fra tidligere.",["Du egentlig burde ha sagt fra tidligere.","Du burde ha egentlig sagt fra tidligere."],"Adverbet står etter det første (bøyde) verbet.","The adverb goes after the first (finite) verb.");
gs("ord","Om sommeren er vi ofte på hytta.",["Om sommeren vi er ofte på hytta.","Om sommeren er ofte vi på hytta."],"Inversjon, og pronomenet «vi» står foran «ofte».","Inversion, and the pronoun «vi» comes before «ofte».");
gs("ord","Kollegaen min ga meg en god idé.",["Kollegaen min ga en god idé meg.","Kollegaen min meg ga en god idé."],"Indirekte objekt (meg) før direkte objekt (en god idé).","Indirect object (meg) before direct object.");
g("ord","Hvorfor er setningen feil? «På fredag jeg skal på fest.»","Why is the sentence wrong?","Verbet må stå på plass 2: «På fredag skal jeg på fest.»",["«skal» kan ikke brukes om framtid.","Det mangler «å» foran «på»."]);
gs("ord","Den filmen har jeg sett tre ganger.",["Den filmen jeg har sett tre ganger.","Den filmen har sett jeg tre ganger."],"Objektet står først for å gi det vekt. Da kommer verbet på plass 2.","The object is put first for emphasis, so the verb still comes second.");
gs("ord","Vi har også en hund.",["Vi også har en hund.","Vi har en også hund."],"«også» er et setningsadverb og står etter det bøyde verbet.","«også» goes after the finite verb.");
gs("ord","Heldigvis var det ingen som ble skadet.",["Heldigvis det var ingen som ble skadet.","Heldigvis var ingen det som ble skadet."],"«Heldigvis» først → inversjon.","«Heldigvis» first → inversion.");

/* leddsetninger */
gs("ledd","Jeg kom for sent fordi bussen ikke kom.",["Jeg kom for sent fordi bussen kom ikke.","Jeg kom for sent fordi kom bussen ikke."],"BIFF: i leddsetninger står «ikke» foran verbet.","BIFF: in subordinate clauses «ikke» goes before the verb.");
gs("ledd","Hun sier at hun aldri har vært i Bergen.",["Hun sier at hun har aldri vært i Bergen.","Hun sier at aldri hun har vært i Bergen."],"«aldri» flyttes foran verbet i leddsetningen.","«aldri» moves in front of the verb in the subordinate clause.");
gs("ledd","Hvis det regner i morgen, blir vi hjemme.",["Hvis det regner i morgen, vi blir hjemme.","Hvis regner det i morgen, blir vi hjemme."],"Leddsetning først → inversjon i helsetningen etterpå.","Subordinate clause first → inversion in the main clause.");
gs("ledd","Kan du si meg hvor apoteket ligger?",["Kan du si meg hvor ligger apoteket?","Kan du si meg hvor er apoteket?"],"Indirekte spørsmål: spørreord + subjekt + verb.","Indirect question: question word + subject + verb.");
gs("ledd","Jeg lurer på om butikken er åpen i morgen.",["Jeg lurer på hvis butikken er åpen i morgen.","Jeg lurer på om er butikken åpen i morgen."],"Indirekte ja/nei-spørsmål bruker «om», ikke «hvis».","Indirect yes/no questions use «om» (whether), not «hvis».");
g("ledd","«___ jeg var liten, bodde vi i en liten by.»","«___ I was little, we lived in a small town.»","Da",["Når","Hvis"],"Én periode i fortiden → «da».","One period in the past → «da».");
g("ledd","«___ jeg kommer hjem, skal jeg ringe deg.»","«___ I get home, I'll call you.»","Når",["Da","Om"],"Framtid → «når».","Future → «når».");
g("ledd","«___ vi besøkte bestemor, fikk vi alltid vafler.»","«___ we visited grandma, we always got waffles.»","Når",["Da","Fordi"],"Noe som skjedde mange ganger i fortiden → «når».","Something that happened many times in the past → «når».");
gs("ledd","Kvinnen som bor ved siden av oss, er lege.",["Kvinnen som ved siden av oss bor, er lege.","Kvinnen bor ved siden av oss, er lege."],"Relativsetning med «som», og komma etter den.","Relative clause with «som», then a comma.");
g("ledd","I hvilken setning kan du IKKE ta bort «som»?","In which sentence can you NOT remove «som»?","Mannen som jobber her, er snill.",["Filmen som vi så, var lang.","Boka som du ga meg, er spennende."],"«som» kan bare sløyfes når det ikke er subjekt. I «mannen som jobber her» er «som» subjekt.","«som» can only be dropped when it isn't the subject. Here it is the subject.");
gs("ledd","Selv om han var syk, gikk han på jobb.",["Selv om han var syk, han gikk på jobb.","Selv om var han syk, gikk han på jobb."],"Leddsetning først → inversjon etter kommaet.","Subordinate clause first → inversion after the comma.");
gs("ledd","Jeg vet ikke hva han heter.",["Jeg vet ikke hva heter han.","Jeg vet ikke hvordan han heter."],"Indirekte spørsmål: ingen inversjon. Og på norsk spør vi «hva heter du?».","Indirect question: no inversion. And in Norwegian you ask «hva» (what) someone is called.");
g("ledd","Hun sa: «Jeg er trøtt.» → Hun sa at …","She said: «I'm tired.» → She said that …","hun var trøtt.",["jeg er trøtt.","var hun trøtt."],"Indirekte tale: «jeg» blir «hun», og verbet går ofte til preteritum.","Reported speech: «jeg» becomes «hun», and the verb usually moves to the past.");
g("ledd","«Jeg lærer norsk ___ få en bedre jobb.»","«I'm learning Norwegian ___ get a better job.»","for å",["for at","fordi"],"«for å» + infinitiv. «for at» + hel setning.","«for å» + infinitive. «for at» + a full clause.");
g("ledd","«Han snakker sakte ___ alle skal forstå.»","«He speaks slowly ___ everyone will understand.»","slik at",["fordi","for å"],"«slik at» viser formål eller følge og etterfølges av en hel setning.","«slik at» (so that) is followed by a full clause.");
gs("ledd","Siden det var søndag, var butikken stengt.",["Siden det var søndag, butikken var stengt.","Siden var det søndag, var butikken stengt."]);
gs("ledd","Det var naboen som fant katten.",["Det var naboen fant katten.","Det var naboen hvem fant katten."],"«Det er/var … som» brukes for å framheve noe. Ikke «hvem».","«Det var … som» is used for emphasis. Not «hvem».");
gs("ledd","Mens jeg lagde middag, gjorde barna lekser.",["Mens jeg lagde middag, barna gjorde lekser.","Mens lagde jeg middag, gjorde barna lekser."]);
gs("ledd","Jeg håper at du ikke blir skuffet.",["Jeg håper at du blir ikke skuffet.","Jeg håper at ikke du blir skuffet."],"BIFF: «ikke» foran verbet i at-setningen.","BIFF: «ikke» before the verb in the at-clause.");
gs("ledd","Spør læreren om du kan levere senere.",["Spør læreren om kan du levere senere.","Spør læreren hvis du kan levere senere."]);

/* bindeord */
g("bind","«Bussen var forsinket. ___ kom jeg for sent på jobb.»","«The bus was late. ___ I was late for work.»","Derfor",["Fordi","Selv om"],"«Derfor» viser følgen. Merk inversjonen: «Derfor kom jeg».","«Derfor» (therefore) shows the result. Note the inversion.");
g("bind","«Det regnet hele dagen. ___ gikk vi en lang tur.»","«It rained all day. ___ we went for a long walk.»","Likevel",["Derfor","Fordi"],"«Likevel» = selv om noe annet skulle tilsi det motsatte.","«Likevel» = nevertheless.");
g("bind","«Jeg ble hjemme ___ jeg var forkjølet.»","«I stayed at home ___ I had a cold.»","fordi",["derfor","likevel"]);
g("bind","«Vi dro ut ___ været var dårlig.»","«We went out ___ the weather was bad.»","selv om",["fordi","derfor"]);
g("bind","«Kampen ble avlyst ___ uværet.»","«The match was cancelled ___ the storm.»","på grunn av",["fordi","selv om"],"«på grunn av» + substantiv. «fordi» + setning.","«på grunn av» + noun. «fordi» + clause.");
g("bind","«___ de høye prisene er Norge et populært reisemål.»","«___ the high prices, Norway is a popular destination.»","Til tross for",["Selv om","Fordi"],"«Til tross for» + substantiv. «Selv om» + setning.","«Til tross for» + noun. «Selv om» + clause.");
g("bind","«Leiligheten er stor og lys. ___ ligger den nær sentrum.»","«The flat is big and bright. ___ it is close to the centre.»","Dessuten",["Likevel","Derimot"]);
g("bind","«Søsteren min elsker kaffe. Jeg, ___, drikker bare te.»","«My sister loves coffee. I, ___, only drink tea.»","derimot",["dessuten","derfor"],"«derimot» viser en kontrast mellom to ting.","«derimot» shows a contrast.");
g("bind","Hvilken setning er FEIL?","Which sentence is WRONG?","I tillegg vi må betale strøm.",["I tillegg må vi betale strøm.","Vi må i tillegg betale strøm."],"«I tillegg» er et adverb. Står det først, får vi inversjon.","«I tillegg» is an adverb, so inversion is needed.");
g("bind","Hvilket uttrykk passer best i en avslutning?","Which phrase fits best in a conclusion?","Alt i alt",["For eksempel","På den ene siden"]);
g("bind","«Mange kjører bil til jobben, ___ fordi bussen går sjelden.»","«Many drive to work, ___ because the bus is infrequent.»","blant annet",["derimot","likevel"]);
g("bind","«På den ene siden er det dyrt å bo i byen. ___ er det kort vei til alt.»","«On the one hand, the city is expensive. ___ everything is close by.»","På den andre siden",["Til slutt","For det første"]);
g("bind","«Først leste jeg oppgaven nøye. ___ skrev jeg en plan.»","«First I read the task carefully. ___ I wrote a plan.»","Deretter",["Derimot","Dessuten"]);
g("bind","«Hun har bodd her i ti år, ___ hun snakker flytende norsk.»","«She has lived here for ten years, ___ she speaks fluent Norwegian.»","så",["men","selv om"]);
g("bind","Hvilket ord betyr omtrent det samme som «imidlertid»?","Which word means roughly the same as «imidlertid»?","likevel / men",["derfor","dessuten"]);
g("bind","«Vi må kutte utslippene ___ klimaet ikke skal bli verre.»","«We must cut emissions ___ the climate won't get worse.»","for at",["for å","derfor"],"«for at» + setning med eget subjekt (klimaet).","«for at» + a clause with its own subject.");
g("bind","«Jeg vil gjerne jobbe deltid. ___ har jeg ikke råd til det.»","«I'd like to work part-time. ___ I can't afford it.»","Dessverre",["Fordi","Selv om"]);
g("bind","«Det er sunt å sykle. ___ er det bra for miljøet.»","«Cycling is healthy. ___ it's good for the environment.»","I tillegg",["Selv om","Derimot"]);

/* verb og tid */
g("verb","«I fjor ___ vi til Italia på ferie.»","«Last year we ___ to Italy on holiday.»","dro",["har dratt","drar"],"«I fjor» er avsluttet tid → preteritum.","«I fjor» is finished time → past tense.");
g("verb","«Jeg ___ i Norge i fem år nå.»","«I ___ in Norway for five years now.»","har bodd",["bodde","bor"],"Noe som startet før og fortsatt gjelder → perfektum.","Something that started before and still continues → present perfect.");
g("verb","«Har du noen gang ___ reinsdyrkjøtt?»","«Have you ever ___ reindeer meat?»","smakt",["smakte","smake"]);
g("verb","Hva er preteritum av «gå»?","What is the past tense of «gå» (go)?","gikk",["gådde","gått"]);
g("verb","skrive – skrev – har ___","write – wrote – have ___","skrevet",["skrivd","skrevd"]);
g("verb","«Hun ___ meg om hjelp i går.»","«She ___ me for help yesterday.»","spurte",["spørte","spurt"],"spørre – spurte – har spurt","ask – asked – have asked");
g("verb","«Da jeg kom til stasjonen, ___ toget allerede gått.»","«When I got to the station, the train ___ already left.»","hadde",["har","var"],"Noe som skjedde før noe annet i fortiden → pluskvamperfektum (hadde + gått).","Before something else in the past → past perfect.");
g("verb","«Du må ___ legen hvis feberen ikke går over.»","«You must ___ the doctor if the fever doesn't go away.»","ringe",["å ringe","ringer"],"Etter modalverb (må) kommer infinitiv uten «å».","After a modal verb: infinitive without «å».");
g("verb","«Jeg prøver ___ snakke norsk hver dag.»","«I try ___ speak Norwegian every day.»","å",["og","(ingenting)"]);
g("verb","«Hvis jeg hadde mer tid, ___ jeg lære meg å spille gitar.»","«If I had more time, I ___ learn to play the guitar.»","ville",["vil","skal"],"Tenkt situasjon: «hvis jeg hadde …, ville jeg …».","Hypothetical: «if I had …, I would …».");
g("verb","«Hvis du hadde sagt fra, ___ jeg hjulpet deg.»","«If you had told me, I ___ helped you.»","hadde",["har","ble"],"Tenkt fortid: «hadde … hadde» eller «hadde … ville ha».","Hypothetical past: «hadde … hadde» or «hadde … ville ha».");
gs("verb","Vi har kjent hverandre siden 2019.",["Vi kjenner hverandre siden 2019.","Vi kjente hverandre siden 2019."],"«siden» + tidspunkt fram til nå → perfektum.","«since» + a point in time up to now → present perfect.");
g("verb","gjøre – gjorde – har ___","do – did – have ___","gjort",["gjørt","gjordet"]);
g("verb","«Han har ___ i sofaen hele dagen.»","«He has ___ on the sofa all day.»","ligget",["lagt","ligt"],"ligge – lå – har ligget. (lagt kommer av «legge».)","lie – lay – have lain. (lagt is from «legge», to lay.)");
g("verb","«Jeg ___ ikke at du var syk.»","«I didn't ___ you were ill.»","visste",["viste","vitet"],"vite – visste – har visst. «viste» kommer av «vise» (show).","vite – visste – har visst. «viste» is from «vise» (show).");
g("verb","Hvilken setning er en spådom (noe du tror kommer til å skje)?","Which sentence is a prediction?","Det kommer til å bli kaldt i morgen.",["Jeg skal ringe deg i morgen.","Jeg vil gjerne ha en kaffe."],"«kommer til å» = spådom. «skal» = plan. «vil» = ønske.","«kommer til å» = prediction, «skal» = plan, «vil» = wish.");
g("verb","«Etter at vi ___ middag, gikk vi en tur.»","«After we ___ dinner, we went for a walk.»","hadde spist",["har spist","spiser"]);
g("verb","selge – ___ – har solgt","sell – ___ – have sold","solgte",["selgte","salg"]);
g("verb","«Hun ___ seg for å søke på jobben.»","«She ___ to apply for the job.»","bestemte",["bestemt","bestemmet"]);
g("verb","«Barna har ___ hele natta.»","«The children have ___ all night.»","sovet",["sovt","sov"],"sove – sov – har sovet","sleep – slept – have slept");
gs("verb","Jeg liker å gå tur i skogen.",["Jeg liker gå tur i skogen.","Jeg liker og gå tur i skogen."],"«liker» er ikke et modalverb, så det trenger «å».","«liker» isn't a modal verb, so it needs «å».");

/* passiv */
g("pass","«Huset ___ bygget i 1952.»","«The house ___ built in 1952.»","ble",["fikk","gjorde"],"bli-passiv: ble + perfektum partisipp.","bli passive: ble + past participle.");
g("pass","Gjør om til passiv: «Kommunen stenger biblioteket.»","Make it passive: «The council is closing the library.»","Biblioteket blir stengt av kommunen.",["Biblioteket stenger kommunen.","Biblioteket har stengt av kommunen."]);
g("pass","«Søknaden må ___ innen 1. mars.»","«The application must ___ by 1 March.»","sendes",["sende","sendt"],"Modalverb + s-passiv.","Modal verb + -s passive.");
g("pass","Hvilket verb er IKKE passiv selv om det ender på -s?","Which verb is NOT passive even though it ends in -s?","trives",["selges","males"],"«trives» betyr å ha det bra. Det er et aktivt s-verb.","«trives» (to thrive, feel at home) is an active -s verb.");
g("pass","«Vi ___ veldig godt i den nye leiligheten.»","«We ___ very happy in the new flat.»","trives",["triver","trivs"]);
g("pass","«Jeg ___ det er en god idé.»","«I ___ it's a good idea.»","synes",["syner","synet"]);
g("pass","«Billetter ___ i resepsjonen.»","«Tickets ___ at reception.»","selges",["selger","solgt"]);
g("pass","Gjør om til aktiv: «Pasienten ble undersøkt av legen.»","Make it active: «The patient was examined by the doctor.»","Legen undersøkte pasienten.",["Pasienten undersøkte legen.","Legen ble undersøkt pasienten."]);
g("pass","«Vi ___ på stasjonen klokka åtte.» (= vi møter hverandre)","«We ___ at the station at eight.» (= meet each other)","møtes",["møter","møtte oss"]);
g("pass","«Saken har ___ diskutert i mange år.»","«The matter has ___ discussed for many years.»","blitt",["blir","bli"]);
g("pass","«Det ___ mange forskjellige språk i Oslo.»","«Many different languages ___ in Oslo.»","snakkes",["snakker","snakk"]);
g("pass","Hvilken setning passer best i en formell beskjed?","Which sentence fits best in a formal notice?","Biler som står parkert her, vil bli fjernet.",["Vi tauer bort bilen din hvis du parkerer her, altså!","Ikke parker her, da!"],"Passiv er vanlig i formelle tekster.","The passive is common in formal texts.");
g("pass","«Det ___ ikke noe melk igjen i kjøleskapet.»","«There ___ no milk left in the fridge.»","finnes",["finner","fant seg"],"«det finnes/fins» = det er, det eksisterer.","«det finnes» = there is/are.");
g("pass","«Jeg håper at du ___ med eksamen!»","«I hope you ___ in the exam!»","lykkes",["lykker","lykke"]);

/* substantiv og adjektiv */
g("adj","«Vi har kjøpt et ___ hus.» (stor)","«We've bought a ___ house.» (big)","stort",["stor","store"],"Intetkjønn (et) → -t.","Neuter (et) → -t.");
g("adj","«Det ___ huset på hjørnet er solgt.» (gammel)","«The ___ house on the corner is sold.» (old)","gamle",["gammel","gammelt"],"Bestemt form → -e. «gammel» blir «gamle».","Definite form → -e. «gammel» becomes «gamle».");
g("adj","«De har tre ___ barn.» (liten)","«They have three ___ children.» (small)","små",["lille","liten"],"Flertall av «liten» er «små».","The plural of «liten» is «små».");
g("adj","«Det var et ___ møte.» (viktig)","«It was an ___ meeting.» (important)","viktig",["viktigt","viktige"],"Adjektiv på -ig får ikke -t.","Adjectives in -ig don't take -t.");
g("adj","«Hun har på seg en ___ genser og et ___ skjerf.» (blå)","«She is wearing a ___ jumper and a ___ scarf.» (blue)","blå … blått",["blått … blå","blå … blå"]);
g("adj","Komparativ av «god»:","Comparative of «god» (good):","bedre",["godere","mer god"]);
g("adj","«Oslo er ___ enn Bergen.» (stor)","«Oslo is ___ than Bergen.» (big)","større",["storere","mer stor"]);
g("adj","«Det var den ___ dagen i hele året.» (varm)","«It was the ___ day of the whole year.» (warm)","varmeste",["varmest","varmere"],"Bestemt superlativ: den + -este.","Definite superlative: den + -este.");
g("adj","«Han er to år ___ enn broren sin.» (gammel)","«He is two years ___ than his brother.» (old)","eldre",["gamlere","eldst"]);
g("adj","«Det var ___ mennesker på konserten.»","«There were ___ people at the concert.»","mange",["mye","meget"],"«mange» med ting du kan telle.","«mange» with things you can count.");
g("adj","«Jeg har ikke ___ tid i dag.»","«I don't have ___ time today.»","mye",["mange","flere"],"«mye» med ting du ikke kan telle.","«mye» with things you can't count.");
g("adj","Ubestemt flertall av «en bok»:","Indefinite plural of «en bok» (a book):","bøker",["boker","bokene"]);
g("adj","Ubestemt flertall av «en mann»:","Indefinite plural of «en mann» (a man):","menn",["manner","mannene"]);
g("adj","«Min ___ bil er elektrisk.» (ny)","«My ___ car is electric.» (new)","nye",["ny","nytt"],"Etter eiendomsord foran substantivet → -e.","After a possessive in front of the noun → -e.");
g("adj","«Det var et ___ valg.» (praktisk)","«It was a ___ choice.» (practical)","praktisk",["praktiskt","praktiske"],"Adjektiv på -isk får ikke -t.","Adjectives in -isk don't take -t.");
g("adj","«Bussen var ___ forsinket enn i går.»","«The bus was ___ late than yesterday.»","mer",["mye","flere"]);
g("adj","«Det er ___ og ___ folk som jobber hjemmefra.»","«___ and ___ people work from home.»","flere … flere",["mer … mer","mange … mange"],"«flere og flere» = more and more (tellbart).","«flere og flere» = more and more (countable).");
g("adj","Ubestemt flertall av «en bror»:","Indefinite plural of «en bror» (a brother):","brødre",["brorer","brødrer"]);

/* pronomen */
g("pron","«Jens vasket bilen ___ i går.» (bilen til Jens)","«Jens washed ___ car yesterday.» (Jens's own car)","sin",["hans","seg"],"«sin» peker tilbake på subjektet (Jens).","«sin» refers back to the subject (Jens).");
g("pron","«Kari og mannen ___ har flyttet til Tromsø.»","«Kari and ___ husband have moved to Tromsø.»","hennes",["sin","seg"],"«sin» kan ikke være en del av subjektet.","«sin» can't be part of the subject.");
g("pron","«Ola ringte Per, men telefonen ___ var avslått.» (Pers telefon)","«Ola called Per, but ___ phone was off.» (Per's phone)","hans",["sin","seg"],"«telefonen» er subjekt i den nye setningen, så vi kan ikke bruke «sin».","«telefonen» is the subject of the new clause, so «sin» is impossible.");
g("pron","«Vi gleder ___ til sommerferien.»","«We're looking forward to the summer holiday.»","oss",["seg","vi"]);
g("pron","«Barna kledde på ___ selv.»","«The children dressed themselves.»","seg",["dem","sine"]);
g("pron","«Jeg så ___ på bussen i går.» (de)","«I saw ___ on the bus yesterday.» (they)","dem",["de","deres"],"Objektform: dem.","Object form: dem.");
g("pron","«___ bor i en stor leilighet i sentrum.» (de)","«___ live in a big flat in the centre.» (they)","De",["Dem","Deres"],"Subjektform: de.","Subject form: de.");
g("pron","«Har du sett nøklene ___?»","«Have you seen ___ keys?» (my)","mine",["min","mitt"]);
g("pron","«Huset ___ er rødt.»","«___ house is red.» (our)","vårt",["vår","våre"]);
g("pron","«Jeg har en ny sofa. ___ er veldig god å sitte i.»","«I have a new sofa. ___ is very comfortable.»","Den",["Det","Han"],"«en sofa» → den.","«en sofa» → den.");
gs("pron","Jeg har ikke sett noen.",["Jeg har sett ingen.","Jeg ikke har sett noen."],"Med sammensatt verb: «ikke … noen», ikke «ingen».","With a compound verb: «ikke … noen», not «ingen».");
g("pron","«___ er viktig å sove nok.»","«___ is important to sleep enough.»","Det",["Den","Han"]);
g("pron","«De hjelper ___ med leksene.» (each other)","«They help ___ with their homework.» (each other)","hverandre",["seg","dem selv"]);
g("pron","«Lena glemte vesken ___ på trikken.»","«Lena forgot ___ bag on the tram.»","sin",["hennes","seg"]);
g("pron","«Hun føler ___ ikke helt bra i dag.»","«She doesn't feel quite well today.»","seg",["henne","sin"]);
g("pron","«Mange har bestemt ___ for å flytte.»","«Many have decided to move.»","seg",["dem","sin"]);
g("pron","«Foreldrene lot barna ___ bestemme selv.»","«The parents let ___ children decide for themselves.»","sine",["deres","seg"],"«sine» peker tilbake på subjektet «foreldrene».","«sine» refers back to the subject «foreldrene».");

/* preposisjoner */
g("prep","«Hun er veldig interessert ___ historie.»","«She is very interested ___ history.»","i",["på","for"]);
g("prep","«Han er flink ___ å lage mat.»","«He is good ___ cooking.»","til",["i","på"]);
g("prep","«Barna er veldig glad ___ bestemoren sin.»","«The children are very fond ___ their grandmother.»","i",["på","om"]);
g("prep","«Vi venter ___ bussen.»","«We're waiting ___ the bus.»","på",["for","til"]);
g("prep","«Jeg gleder meg ___ ferien.»","«I'm looking forward ___ the holiday.»","til",["på","for"]);
g("prep","«Hun er redd ___ hunder.»","«She is afraid ___ dogs.»","for",["av","på"]);
g("prep","«Jeg er lei ___ regnet.»","«I'm tired ___ the rain.»","av",["på","med"]);
g("prep","«Jeg er enig ___ deg.»","«I agree ___ you.»","med",["i","på"],"enig med (en person), enig i (en sak).","agree with (a person) = med; with (a thing) = i.");
g("prep","«Jeg er enig ___ det du sier.»","«I agree ___ what you say.»","i",["med","om"],"enig i (en sak).","enig i (with a thing/opinion).");
g("prep","«Vi flyttet hit ___ tre år siden.»","«We moved here three years ago.»","for",["i","om"]);
g("prep","«Toget går ___ ti minutter.»","«The train leaves ___ ten minutes.»","om",["i","på"],"«om» + tid = fram i tid.","«om» + time = in (the future).");
g("prep","«Jeg har bodd her ___ to år.»","«I have lived here ___ two years.»","i",["for","på"],"Hvor lenge: «i» (ikke «for» som på engelsk).","How long: «i» (not «for» as in English).");
g("prep","«Vi trener ___ tirsdager.»","«We train ___ Tuesdays.»","på",["i","om"]);
g("prep","«Han jobber ___ et sykehus.»","«He works ___ a hospital.»","på",["til","hos"]);
g("prep","«Jeg har time ___ tannlegen i morgen.»","«I have an appointment ___ the dentist's tomorrow.»","hos",["av","med"]);
g("prep","«Jeg skal reise ___ i kveld.»","«I'm going ___ tonight.»","hjem",["hjemme","hjemmet"],"Retning → hjem.","Direction → hjem.");
g("prep","«Er du ___ nå?»","«Are you ___ now?»","hjemme",["hjem","hjemmen"],"Sted → hjemme.","Place → hjemme.");
g("prep","«Han søkte ___ jobben som sykepleier.»","«He applied ___ the nursing job.»","på",["om","til"],"søke på en jobb, søke om permisjon.","søke på = apply for a job, søke om = apply for permission/leave.");
g("prep","«Kan du passe ___ katten mens vi er bortreist?»","«Can you look after the cat while we're away?»","på",["til","om"]);
g("prep","«Jeg har ikke råd ___ ny bil.»","«I can't afford a new car.»","til",["for","på"]);
g("prep","«Mange er avhengige ___ bilen.»","«Many are dependent ___ the car.»","av",["på","til"]);
g("prep","«Vi må finne en løsning ___ problemet.»","«We must find a solution ___ the problem.»","på",["av","om"]);
g("prep","«Hun er veldig opptatt ___ miljøet.»","«She is very concerned ___ the environment.»","av",["i","om"],"«opptatt av» = engasjert i. «opptatt med» = holder på med.","«opptatt av» = concerned about. «opptatt med» = busy with.");
g("prep","«Det har ført ___ store problemer.»","«It has led ___ big problems.»","til",["på","for"]);
g("prep","«Jeg bryr meg ikke ___ hva andre tenker.»","«I don't care ___ what others think.»","om",["på","for"]);
g("prep","«Søknaden må være sendt ___ fredag.»","«The application must be sent ___ Friday.»","innen",["om","i"],"«innen» = senest (frist).","«innen» = by (deadline).");

/* rettskriving og komma */
g("skr","«Jeg liker ___ gå tur i skogen.»","«I like ___ walk in the forest.»","å",["og"],"Foran infinitiv: «å».","Before an infinitive: «å».");
g("skr","«Vi kjøpte brød ___ melk.»","«We bought bread ___ milk.»","og",["å"]);
g("skr","«Det er viktig ___ sove nok ___ spise sunt.»","«It's important ___ sleep enough ___ eat healthily.»","å … og å",["og … å","å … og og"]);
g("skr","Hvor skal kommaet stå?","Where does the comma go?","Når vi kommer fram, ringer jeg deg.",["Når vi kommer, fram ringer jeg deg.","Når vi kommer fram ringer, jeg deg."],"Komma etter leddsetningen.","Comma after the subordinate clause.");
gs("skr","Jeg tror at det blir regn i morgen.",["Jeg tror, at det blir regn i morgen.","Jeg tror at, det blir regn i morgen."],"Ikke komma foran «at».","No comma before «at».");
gs("skr","Hun ville komme, men hun var syk.",["Hun ville komme men, hun var syk.","Hun ville, komme men hun var syk."]);
gs("skr","Jeg snakker norsk og engelsk.",["Jeg snakker Norsk og Engelsk.","Jeg snakker norsk og Engelsk."],"Språk skrives med liten forbokstav.","Languages are written in lowercase.");
gs("skr","Vi reiser til Spania i juli.",["Vi reiser til spania i Juli.","Vi reiser til Spania i Juli."],"Land med stor forbokstav, måneder med liten.","Countries capitalised, months lowercase.");
g("skr","Hvilket ord er skrevet riktig?","Which word is spelt correctly?","arbeidsplass",["arbeids plass","arbeids-plass"],"Sammensatte ord skrives i ett.","Compound words are written as one word.");
g("skr","Hva er forskjellen på «røykfritt» og «røyk fritt»?","What's the difference between «røykfritt» and «røyk fritt»?","«Røykfritt» = ingen røyking. «Røyk fritt» = du kan røyke så mye du vil.",["Ingen forskjell.","«Røyk fritt» er nynorsk."]);
g("skr","«Vi ___ hjem sent i går.»","«We ___ home late yesterday.»","kom",["komm","kommet"],"Ingen ord slutter på -mm.","No word ends in -mm.");
gs("skr","Jeg lagde middag, og han vasket opp.",["Jeg lagde middag og, han vasket opp.","Jeg lagde, middag og han vasket opp."],"Komma foran «og» mellom to hele setninger.","Comma before «og» between two full clauses.");
gs("skr","Boka som jeg lånte av deg, var veldig god.",["Boka, som jeg lånte av deg var veldig god.","Boka som jeg lånte, av deg var veldig god."],"Komma etter den innskutte leddsetningen.","Comma after the inserted subordinate clause.");
g("skr","«Jeg har bare ___ barn.» (tallet 1)","«I only have ___ child.» (the number 1)","ett",["et","eet"],"«ett» = tallet. «et» = artikkelen.","«ett» = the number, «et» = the article.");
g("skr","«Jeg begynte ___ studere ___ jobbe samtidig.»","«I started ___ study ___ work at the same time.»","å … og",["og … å","og … og"]);
gs("skr","Vi ses på mandag!",["Vi ses på Mandag!","Vi ses på mandag !"]);

/* ord som ofte blandes */
g("ordf","«Jeg ___ ikke hvor hun bor.»","«I don't ___ where she lives.»","vet",["kjenner","kan"],"vite = ha informasjon.","vite = know a fact.");
g("ordf","«Jeg ___ ham fra jobben.»","«I ___ him from work.»","kjenner",["vet","kan"],"kjenne = kjenne en person.","kjenne = know a person.");
g("ordf","«___ du svømme?»","«___ you swim?»","Kan",["Vet","Kjenner"]);
g("ordf","«Kan du ___ nøklene på bordet?»","«Can you ___ the keys on the table?»","legge",["ligge","lege"],"legge = plassere noe.","legge = put something down.");
g("ordf","«Telefonen ___ på kjøkkenet.»","«The phone ___ in the kitchen.»","ligger",["legger","legges"],"ligge = være et sted.","ligge = be lying somewhere.");
g("ordf","«Vi ___ i sofaen og så på TV.»","«We ___ on the sofa and watched TV.»","satt",["satte","sette"],"sitte – satt.","sitte (sit) – satt.");
g("ordf","«___ deg ned, er du snill.»","«___ down, please.»","Sett",["Sitt","Sitte"],"sette seg = gå fra stående til sittende.","sette seg = sit down (the movement).");
g("ordf","«Hun ___ blomstene på bordet.»","«She ___ the flowers on the table.»","satte",["satt","sitter"],"sette – satte – har satt.","sette (put) – satte – har satt.");
g("ordf","«Det ___ kaldere og kaldere utover høsten.»","«It ___ colder and colder through the autumn.»","blir",["er","har"],"bli = forandring.","bli = change (become).");
g("ordf","«Hun ___ medisin ved universitetet.»","«She ___ medicine at university.»","studerer",["lærer","lærer seg"]);
g("ordf","«Læreren ___ oss mye om norsk historie.»","«The teacher ___ us a lot about Norwegian history.»","lærte",["studerte","lærte seg"],"lære noen noe = teach.","lære noen noe = teach someone something.");
g("ordf","«Kan jeg få ___ mer kaffe?»","«Can I have ___ more coffee?»","litt",["liten","lite"]);
g("ordf","«Jeg liker ikke kaffe.» – «Ikke jeg ___.»","«I don't like coffee.» – «Me ___.»","heller",["også","ikke"],"I nektende setninger: «heller», ikke «også».","In negative sentences: «heller» (neither).");
g("ordf","«Jeg ___ at filmen var kjedelig.» (min mening)","«I ___ the film was boring.» (my opinion)","syntes",["trodde","tenkte"],"synes = mening etter erfaring.","synes = opinion from experience.");
g("ordf","«Jeg ___ toget går klokka åtte, men jeg er ikke sikker.»","«I ___ the train leaves at eight, but I'm not sure.»","tror",["synes","tenker"],"tro = mene uten å vite sikkert.","tro = believe without being sure.");
g("ordf","«Hun sitter og ___ på ferien.»","«She sits ___ about the holiday.»","tenker",["tror","synes"]);
g("ordf","«Kan jeg ___ sykkelen din i dag?»","«Can I ___ your bike today?»","låne",["låne ut","lånt"]);
g("ordf","«Det kom ___ folk, så festen ble litt kjedelig.»","«___ people came, so the party was a bit dull.»","få",["mange","litt"]);

/* ---------- Word cards (Ord tab). Each card: [norsk, English, example sentence] ---------- */
const DECKS = [
  {id:"kon",nb:"Bindeord",en:"Linking words"},
  {id:"men",nb:"Mening og argumenter",en:"Opinions and arguments"},
  {id:"fas",nb:"Faste uttrykk",en:"Fixed phrases"},
  {id:"ver",nb:"Nyttige verb",en:"Useful verbs"},
  {id:"arb",nb:"Arbeid og økonomi",en:"Work and money"},
  {id:"hel",nb:"Helse og velferd",en:"Health and welfare"},
  {id:"sam",nb:"Samfunn",en:"Society"},
  {id:"mil",nb:"Miljø og klima",en:"Environment and climate"},
  {id:"bol",nb:"Bolig og hverdag",en:"Home and everyday life"},
  {id:"utd",nb:"Skole og utdanning",en:"School and education"}
];
const WORDS = {
kon:[
  ["dessuten","moreover, besides","Leiligheten er billig. Dessuten ligger den sentralt."],
  ["i tillegg","in addition","I tillegg må vi betale strøm."],
  ["likevel","nevertheless, still","Det regnet, men vi gikk likevel."],
  ["derimot","on the other hand, in contrast","Jeg liker sommer. Broren min, derimot, elsker vinter."],
  ["imidlertid","however","Planen er god. Den er imidlertid dyr."],
  ["derfor","therefore, that's why","Jeg var syk. Derfor ble jeg hjemme."],
  ["dermed","thus, so","Bussen ble innstilt, og dermed kom vi for sent."],
  ["følgelig","consequently","Prisene steg, og følgelig handlet folk mindre."],
  ["ettersom","as, since","Ettersom det var sent, tok vi taxi."],
  ["siden","since, because","Siden du er her, kan du hjelpe meg."],
  ["selv om","even though","Selv om det var kaldt, badet vi."],
  ["til tross for","despite","Til tross for regnet kom mange."],
  ["på grunn av","because of","Toget var forsinket på grunn av snø."],
  ["blant annet","among other things","Vi snakket blant annet om skolen."],
  ["med andre ord","in other words","Med andre ord: vi må spare."],
  ["kort sagt","in short","Kort sagt var det en fin tur."],
  ["alt i alt","all in all","Alt i alt er jeg fornøyd."],
  ["først og fremst","first and foremost","Først og fremst handler det om helse."],
  ["for det første","firstly","For det første er det dyrt."],
  ["avslutningsvis","in conclusion","Avslutningsvis vil jeg si at …"],
  ["samtidig","at the same time","Samtidig må vi tenke på miljøet."],
  ["uansett","anyway, regardless","Vi drar uansett vær."],
  ["i stedet for","instead of","Ta sykkelen i stedet for bilen."],
  ["ifølge","according to","Ifølge legen må jeg hvile."],
  ["på den ene siden … på den andre siden","on the one hand … on the other hand","På den ene siden er det praktisk, på den andre siden er det dyrt."]
],
men:[
  ["etter min mening","in my opinion","Etter min mening bør skolen begynne senere."],
  ["slik jeg ser det","as I see it","Slik jeg ser det, er dette et stort problem."],
  ["jeg er overbevist om at","I'm convinced that","Jeg er overbevist om at det vil lønne seg."],
  ["et argument for / mot","an argument for / against","Et viktig argument mot forslaget er prisen."],
  ["en fordel / en ulempe","an advantage / a disadvantage","En fordel med å bo i byen er kort vei til jobb."],
  ["å hevde","to claim","Noen hevder at det er for dyrt."],
  ["en påstand","a claim, a statement","Jeg er ikke enig i den påstanden."],
  ["å begrunne","to justify, give reasons for","Du må begrunne meningen din."],
  ["et synspunkt","a point of view","Jeg forstår synspunktet ditt."],
  ["delvis enig","partly agree","Jeg er delvis enig med deg."],
  ["å tvile på","to doubt","Jeg tviler på at det vil fungere."],
  ["det kommer an på","it depends on","Det kommer an på hvor mye det koster."],
  ["på sikt","in the long run","På sikt vil vi spare penger."],
  ["en konsekvens","a consequence","Hva blir konsekvensene for barna?"],
  ["en problemstilling","an issue, a question to discuss","Dette er en viktig problemstilling."],
  ["å drøfte","to discuss (pros and cons)","I teksten skal jeg drøfte fordeler og ulemper."],
  ["tross alt","after all","Det er tross alt bare penger."],
  ["det er ingen tvil om at","there is no doubt that","Det er ingen tvil om at vi må gjøre noe."],
  ["det er verdt å nevne at","it's worth mentioning that","Det er verdt å nevne at mange er uenige."],
  ["å legge vekt på","to emphasise","Jeg legger vekt på trivsel."]
],
fas:[
  ["interessert i","interested in","Hun er interessert i politikk."],
  ["opptatt av","concerned with, keen on","Han er opptatt av miljøet."],
  ["avhengig av","dependent on","Mange er avhengige av bilen."],
  ["flink til","good at","Hun er flink til å tegne."],
  ["redd for","afraid of","Barnet er redd for mørket."],
  ["lei av","tired of","Jeg er lei av regnet."],
  ["fornøyd med","happy with","Vi er fornøyde med leiligheten."],
  ["vant til","used to","Jeg er ikke vant til snø."],
  ["bekymret for","worried about","Hun er bekymret for sønnen sin."],
  ["glede seg til","look forward to","Vi gleder oss til ferien."],
  ["bry seg om","care about","Han bryr seg om andre."],
  ["klage på","complain about","Naboen klaget på støyen."],
  ["delta i","take part in","Alle kan delta i dugnaden."],
  ["søke på / søke om","apply for (a job) / apply for (permission)","Jeg søkte på jobben og om permisjon."],
  ["lete etter","look for","Jeg leter etter nøklene."],
  ["ta vare på","take care of","Vi må ta vare på naturen."],
  ["ha råd til","afford","Vi har ikke råd til ny bil."],
  ["legge merke til","notice","Jeg la merke til at hun var lei seg."],
  ["sette pris på","appreciate","Jeg setter pris på hjelpen din."],
  ["ta seg av","take care of, deal with","Kan du ta deg av saken?"],
  ["gi opp","give up","Ikke gi opp!"],
  ["være enig med / i","agree with (someone / something)","Jeg er enig med deg i det."],
  ["ha lyst på / til å","fancy (something) / want to (do)","Jeg har lyst på kaffe. Jeg har lyst til å reise."],
  ["tenke på","think about","Jeg tenker ofte på familien min."],
  ["passe på","look after, watch out","Pass på barna!"]
],
ver:[
  ["å påvirke","to influence","Været påvirker humøret mitt."],
  ["å bidra (til)","to contribute (to)","Alle må bidra."],
  ["å oppnå","to achieve","Hva vil du oppnå?"],
  ["å redusere","to reduce","Vi må redusere utslippene."],
  ["å øke","to increase","Prisene har økt mye."],
  ["å unngå","to avoid","Prøv å unngå sukker."],
  ["å forbedre","to improve","Jeg vil forbedre norsken min."],
  ["å foretrekke","to prefer","Jeg foretrekker te framfor kaffe."],
  ["å innføre","to introduce (a rule)","Skolen innførte mobilforbud."],
  ["å avskaffe","to abolish","De vil avskaffe ordningen."],
  ["å prioritere","to prioritise","Vi må prioritere de eldre."],
  ["å satse på","to invest in, focus on","Kommunen satser på kollektivtransport."],
  ["å ta hensyn til","to take into account","Vi må ta hensyn til naboene."],
  ["å gå ut over","to affect (negatively)","Kuttene går ut over barna."],
  ["å føre til","to lead to","Det kan føre til problemer."],
  ["å skyldes","to be due to","Forsinkelsen skyldes snø."],
  ["å utgjøre","to make up, constitute","Kvinner utgjør halvparten."],
  ["å oppleve","to experience","Jeg har opplevd mye her."],
  ["å vurdere","to consider, assess","Vi vurderer å flytte."],
  ["å sammenligne","to compare","Det er vanskelig å sammenligne."],
  ["å mangle","to lack, be missing","Det mangler lærere."],
  ["å tilby","to offer","Kommunen tilbyr gratis kurs."],
  ["å kreve","to demand, require","Jobben krever erfaring."],
  ["å utvikle","to develop","Byen har utviklet seg mye."]
],
arb:[
  ["en arbeidsgiver","an employer","Arbeidsgiveren betaler lønn."],
  ["en arbeidstaker / en ansatt","an employee","Firmaet har 50 ansatte."],
  ["en stilling","a position, a job","Jeg søkte på en stilling som renholder."],
  ["en søknad","an application","Søknaden må sendes innen fredag."],
  ["en attest","a reference letter","Jeg fikk en god attest."],
  ["arbeidsledig","unemployed","Han har vært arbeidsledig i et år."],
  ["permittert","temporarily laid off","Mange ble permittert under pandemien."],
  ["en oppsigelse","a dismissal, a resignation","Hun leverte oppsigelsen sin."],
  ["sykmeldt","on sick leave","Han er sykmeldt i to uker."],
  ["heltid / deltid","full-time / part-time","Jeg jobber deltid."],
  ["en turnus","a shift rota","Sykepleiere jobber turnus."],
  ["en lønn","a salary, wages","Lønna kommer den 20."],
  ["en skatt","a tax","Vi betaler skatt av inntekten."],
  ["en inntekt / en utgift","income / an expense","Utgiftene er større enn inntektene."],
  ["et budsjett","a budget","Vi må lage et budsjett."],
  ["en pensjon","a pension","Han går av med pensjon neste år."],
  ["en fagforening","a trade union","Hun er medlem av en fagforening."],
  ["overtid","overtime","Jeg jobbet overtid i går."],
  ["en prøvetid","a probation period","Det er seks måneders prøvetid."],
  ["et arbeidsmiljø","a working environment","Vi har et godt arbeidsmiljø."]
],
hel:[
  ["en fastlege","a regular GP","Ring fastlegen din."],
  ["legevakt","emergency doctor (out of hours)","Om natta må du ringe legevakt."],
  ["en resept","a prescription","Legen skrev ut en resept."],
  ["en henvisning","a referral","Du trenger henvisning til spesialist."],
  ["en egenandel","a patient fee, co-payment","Du må betale egenandel hos legen."],
  ["en behandling","a treatment","Behandlingen tar tre uker."],
  ["et symptom","a symptom","Hvilke symptomer har du?"],
  ["å smitte","to infect","Influensa smitter lett."],
  ["en sykdom","an illness, a disease","Det er en vanlig sykdom."],
  ["å forebygge","to prevent","Trening forebygger sykdom."],
  ["folkehelse","public health","Kommunen jobber med folkehelse."],
  ["psykisk helse","mental health","Psykisk helse er like viktig som fysisk."],
  ["en trygd","a social security benefit","Han lever av trygd."],
  ["foreldrepermisjon","parental leave","Hun har foreldrepermisjon."],
  ["eldreomsorg","care for the elderly","Eldreomsorgen trenger flere ansatte."],
  ["et sykehjem","a nursing home","Bestefar bor på sykehjem."],
  ["hjemmetjenesten","home care service","Hjemmetjenesten kommer hver morgen."],
  ["et frikort","a fee exemption card","Med frikort betaler du ikke egenandel."]
],
sam:[
  ["en kommune","a municipality","Kommunen har ansvar for skolene."],
  ["et fylke","a county","Hvilket fylke bor du i?"],
  ["Stortinget","the Norwegian parliament","Stortinget vedtar lovene."],
  ["en regjering","a government","Regjeringen la fram budsjettet."],
  ["et valg","an election; a choice","Det er valg i september."],
  ["å stemme","to vote","Hvem skal du stemme på?"],
  ["likestilling","equality (gender)","Norge er kjent for likestilling."],
  ["ytringsfrihet","freedom of speech","Ytringsfrihet er viktig i et demokrati."],
  ["en innbygger","a resident, inhabitant","Byen har 100 000 innbyggere."],
  ["en rettighet / en plikt","a right / a duty","Vi har både rettigheter og plikter."],
  ["frivillig","voluntary, a volunteer","Hun jobber frivillig i Røde Kors."],
  ["en dugnad","voluntary community work","Det er dugnad i borettslaget."],
  ["integrering","integration","Arbeid er viktig for integrering."],
  ["mangfold","diversity","Byen har stort kulturelt mangfold."],
  ["en fordom","a prejudice","Vi må bekjempe fordommer."],
  ["velferdsstaten","the welfare state","Velferdsstaten koster mye penger."],
  ["en lov","a law","Det er mot loven."],
  ["et samfunn","a society","Vi lever i et digitalt samfunn."]
],
mil:[
  ["et utslipp","an emission","Utslippene må ned."],
  ["klimaendringer","climate change","Klimaendringene påvirker alle."],
  ["fornybar energi","renewable energy","Vannkraft er fornybar energi."],
  ["gjenvinning","recycling","Glass går til gjenvinning."],
  ["kildesortering","waste sorting","Vi kildesorterer plast og papir."],
  ["bærekraftig","sustainable","Vi må leve mer bærekraftig."],
  ["forurensning","pollution","Det er mye forurensning i byen."],
  ["kollektivtransport","public transport","Ta kollektivtransport til jobb."],
  ["en elbil","an electric car","Mange i Norge kjører elbil."],
  ["avfall","waste","Matavfall går i den grønne posen."],
  ["matsvinn","food waste","Vi kaster for mye mat. Matsvinn er et problem."],
  ["et forbruk","consumption","Forbruket vårt er for høyt."],
  ["en ressurs","a resource","Vann er en viktig ressurs."],
  ["miljøvennlig","environmentally friendly","Sykkel er miljøvennlig."],
  ["et naturinngrep","an intervention in nature","Nye veier er store naturinngrep."]
],
bol:[
  ["en leilighet","a flat, an apartment","Vi bor i en treroms leilighet."],
  ["en enebolig / et rekkehus","a detached house / a terraced house","De kjøpte et rekkehus."],
  ["et borettslag","a housing cooperative","Borettslaget har et styre."],
  ["husleie","rent","Husleia er 12 000 i måneden."],
  ["et depositum","a deposit","Depositumet er tre måneders leie."],
  ["en leiekontrakt","a rental contract","Les leiekontrakten nøye."],
  ["en utleier / en leietaker","a landlord / a tenant","Utleieren må fikse vasken."],
  ["felleskostnader","shared costs (in a co-op)","Felleskostnadene har økt."],
  ["oppussing","renovation","Badet trenger oppussing."],
  ["et nærmiljø","local area, neighbourhood","Vi trives i nærmiljøet."],
  ["en nabo","a neighbour","Naboene våre er hyggelige."],
  ["et tilbud","an offer; a service","Det er mange tilbud for barn her."],
  ["en barnehage","a kindergarten","Barna går i barnehage."],
  ["SFO","after-school club","Hun går på SFO etter skolen."],
  ["fritid","free time","Hva gjør du på fritiden?"],
  ["å flytte","to move (house)","Vi flyttet hit i fjor."]
],
utd:[
  ["grunnskolen","primary and lower secondary school","Grunnskolen varer i ti år."],
  ["videregående skole","upper secondary school","Hun går på videregående."],
  ["et fag","a subject","Matte er mitt beste fag."],
  ["en eksamen","an exam","Eksamen er i juni."],
  ["en karakter","a grade, a mark","Han fikk en god karakter."],
  ["en utdanning","an education","Jeg har utdanning som ingeniør."],
  ["kompetanse","competence, skills","Firmaet trenger mer kompetanse."],
  ["et kurs","a course","Jeg tar et kurs i norsk."],
  ["en godkjenning","an approval, recognition","Jeg venter på godkjenning av utdanningen."],
  ["et vitnemål","a diploma, school certificate","Ta med vitnemålet ditt."],
  ["yrkesfag","vocational subjects","Han valgte yrkesfag."],
  ["en lærling","an apprentice","Hun er lærling som elektriker."],
  ["en læreplass","an apprenticeship position","Det er vanskelig å få læreplass."],
  ["et studielån","a student loan","Jeg har studielån i Lånekassen."],
  ["å ta etterutdanning","to take further education","Mange lærere tar etterutdanning."]
]
};

/* ---------- Phrase bank for writing and speaking: [norsk, English] ---------- */
const PHRASES = [
  {nb:"Innledning",en:"Introduction",l:[
    ["I dag er det mange som mener at …","Today many people think that …"],
    ["Spørsmålet om … er viktig fordi …","The question of … is important because …"],
    ["I denne teksten vil jeg argumentere for at …","In this text I will argue that …"],
    ["Det har vært mye debatt om …","There has been a lot of debate about …"]]},
  {nb:"Si hva du mener",en:"Giving your opinion",l:[
    ["Jeg mener at …","I think that …"],
    ["Etter min mening …","In my opinion …"],
    ["Slik jeg ser det, …","As I see it, …"],
    ["Jeg er overbevist om at …","I'm convinced that …"],
    ["Jeg er ikke helt sikker, men jeg tror at …","I'm not quite sure, but I think that …"]]},
  {nb:"Begrunne",en:"Giving reasons",l:[
    ["Det første argumentet mitt er at …","My first argument is that …"],
    ["En viktig grunn er at …","An important reason is that …"],
    ["Dette er fordi …","This is because …"],
    ["Det betyr at …","That means that …"],
    ["Derfor mener jeg at …","That's why I think that …"]]},
  {nb:"Eksempler",en:"Examples",l:[
    ["For eksempel …","For example …"],
    ["Et godt eksempel på dette er …","A good example of this is …"],
    ["Selv har jeg opplevd at …","I have experienced myself that …"],
    ["Da jeg bodde i …, så jeg at …","When I lived in …, I saw that …"]]},
  {nb:"Motargumenter",en:"Counter-arguments",l:[
    ["Noen vil kanskje si at …, men …","Some might say that …, but …"],
    ["Det er riktig at …, men likevel …","It's true that …, but still …"],
    ["På den ene siden …, på den andre siden …","On the one hand …, on the other hand …"]]},
  {nb:"Samtale",en:"Conversation",l:[
    ["Jeg er helt enig med deg.","I completely agree with you."],
    ["Der er jeg uenig, fordi …","I disagree there, because …"],
    ["Det er et godt poeng, men …","That's a good point, but …"],
    ["Hva mener du om …?","What do you think about …?"],
    ["Hvordan er det i ditt hjemland?","What is it like in your home country?"],
    ["Hvis jeg forstår deg riktig, mener du at …","If I understand you correctly, you mean that …"]]},
  {nb:"Kjøpe tid og reparere",en:"Buying time and repairing",l:[
    ["Det er et godt spørsmål.","That's a good question."],
    ["La meg tenke litt …","Let me think for a moment …"],
    ["Hvordan skal jeg si det …","How shall I put it …"],
    ["Det jeg mener, er at …","What I mean is that …"],
    ["Unnskyld, kan du gjenta spørsmålet?","Sorry, could you repeat the question?"]]},
  {nb:"Avslutning",en:"Conclusion",l:[
    ["Alt i alt mener jeg at …","All in all I think that …"],
    ["Til slutt vil jeg si at …","Finally I'd like to say that …"],
    ["Konklusjonen min er at …","My conclusion is that …"],
    ["Derfor er jeg for / mot …","That's why I'm for / against …"]]},
  {nb:"E-post",en:"Email",l:[
    ["Hei! / Til …","Hi! / To …"],
    ["Jeg skriver til dere fordi …","I'm writing to you because …"],
    ["Jeg vil gjerne klage på …","I'd like to complain about …"],
    ["Jeg håper at dere vil vurdere …","I hope you will consider …"],
    ["Jeg foreslår at …","I suggest that …"],
    ["Med vennlig hilsen","Kind regards"]]}
];
