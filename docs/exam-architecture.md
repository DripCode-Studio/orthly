# Exam architecture

## Modes

Practice mode gives immediate feedback and explanations. Simulation mode follows an exam blueprint, uses a timer, hides correctness until submission, and produces a detailed result report.

The two share one question engine and one question bank. They differ in feedback policy, not content.

## Blueprint

An exam configuration declares how many questions to draw per category; it never stores copies of questions. See `types/exam.ts`.

```ts
type ExamBlueprint = {
  id: string;
  family: "tflm" | "uqar" | "tcf";
  durationSeconds: number;
  questionCount: number;
  passingScorePercent: number | null;
  selectionMode: "blueprint" | "random" | "sequential";
  skills: ExamSkill[];
  sections: Array<{ categoryId: ExamCategoryId; questionCount: number }>;
  settings: ExamSettings;
  verified: boolean;
};
```

### Configured profiles

- **TFLM** — 65 multiple-choice questions in 90 minutes, with the reference distribution 4 / 24 / 5 / 13 / 19 across orthographe lexicale, orthographe grammaticale, morphologie, syntaxe, and vocabulaire. `passingScorePercent` is configurable; 60 % is a stated reference, not a confirmed official threshold. Registered with `verified: false` until checked against the official format.
- **UQAR assessment** — a configurable profile. The number of questions, duration, and scoring are **not** invented; they are populated when the student supplies the actual assessment instructions.
- **TCF** — separate profiles per variant (Canada, Québec, tout public, IRN). Their skills and task formats differ and must not be treated as interchangeable. A grammar QCM alone is not a complete TCF simulation; listening, reading, writing, and speaking need their own interfaces.

### Blueprint rules

- The sum of `sections[].questionCount` must equal `questionCount` (validator-enforced).
- `passingScorePercent: null` means no published threshold. Never invent one.
- When a category lacks enough **approved** questions, the engine reports the shortfall and offers a shorter practice run. It never repeats questions silently or reshapes the blueprint.

## Question selection

Selection is deterministic logic in `lib/`, kept out of the UI:

- Draw from the shared banks by category, topic, and difficulty.
- Exclude questions that are not approved, unless a practice run explicitly opts in.
- Prevent duplicate question IDs within one simulation.
- Record a seed when reproducibility is required, so a generated exam can be reviewed later.
- Verify coverage before enabling a full simulation.

## Attempt lifecycle

```text
ready → in-progress → submitted → reviewed
```

During a simulation (see `types/session.ts`):

- Show a countdown timer and a question navigator.
- Mark answered and unanswered questions; allow flagging for review.
- Preserve selections when navigating between questions.
- Warn before submitting.
- Hide all correctness signals until submission.
- Apply the configured submission behaviour consistently when time expires.

After submission, show the total score, passing status when configured, per-category breakdown, correct and incorrect answers with explanations, weak topics, and links to targeted lessons and exercises.

## Persistence

Only a summarized `AttemptRecord` is stored locally. In-progress sessions are resumable from local data where the blueprint permits pausing — full simulations do not, per their `settings.allowPause`.
