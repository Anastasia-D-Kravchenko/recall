# Recall

A private spaced-repetition flashcard app (website + PWA). The page here is only the app's code:
the cards and study progress live in a private Neon Postgres database and load after sign-in,
and only the owner's accounts are allowed by the database's row rules.

- Study with 1–5 confidence ratings (Brainscape-style rounds and checkpoints, FSRS scheduling for 4s and 5s)
- Exam planner for dated tests, tests with auto-marked true/false, multiple choice and typed commands
- Works offline and syncs when back online
