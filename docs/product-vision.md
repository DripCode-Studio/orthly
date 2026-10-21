# Product vision

## What Orthly is

Orthly is a personal French-learning environment for a university student. It is not a generic language app and not a QCM drill site. It has three purposes that a single screen must never blur:

1. **Apprendre** — learn French rules from UQAR course notes through structured, progressive lessons.
2. **Pratiquer** — practise with exercises, quizzes, and flashcards, and review mistakes with detailed explanations.
3. **Se préparer** — prepare assessments with timed simulations, principally the TFLM, plus a configurable UQAR profile and optional TCF preparation.

The distinguishing value is that the content comes from the student's actual course material and the assessments they must pass. A generic French course would not be worth building.

## Product principles

- **Content first, gamification second.** An incorrect rule or an ambiguous answer key destroys trust faster than XP builds it. Validate content before adding rewards.
- **The source is authoritative.** The UQAR notes and supplied documents are the reference. Supplementary material is labelled as such and never attributed to the notes.
- **One concept, many surfaces.** A question is authored once and reused by chapter practice, targeted revision, "practice my mistakes", and exam assembly.
- **Serious where it counts.** The learning path may be playful; the timed simulation must feel like a real assessment.
- **Local and honest.** Progress lives in this browser. The UI says so plainly rather than implying synchronization that does not exist.
- **No invented data.** No fabricated statistics, no fake charts for new users, no placeholder content presented as official exam material.

## Scope of the MVP

Deliberately excluded from the first version:

- No database and no backend API.
- No authentication or account system.
- No server-side or live-AI question generation — every question and answer key is pre-authored JSON.

In scope:

- Static, versioned JSON content in `public/data/`.
- Learner progress, attempts, bookmarks, and flashcard scheduling in `localStorage`.
- A validated content pipeline: extract → lesson → questions → validate → publish.

## Target user

A single university student preparing written French for the TFLM and their UQAR course. Design decisions optimize for depth of study over breadth of audience; there is no multi-tenant requirement.

## Success criteria

The product is working when a learner can:

- Read a validated lesson rendered from JSON.
- Take a related quiz and read a grammatical explanation for each answer.
- Review the corresponding flashcards and see the result reflected on the dashboard.
- Start a timed TFLM simulation and receive a category-level report.
- Close the tab, return, and find their progress intact — and export it as JSON to be safe.

## What this document is not

This file states intent. Concrete data structures live in [data-contracts.md](./data-contracts.md), folder responsibilities in [architecture.md](./architecture.md), and delivery order in [roadmap.md](./roadmap.md).
