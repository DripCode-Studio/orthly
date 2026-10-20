# Exam architecture

## Modes

Practice mode gives immediate feedback and explanations. Simulation mode follows an exam blueprint, uses a timer, hides correctness until submission, and produces a detailed result report.

## Blueprint

An exam configuration should define:

```ts
{
  id: string,
  title: string,
  durationMinutes: number,
  questionCount: number,
  sections: { topicIds: string[], count: number }[],
  scoring: { correctPoints: number, penaltyPoints: number }
}
```

The TFLM configuration should reflect the supplied reference: 65 multiple-choice questions in 90 minutes, with emphasis on grammatical orthography, vocabulary, and syntax. It must be validated against the current official assessment before release.

## Attempt lifecycle

`ready → in-progress → submitted → reviewed`

Persist only resumable attempt data locally. On submission, store the score, topic breakdown, missed questions, and explanations. Never expose the answer key through the simulation UI before submission.
