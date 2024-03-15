CREATE TABLE "Exercise" (
    "ExerciseId" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    legs character varying(20) CHECK (legs::text = ANY (ARRAY['Yes'::character varying, 'No'::character varying]::text[])),
    pull character varying(20) CHECK (pull::text = ANY (ARRAY['Yes'::character varying, 'No'::character varying]::text[])),
    push character varying(20) CHECK (push::text = ANY (ARRAY['Yes'::character varying, 'No'::character varying]::text[])),
    core character varying(20) CHECK (core::text = ANY (ARRAY['Yes'::character varying, 'No'::character varying]::text[]))
);
