CREATE TABLE "Exercise" (
    "ExerciseId" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    legs text,
    pull text,
    push text,
    core text
);