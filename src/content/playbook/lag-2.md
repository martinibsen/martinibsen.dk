---
title: "Lag 2 — Struktur & organisering"
subtitle: "Hvad et produktteam organiseres efter, når koden er en commodity."
order: 2
principle: "Færrest mulige mennesker. Færrest mulige afhængigheder."
estimatedReadTime: "7 min"
---

## Den gamle trio falder fra hinanden

Tech Lead, Design Lead, Product Manager. Den klassiske produkttrio. Bygget på en præmis der ikke længere holder: at koden er den dyre del.

Kode er ved at blive en commodity. Når en designer kan prompte sig til en fungerende prototype, og en PM kan kode et MVP på en eftermiddag, skal teamet ikke længere organiseres efter hvem der eksekverer på hvad.

Spørgsmålet er hvad det så skal organiseres efter.

## Tre kompetenceområder — ikke tre nye titler

Min første reaktion var at tegne tre nye roller. Generalisten, Arkitekten, Compliance-ankeret. Jeg har skrevet om dem flere gange.

Jo mere jeg tænker over det, desto mere tror jeg det er forkert at låse sig fast på tre nye roller. Det er at lave samme fejl som man altid har lavet: at tro at struktur følger titler.

Det rigtigere er måske: tre kompetenceområder der altid skal være dækket i et produktteam. Hvor mange mennesker der dækker dem — og om de samme mennesker dækker flere — afhænger af konteksten.

**Generalist-evne.** Forståelse for bruger, forretning og produkt på én gang. Evnen til at shippe selv uden at vente på nogen. For et år siden ville du have kaldt det en urealistisk profil. I dag er det bare en person med et AI-abonnement og en god produktsans.

**Arkitektur-overblik.** Ikke for at skrive koden, men for at validere den. Når alle prompter sig til features i hver deres retning, skal nogen sikre at det hænger sammen. At databasen ikke ligner en losseplads. At sikkerhedsmodellen ikke er bygget på håb. Det kræver det eneste AI endnu ikke kan erstatte: overblik.

**Compliance-bevidsthed.** Sikkerhed, GDPR, regulering. Når kode skrives hurtigere end nogensinde, og halvdelen af teamet ikke kan forklare hvad deres egen kode gør, bliver den kedelige person i rummet pludselig den vigtigste.

Brug listen som et tjek på om teamet er i balance. Mangler ét af de tre, er du i problemer — uanset hvor mange mennesker du har.

Forskningen peger samme vej. En undersøgelse af 38 udviklere og 102 surveyrespondenter fandt at folk der tildelte AI flere fluide roller havde højere adoption og brug end folk der låste sig fast på én rolle (Zakharov et al., 2025). Pointen handler om AI, men den rækker bredere: organisering der lever af fluiditet slår organisering der lever af titler.

## Små teams vinder — og har altid gjort

Team Topologies-tænkningen fra Skelton og Pais starter med en simpel observation: afhængigheder mellem teams er det største skaleringsproblem i moderne software.

Indsigten er ikke ny. Brooks' law er fra 1975: *adding manpower to a late software project makes it later*. Et empirisk studie af 58 open source-projekter med 580.000+ commits og 30.000+ udviklere bekræftede det kvantitativt: koordineringsbehov skalerer ikke-lineært med teamstørrelse, og produktiviteten falder (Scholtes et al., 2015).

Vi har vidst det i 50 år. Alligevel har danske enterprise-projekter konsekvent løst forsinkelser ved at sætte flere folk på. Deadline gled, en konsulent blev ringet ind, et nyt scrum-team blev formeret — og forsinkelsen blev værre.

Hvorfor? Fordi alternativet — at sige *vi har ikke kapacitet, vi udskyder eller skærer i scope* — har været organisatorisk umuligt. Output blev målt på "har vi nok mennesker på opgaven". Så ansatte man flere.

AI fjerner undskyldningen.

Hvis tre personer kan levere det fem kunne før, og fem kan levere det ti kunne før, kan man endelig organisere sig efter den regel der altid har været rigtig: hold teams så små som muligt og afhængighederne ude.

Idéen er gammel. Forskellen er at den for første gang er praktisk realiserbar i en dansk enterprise-kontekst.

## Sweet spot: domæneviden, discovery, facilitering

Hvis de digitale fagligheder flader ud, hvad er det så der differentierer?

Det første svar er domæneviden. Den specifikke forståelse af interiørdesignere, hospitalsapotekere, pensionsrådgivere. Niche-viden der ikke kan tilegnes via en LLM. Det er også derfor de startups der vinder, ofte er vertikale — de bygger for et domæne hvor viden er svær at tilegne sig udefra.

Men domæneviden alene er en faldgrube. Jeg har set domæneeksperter der ikke forstår discovery, blive de farligste personer i organisationen. De spytter features ud som ingen bruger, fordi deres egen erfaring er deres eneste prøvebænk.

Vi leder efter sweet spot mellem tre ting:

- **Domæneviden** — du forstår industrien, kunderne, problemerne der ikke står på skrift.
- **Discovery-disciplin** — du tester antagelser før du bygger på dem; din egen erfaring er udgangspunkt, ikke konklusion.
- **Facilitering** — du kan samle folk med forskellige perspektiver og flytte dem fra uenighed til beslutning. Ingen LLM gør det for dig.

<figure class="pb-figure"><svg class="pb-venn" viewBox="0 0 680 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="venn-title venn-desc"><title id="venn-title">Sweet spot for den nye produktleder</title><desc id="venn-desc">Tre overlappende cirkler — domæneviden, discovery og facilitering — med den nye produktleder i sweet spot i midten.</desc><circle class="ring" data-ring="0" cx="340" cy="195" r="130"/><circle class="ring" data-ring="1" cx="275" cy="307.5" r="130"/><circle class="ring" data-ring="2" cx="405" cy="307.5" r="130"/><text class="label" x="340" y="92" text-anchor="middle">Domæneviden</text><text class="label-sub" x="340" y="110" text-anchor="middle">Industri, kunder, mønstre</text><text class="label" x="160" y="395" text-anchor="middle">Discovery</text><text class="label-sub" x="160" y="413" text-anchor="middle">Test før byg</text><text class="label" x="520" y="395" text-anchor="middle">Facilitering</text><text class="label-sub" x="520" y="413" text-anchor="middle">Uenighed til beslutning</text><a href="#tre-kompetenceområder--ikke-tre-nye-titler" class="sweet-link" aria-label="Den nye produktleder — gå til Tre kompetenceområder"><rect class="sweet-hit" x="280" y="225" width="120" height="60" rx="2"/><text class="sweet-text" x="340" y="252" text-anchor="middle">Den nye</text><text class="sweet-text" x="340" y="270" text-anchor="middle">produktleder</text></a></svg><figcaption class="pb-figcaption">Sweet spot — der hvor de tre overlapper, sidder den nye produktleder.</figcaption></figure>

Der bor den nye produktleder. Hverken i prompt-evner, Figma-skills eller backlog-styring.

Når du hyrer ind, er det sweet spot du leder efter — ikke en certificering eller en titel. Den vigtigste markør er growth mindset. Forstået som forudsætning, ikke som kliché. Folk hvis identitet sidder i hvad de allerede ved, vil falde fra hinanden. Folk hvis identitet sidder i hvor hurtigt de lærer, vil trives.

## Hvad der styrer i produktorganisationen

Når teams bliver små og selvkørende, hvad styrer så produktorganisationen?

Ikke at fordele opgaver. Ikke at tracke output. Ikke at koordinere release-noter. Ikke at lave kapacitetsplaner.

Produktorganisationen styres af outcomes — hvilke effekter der tæller, og hvilke trade-offs der er acceptable. Output bliver måleløst i AI-volumen, fordi alle kan producere mere. Den eneste meningsfulde måling tilbage er om noget faktisk gjorde en forskel.

En strukturpointe, før det er en personalepointe. Hvis output stadig er det der bestemmer beslutninger om budget, prioritering og retning, falder hele resten af pyramiden sammen. Outcomes er forudsætningen for alt det andet.

## Tværgående koordinering — et åbent spørgsmål

Tværgående koordinering forsvinder ikke. Den minimeres, men er stadig til stede.

Den klassiske ramme har været rollebaseret: et stort program, tildelt en *program architect*, der skal sikre kohærens på tværs.

I en AI-tid tror jeg at koordineringen flytter sig fra rolle til værdistrøm. Du organiserer dig efter den vej en kundes problem rejser fra start til løsning, og lader teams følge værdistrømmen frem for at tildele dem komponenter. Roller skal stadig findes, men de er sekundære til hvad strukturen betjener.

Forskningen er enig om at moderate koordineringsniveauer slår både minimal og maksimal koordinering (Hahn et al., 2025). I store organisationer findes der 27 forskellige mekanismer der kan bære den koordinering (Berntzen et al., 2023).

Jeg er stadig i tvivl her. Det her er ikke færdigt-tænkt. Min foreløbige holdning: følg værdistrømmen, hold koordineringen så minimal som muligt, og acceptér at noget fortsat skal koordineres på tværs.

## Princippet for laget

I et nyt produktteam i morgen ville jeg skrive ét princip på væggen:

> Færrest mulige mennesker. Færrest mulige afhængigheder.

Det er den ramme alt andet hænger på. Sweet spot mellem domæneviden, discovery og facilitering hører til kompetencelaget — ikke væggen. Men de to ting hænger sammen: færre mennesker bliver kun til virkelighed hvis de få der er, har den rette kombination af kompetencer.
