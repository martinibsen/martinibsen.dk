---
title: "Lag 5 — Værktøjer & software"
subtitle: "Det mindst interessante lag — og det de fleste organisationer starter med."
order: 5
principle: "Vælg principper. Skift værktøjer."
estimatedReadTime: "5 min"
---

## Hvorfor det her lag er kort

De fleste AI-transformationer starter her. "Vi rullede Copilot ud." "Vi har Cursor-licenser til alle." "Vi bruger ChatGPT Enterprise."

Det er den hurtigste vej til en fejlslagen transformation.

Værktøjer er det nemmeste at tale om, det nemmeste at indkøbe, og det nemmeste at retfærdiggøre på et budget. Og de er det mindst betydningsfulde af de fem lag. Hvis de fire ovenfor — kultur, organisation, kompetencer, processer — ikke er flyttet, så er værktøjer ligegyldige. Du får bare hurtigere dårlige outputs.

Det er derfor laget kommer sidst. Og det er derfor det her afsnit bevidst er kortere end de andre.

## Værktøjer er kommodificeret

Det er værd at sige højt: forskellene mellem de store AI-modeller er marginale i en produktkontekst. Claude, GPT, Gemini — de leverer alle 90% af det de fleste teams skal bruge. Forskellene betyder mest når man løser de sidste 10%.

Det samme gælder coding-værktøjer. Claude Code, Cursor, Copilot, Windsurf — de gør grundlæggende det samme. De adskiller sig på UX, integration og pris. Ikke på om de virker.

Det betyder at *valget* af værktøj er nemt. Det er ikke der differentieringen ligger.

Hvor differentieringen *ligger*:

- Hvor godt teamet har lært at bruge værktøjet
- Hvor godt det er integreret med teamets data og kontekst
- Hvor disciplineret teamet er omkring evaluering af outputtet

Det er de tre ting der adskiller en organisation der får meget ud af AI fra en der får lidt. Ikke om de valgte Cursor eller Claude Code.

## Hvad et minimum-stack ser ud som

For en produktorganisation der vil arbejde AI-først, ser et fungerende grundsetup nogenlunde sådan ud:

- **En kode-assistent** med agentisk tilgang. Claude Code, Cursor, Windsurf eller lignende. Vælg én, lær den i bund.
- **Et kontekst-lag.** MCP er ved at blive standarden. Det er hvordan AI får adgang til dit teams data, dokumenter, systemer. Uden et kontekst-lag arbejder AI på generisk viden — og generisk viden er sjældent det der differentierer.
- **Et eval-værktøj.** Hvordan ved I om jeres AI-features virker? Hvordan tester I dem? Det er ikke et felt der har konsolideret sig endnu, men det bliver kritisk inden for kort tid.
- **Et observability-lag.** Hvad gør AI'en faktisk i produktion? Hvor fejler den? Hvor er den langsom? Det er nyt territorium for de fleste teams.
- **Et governance-lag.** Hvem må bruge hvad, til hvad, med hvilke data? Compliance og sikkerhed kan ikke være eftertanker.

Det er ikke en udtømmende liste. Men det er det minimum der skal være på plads, før du kan tale om at være AI-først.

## Den klassiske enterprise-fejl

Den fejl der gentages i hver enterprise-AI-transformation jeg har set, er denne: at vælge et værktøj og kalde det transformation.

"Vi har rullet Copilot ud til 500 udviklere" er ikke en transformation. Det er en licensaftale. Hvad gør de 500 udviklere anderledes nu? Hvilke beslutninger tages anderledes? Hvilke processer er ændret? Hvilke kompetencer er styrket?

Hvis svaret er *vi måler velocity og det stiger lidt*, så er det ikke transformation. Det er produktivitetsboost på en eksisterende model.

Real transformation kræver at de fire lag ovenover er i bevægelse. Værktøjet er bare det redskab der gør de andre lag mulige. Ikke det der driver dem.

## Vælg værktøjer der kan udskiftes

Fordi feltet bevæger sig så hurtigt, er det vigtigste princip ved værktøjsvalg ikke *hvilket værktøj er bedst nu*, men *hvor nemt er det at skifte*.

Det betyder:

- **Undgå dyb lock-in.** Værktøjer der binder dig til én leverandørs format, prompts eller integrationer er farlige. Modellerne skifter, leverandørerne skifter.
- **Byg på åbne standarder.** MCP er det første ægte forsøg på et åbent kontekst-lag. Brug det. API-baserede integrationer slår proprietære plugins.
- **Hold konteksten på din side.** Dine data, dine prompts, dine evals skal eksistere uafhængigt af det værktøj der eksekverer dem. Hvis du skifter fra Claude til GPT i morgen, skal du kunne tage konteksten med.

Det er de samme principper man har brugt i softwarearkitektur i 30 år: undgå tight coupling, byg på interfaces, hold dine data fri. AI ændrer ikke på det. Det forstærker behovet.

## Hvad jeg selv bruger

For at gøre det konkret: mit eget setup pr. dato er Claude Code som primær kode-assistent, Cursor som backup, MCP til kontekst-integration mod Notion og andre datakilder, Loops til email-automatisering, og Cowork som browser-agent til de opgaver der kræver klikker rundt på websites.

Det er ikke en anbefaling. Det er en øjebliksrapport. Om seks måneder er halvdelen af det formentlig skiftet ud. Pointen er præcis at det skal kunne ske uden at hele setuppet bryder sammen.

## Princippet for laget

I en ny produktorganisation i morgen ville jeg skrive ét princip på væggen for værktøjer:

> Vælg principper. Skift værktøjer.

Principperne — hvad I beslutter at automatisere, hvilke kontekst I deler med AI, hvordan I evaluerer outputs, hvordan I håndterer compliance — er det der varer. Værktøjerne er det der skiftes ud hver sjette måned.

Hvis du har det rigtige princip, kan du bruge ethvert værktøj. Hvis du ikke har det, gør det ingen forskel hvilket værktøj du valgte.
