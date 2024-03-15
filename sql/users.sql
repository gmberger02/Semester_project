CREATE TABLE "Users" (
    userId integer DEFAULT nextval('users_id_seq'::regclass) PRIMARY KEY,
    email text,
    name text,
    password text,
    "yearOfBirth" text,
    weight double precision,
    height double precision
);

