---
title: "Lag 2 — Organisation & struktur"
subtitle: "Hvordan team, roller og samarbejde ser ud, når AI er en del af leveringen."
order: 2
principle: "Færrest mulige mennesker. Færrest mulige afhængigheder. Dybeste mulige domæneviden."
estimatedReadTime: "7 min"
---

## Den nye produkttrio

Tech Lead, Design Lead, Product Manager. Den klassiske produkttrio. Bygget på en præmis der ikke længere holder: at koden er den dyre del.

Kode er ved at blive en commodity. Når en designer kan prompte sig til en fungerende prototype, og en PM kan kode et MVP på en eftermiddag, skal teamet ikke længere organiseres efter hvem der eksekverer på hvad. Det skal organiseres efter hvad der ikke kan automatiseres.

Hvis jeg skulle hyre et produktteam i dag, ville det se sådan ud:

**Generalisten.** En hybrid af PM, UX-designer og forretningsudvikler. Den person der forstår brugeren godt nok til at vide hvad der skal bygges, forstår forretningen godt nok til at vide hvorfor, og kan shippe selv uden at vente på nogen. For et år siden ville du have kaldt det en urealistisk stillingsbeskrivelse. I dag er det bare en person med et AI-abonnement og en god produktsans.

**Arkitekten.** Ikke den der skriver koden. Den der validerer den. Når alle på teamet prompter sig til features i hver deres retning, skal nogen sikre at det hænger sammen. At databasen ikke ligner en losseplads. At sikkerhedsmodellen ikke er bygget på håb. Det er den sværeste rolle, fordi den kræver det eneste AI endnu ikke kan erstatte: overblik.

**Compliance-ankeret.** Sikkerhed, GDPR, regulering. Når kode skrives hurtigere end nogensinde, og halvdelen af teamet ikke kan forklare hvad deres egen kode gør, bliver den kedelige person i rummet pludselig den vigtigste.

Tre roller. Alle prompter eller skriver kode. Alle leverer til eksekvering. Ingen venter på nogen.

## Hvorfor små teams vinder nu

Team Topologies-tænkningen fra Skelton og Pais starter med en simpel observation: afhængigheder mellem teams er det største skaleringsproblem i moderne software. Større teams og flere teams skaber flere koordineringspunkter, mere overhead, mere tid brugt på alignment fremfor på produktet.

Den klassiske løsning har været at organisere sig så afhængighederne håndteres — frameworks som SAFe har bygget en industri på det. En multi-case-undersøgelse af tre SAFe-implementeringer fandt at scaling ganske vist gav bedre overblik og længere planlægningshorisont, men også begrænsede teams' autonomi gennem *limited feature choice and enforced refinement* (Gustavsson et al., 2022). Du betaler for koordinering med autonomi.

AI ændrer ligningen. Hvis tre personer kan levere det fem kunne før, og fem kan levere det ti kunne før, så bliver det muligt at organisere sig efter en ny regel: hold teams så små som muligt og afhængighederne ude.

Det er ikke en ny idé. Marty Cagan har advokeret for *empowered product teams* af 4–8 personer i mange år. Team Topologies bygger på samme intuition. Forskellen er at idealet endelig kan realiseres — fordi det enkelte teammedlem nu kan dække langt mere territorium end før.

## Modspørgsmålet om centralisering

En randomiseret undersøgelse med 435 deltagere på 122 hold (Li et al., 2024) fandt at *centralized AI usage by a few team members is more effective than distributed engagement*. På overfladen ligner det modsat min antagelse om at alle skal prompte.

Men forskningen beskrev hold af 3–5 personer, hvor *centraliseret* betød 1–2 der promptede og 2–3 der ikke gjorde. I trio'en gør alle. Det er ikke distribueret AI-brug — det er centraliseret AI-brug, bare i et lille team. Spørgsmålet om centralisering vs distribution dissolverer ved den teamstørrelse.

Det understøttes af et empirisk studie af bots i open source-teams: tilstedeværelsen af bots var associeret med både højere produktivitet *og* højere centralisering af arbejdet (Newton et al., 2022). Centraliseringen sker af sig selv når AI er i værktøjskassen. Du behøver ikke designe den ind. Du behøver bare at gøre teamet lille nok til at den ikke kæmper imod.

## Domæneviden er det der overlever

Det centrale spørgsmål bliver så: hvis de digitale fagligheder — frontend, backend, UI-design — flader ud, hvad er der tilbage som ægte differentierer?

Discovery. Kundeforståelse. Domæneviden.

<figure class="pb-figure"><svg class="pb-venn" viewBox="0 0 680 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="venn-title venn-desc"><title id="venn-title">Sweet spot for den nye produktleder</title><desc id="venn-desc">Tre overlappende cirkler — domæneviden, discovery og facilitering — med den nye produktleder i sweet spot i midten.</desc><circle class="ring" data-ring="0" cx="340" cy="195" r="130"/><circle class="ring" data-ring="1" cx="275" cy="307.5" r="130"/><circle class="ring" data-ring="2" cx="405" cy="307.5" r="130"/><text class="label" x="340" y="92" text-anchor="middle">Domæneviden</text><text class="label-sub" x="340" y="110" text-anchor="middle">Industri, kunder, mønstre</text><text class="label" x="160" y="395" text-anchor="middle">Discovery</text><text class="label-sub" x="160" y="413" text-anchor="middle">Test før byg</text><text class="label" x="520" y="395" text-anchor="middle">Facilitering</text><text class="label-sub" x="520" y="413" text-anchor="middle">Uenighed til beslutning</text><a href="#den-nye-produkttrio" class="sweet-link" aria-label="Den nye produktleder — gå til Den nye produkttrio"><rect class="sweet-hit" x="280" y="225" width="120" height="60" rx="2"/><text class="sweet-text" x="340" y="252" text-anchor="middle">Den nye</text><text class="sweet-text" x="340" y="270" text-anchor="middle">produktleder</text></a></svg><figcaption class="pb-figcaption">Sweet spot — der hvor de tre overlapper, sidder den nye produktleder.</figcaption></figure>

Det er ikke nye discipliner. Det er de samme produktdiscipliner som altid har været vigtige. Men de bliver nu de eneste der ikke kommoditiseres af AI. En LLM kan generere alt — undtagen den specifikke forståelse af hvordan en indretningsarkitekt planlægger sin uge, eller hvordan et hospitalsapotek håndterer kontrolleret medicin, eller hvordan en pensionsrådgiver vurderer en kunde.

Det har konsekvenser for hvordan startups vinder. De vinder ved vertikalisering — ved at bygge for et specifikt domæne hvor domæneviden er svær at tilegne sig udefra. Mit eget produkt Stilnote vinder ikke ved at være et bedre layout-tool. Det vinder ved at min medbygger Sophia har siddet med interiørdesignere i årevis og forstår præcis hvad de faktisk laver om mandagen.

Det har også konsekvenser for hvor specialisterne sidder. De er ikke en fjerde rolle i trio'en. De er enten:

- *indlejret i Generalisten*, hvis Generalisten er rekrutteret med dyb domæneforståelse,
- *eksterne rådgivere*, hvis det handler om juridisk eller regulatorisk specialviden,
- eller *forskellen mellem at vinde og tabe*, hvis du bygger til en niche hvor nogen i teamet skal kende nichen i bunden.

## Hvad lederrollen bliver

Hvis teams bliver små og selvkørende, hvad laver chefen så?

Ikke at fordele opgaver. Ikke at tracke output. Ikke at koordinere release-noter. Ikke at lave kapacitetsplaner.

Lederen beslutter hvilke outcomes der tæller, og hvilke trade-offs der er acceptable. Det er hvad produktledere altid har sagt deres job var. Lige indtil de fik det.

Det er den vigtigste forandring i lederlaget. Output bliver målbart i AI-volumen — alle kan producere mere. Den eneste meningsfulde måling tilbage er outcome. Gjorde det her noget godt for brugeren, for forretningen, for produktet? Hvis ja, hvor meget? Hvis nej, hvad lærte vi?

Lederen flytter sig fra produktionschef til redaktør. Fra at bestille features til at vurdere effekter.

## Hvad der ikke forsvinder

Tværgående koordinering forsvinder ikke. Den minimeres, men er stadig til stede.

Forskningen er ret klar her: moderate niveauer af tværgående koordinering giver bedre resultater end både minimal og maksimal koordinering (Hahn et al., 2025). I store organisationer findes der 27 forskellige mekanismer til at håndtere det — communities of practice, program architects, fælles platforme, inter-team retrospectives (Berntzen et al., 2023).

I den nye model bliver Arkitekten formentlig den der koordinerer på tværs. Det er den naturlige rolleudvidelse — fra at sikre kohærens i ét team til at sikre kohærens på tværs af flere. Det er den *program architect*-rolle som store organisationer allerede har, bare reframet til AI-tiden.

## Princippet for laget

I et nyt team i morgen ville jeg skrive ét princip på væggen for organisering:

> Færrest mulige mennesker. Færrest mulige afhængigheder. Dybeste mulige domæneviden.

Det er den ramme alt andet hænger på. Organiserer du dig efter den, er det fysisk umuligt at skabe de gamle koordineringsproblemer. Fraviger du den, er det kun et spørgsmål om tid før de kommer.
