import json

sections = [
  {"categoryId": "orthographe_lexicale", "questionCount": 4},
  {"categoryId": "orthographe_grammaticale", "questionCount": 24},
  {"categoryId": "morphologie", "questionCount": 5},
  {"categoryId": "syntaxe", "questionCount": 13},
  {"categoryId": "vocabulaire", "questionCount": 19},
]
assert sum(s["questionCount"] for s in sections) == 65

titles = [
  ("tflm-simulation-01", "TFLM Simulation 01 — Fondamentaux"),
  ("tflm-simulation-02", "TFLM Simulation 02 — Grammaire et accords"),
  ("tflm-simulation-03", "TFLM Simulation 03 — Syntaxe et conjugaison"),
  ("tflm-simulation-04", "TFLM Simulation 04 — Maîtrise du français écrit"),
  ("tflm-simulation-05", "TFLM Simulation 05 — Simulation avancée"),
]

for bid, title in titles:
    bp = {
        "id": bid,
        "title": title,
        "family": "tflm",
        "description": "Simulation pratique TFLM — 65 QCM portant sur les structures de la langue française. Examen non officiel (pratique).",
        "durationSeconds": 5400,
        "questionCount": 65,
        "passingScorePercent": None,
        "selectionMode": "blueprint",
        "skills": ["language_structures"],
        "sections": [dict(s) for s in sections],
        "settings": {
            "allowReview": True,
            "showFeedbackDuringExam": False,
            "showAnswersBeforeSubmission": False,
            "allowPause": True,
        },
        "verified": False,
        "notes": ["Simulation pratique non officielle. Questions issues de la banque TFLM (reviewStatus needs_review)."],
    }
    path = f"public/data/exams/{bid}.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(bp, f, ensure_ascii=False, indent=2)
    print("written", path)