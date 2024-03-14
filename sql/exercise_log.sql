
CREATE TABLE "Exercise_Log" (
    logid integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "exerciseId" integer REFERENCES "Exercise"("ExerciseId"),
    "userId" integer REFERENCES "User"("id"),
    dato date,
    sets integer,
    reps integer,
    duration time without time zone
);