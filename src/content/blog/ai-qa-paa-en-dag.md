---
title: "Jeg har lige erstattet en hel QA-afdeling med to AI-tools"
date: 2026-04-04
tags: ["ai", "qa", "development"]
subtitle: "Fem QA-runder. 80+ test cases. 15+ bugs fundet og fikset. Alt sammen på én dag — uden en eneste menneskelig tester."
readTime: "3 min"
---

I denne uge kørte jeg fem QA-runder på et SaaS-produkt. 80+ test cases. 15+ bugs fundet og fikset. Alt sammen på én dag.

Ingen Selenium. Ingen Playwright. Ingen QA-tester.

## Setuptet

1. Jeg beskriver hvad der skal testes — på almindeligt dansk.
2. Claude skriver en struktureret test-suite.
3. Cowork (Anthropics browser-agent) åbner produktet, logger ind, kører alle tests og returnerer screenshots med PASS/FAIL.
4. Claude Code fikser hver bug direkte i kodebasen.
5. Ny testrunde verificerer fixes.

30 minutter per runde.

## Det vilde er ikke hastigheden. Det er dækningen.

AI-testeren finder ting en menneskelig tester scroller forbi: `window.confirm()` der fryser i automatiserede miljøer, race conditions ved hurtige dobbeltklik, manglende validering på edge cases som pris 0 kr.

Og den finder ting Playwright aldrig fanger: en knap der "virker" i koden, men er blokeret af en DropdownMenu der sluger click-events. En AI-agent navigerer produktet som en bruger — og ser hvad en bruger ser.

## Feedback-loopet er kollapset

Manuelt QA er ikke dødt. Men den feedback-loop der plejer at tage uger — skriv tickets, vent på prioritering, diskutér severity, fix, vent på re-test — den kører på timer.

Fem runder. Én dag. Nul mennesker i QA-stolen.

Stolen er der stadig. Der sidder bare en agent i den.
