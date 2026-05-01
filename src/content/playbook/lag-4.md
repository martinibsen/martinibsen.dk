---
title: "Lag 4 — Processer & workflows"
subtitle: "Når byggeri er gratis, bliver beslutninger flaskehalsen."
order: 4
principle: "Tid til læring slår tid til levering."
estimatedReadTime: "8 min"
---

## Hvad sker der med arbejdet, når alt det andet ryger?

Når kulturen er flyttet, organisationen er omstruktureret og kompetencerne er pejlet om — hvordan flyder arbejdet så i hverdagen? Hvilke processer overlever, hvilke dør, og hvilke nye opstår?

Min tese: meget af det vi kalder agile praksis i dag, er bygget om at løse et koordineringsproblem der er ved at forsvinde. Mens et nyt problem — beslutningskvalitet under accelereret produktion — vokser i samme tempo. De fleste organisationer løser stadig den gamle udfordring og overser den nye.

## AI gør dårlige idéer værre, ikke bedre

John Cutler har skrevet skarpt om det her: AI accelererer eksisterende mønstre. Hvis dine processer var sunde, bliver de bedre. Hvis de var brækkede, bliver de værre. Hans eksempel er et team der ovenpå et i forvejen knækket stage-gate-system bolter en "Governance Agent" og AI-genererede PRD'er. Hver knækket mental model, nu med AI.

Jeg har endnu ikke set det gå galt i en dansk virksomhed — det er for tidligt. Men advarslen kommer til at være relevant inden for få år. De fleste organisationer der påbegynder "AI-transformation" lige nu, automatiserer deres knirkende processer i stedet for at undersøge om processerne stadig løser et reelt problem. Fælden er stillet og indbydelser er sendt ud.

Det er den åbne front for hele dette lag.

## Faldgruben: Discovery springes over

Den første konkrete fare ligger i discovery. Når prototyping er gratis, og du kan bygge en fungerende løsning på en weekend, opstår en kraftig fristelse: spring discovery over. Steve Blank har advaret mod det i årevis under titlen *"fall in love with the problem, not the solution"*. Den fare bliver større nu, ikke mindre.

For når en CEO eller mellemleder kan diktere en prototype og se den køre samme aften, bliver vedkommende forelsket i sin løsning. Ikke på grund af den research der underbygger den — men på grund af hastigheden hvormed den blev til. Det er en helt ny form for organisationspolitik. PM'en der argumenterer for at *vente* og *undersøge* står pludselig over for en prototype direktøren har bygget i weekenden og er forelsket i.

Der er en ekstra rynke. Når det er hurtigt at bygge, opstår også fristelsen til bare at spørge kunden hvad de vil have. "Vi spørger jo bare — og så bygger vi det." Det lyder fornuftigt. Det er det ikke. Henry Ford sagde det for over hundrede år siden: havde han spurgt folk hvad de ville have, havde de sagt hurtigere heste. Forskellen i 2026 er at du faktisk *kan* bygge de hurtigere heste — på en uge, med onboarding-flow oveni.

Rob Fitzpatrick beskriver i *The Mom Test* hvordan gode discovery-spørgsmål handler om kundens liv og adfærd, ikke om din idé. *Hvad gjorde du sidste gang* slår *ville du købe det her*. Den disciplin bliver ikke mindre vigtig af AI. Den bliver den vigtigste.

Den dyreste feature er ikke den der tager lang tid at bygge. Det er den der aldrig skulle have været bygget.

## Faldgruben: Tilbage til vandfald

Den anden faldgrube er mere subtil. AI gør det fristende at skrive lange spec-dokumenter og overlade resten til en agent. Du kan indtale specifikationen på en eftermiddag, give den til Claude eller Cursor, og se en hel feature blive bygget i en lang strøm.

Det ligner agile på overfladen — "vi shipper hurtigt". Det er det modsatte. Det er vandfald i ny indpakning. Den iterative løkke, hvor vi bygger lidt, tester på brugere, lærer noget, og bygger igen, står over for sin største prøvelse i tyve år. Fordi den løkke kræver disciplin — og disciplinen er sværere når alternativet (en stor specifikation der bare bygges) er så nemt.

Det kræver hardere processer end før, ikke blødere. Korte cykler. Hyppige reviews. Eksplicit læring mellem hver iteration. Det modsatte af det man kommer til, hvis man bare lader AI'en køre med specen.

## Den forsvindende midte

Karri Saarinen fra Linear har skrevet om en bevægelse han kalder *"the disappearing middle of software work"*. Pointen er at midten af softwareudvikling — at oversætte intent til implementation — har været kerne-håndværket i årevis. Det er hvor de fleste timer er blevet brugt.

Den midte bliver tyndere. AI-agenter producerer fungerende kode fra mål, kontekst og opgaver. IDE'en bliver mere af en kode-viewer end et kode-skrivende værktøj. Det betyder at presset flytter sig til de to ender:

- *Foran*: at forme intent. Hvad skal bygges, hvilke tradeoffs er acceptable, hvilke begrænsninger gælder.
- *Bagved*: review, test, release. At sikre at det der kom ud, faktisk gjorde det det skulle.

Processerne skal designes om de to ender, ikke om midten.

## Scrum er et koordineringsværktøj, ikke et produktværktøj

For at forstå hvor hurtigt det her flytter sig, kig på hvad Scrums ceremonier faktisk gør. Daily standup er informationsrouting. Sprint planning er oversættelse fra forretningsbehov til opgaver. Refinement er kollektiv gætteleg om størrelse. Retro er det eneste møde der ikke handler om koordinering — og det er også det møde de fleste teams springer over.

Scrum løser et reelt problem: hvordan holder vi styr på hvem der laver hvad, og hvordan sikrer vi at information fløj mellem mennesker der ellers ikke ville snakke sammen.

Det problem er ved at forsvinde. AI er exceptionelt god til koordinering. Et system der ved hvad alle arbejder på, kan erstatte standups. Et system der forstår kapacitet og afhængigheder, kan erstatte sprint planning. MCP-servere, browser-agenter og voksende kontekstvinduer er byggestenene. Orkestreringen mangler. Den kommer.

Når den kommer, sidder Scrum med et problem: frameworket er designet til at løse et problem som et system snart løser bedre. Spørgsmålet er ikke *hvordan bruger vi AI i Scrum?* Det er *hvad laver vi, som ikke er koordinering?*

## Den nye flaskehals: beslutninger

Når koordineringen automatiseres, og produktionen accelererer, bliver beslutningskvalitet det der adskiller. Forskningen er på vej til at forstå det. Et nyt studie påpeger eksplicit at *speed-quality trade-off* i AI-drevne beslutninger er fundamental, og at quality-first design er nødvendigt for at håndtere det ([Majumdar, 2025](https://consensus.app/papers/details/eb4a4a0cc97e585f804ba20e3fa5f824/?utm_source=claude_desktop)).

Jeg taler med danske udviklere lige nu der bekræfter mønsteret i hverdagen. Et eksempel fra Lunar: udvikleren sagde til mig at de bare sad og ventede på at en beslutning blev truffet, så de kunne rykke videre. De havde styr på hvad de skulle bygge. Det var beslutningen der haltede.

Det er det nye mønster. Eksekveringen er hurtigere end beslutningerne. Møder bliver til venteværelser hvor folk venter på at en leder afgiver en retning. Sprintet bliver kortere end beslutningscyklussen. Alt det der ligner produktivitet, viser sig at være kø.

Løsningen er ikke flere møder. Løsningen er bedre møder — og fundamentalt anderledes møder. Møder hvor vi specifikt træffer en beslutning, ikke hvor vi koordinerer.

## Faciliteringen kommer tilbage — men ikke som før

Den klassiske Scrum Master-rolle er ofte blevet en parodi. Hentet kaffe og kage, tidsstyret ståemmøder, tracket impedimenter i et spreadsheet ingen læste. Den rolle som koordineringsmestre forsvinder. Godt det samme.

Den rolle der kommer tilbage er en anden: facilitatoren der kan håndtere konflikter, samle uenighed til beslutning, og presse en gruppe til at vælge i stedet for at snøre. Den evne har altid været værdifuld og altid været undervurderet. Den bliver kritisk nu.

Det er coaching, mediation og beslutningskunst i én person. Det er ikke en ny rolle — det er den gamle Scrum Master-rolle, men forsvarligt udført for første gang. Kald det noget andet, hvis ordet er blevet skadet.

## Hvilke processer overlever

Jeg er forsigtig med at være for kategorisk her. Min nuværende vurdering:

- **Daily standups**: dør. AI ved bedre hvad alle laver, og folk skal ikke synkronisere mundtligt når systemet gør det automatisk.
- **Sprint planning**: tyndes ud. Erstattes af kontinuerlig prioritering med AI-støtte og korte beslutningsmøder efter behov.
- **Refinement**: forsvinder i nuværende form. Estimering bliver mindre vigtigt når byggetid kollapser. Erstattes af *intent-shaping*: hvad skal opgaven egentlig løse?
- **Retros**: bliver vigtigere. Det er det eneste møde der lever af refleksion frem for koordinering. Det burde have fyldt mest hele tiden.
- **PRDs**: levende dokumenter erstatter statiske. Ingen kravdokumenter der besluttes én gang og overleveres.
- **Discovery-cykler**: bliver kortere men hyppigere. Stadig kerne-praksis, ikke fase 0.
- **Reviews og evaluation**: vokser markant. Den ende af processen der har været underprioriteret, bliver hvor kvaliteten afgøres.

## Princippet for laget

I en ny produktorganisation i morgen ville jeg skrive ét princip på væggen for processer:

> Tid til læring slår tid til levering.

Det er den modsatte instinkt af det de fleste agile-implementeringer er bygget på. De er bygget om hastighed til levering. Det var den rigtige optimisering da byggeri var dyrt. Det er den forkerte optimisering nu.

Når byggeri er gratis, er den eneste meningsfulde måling hvor hurtigt I lærer noget. Alt det andet — sprints, ceremonier, ritualer — skal designes om det.
