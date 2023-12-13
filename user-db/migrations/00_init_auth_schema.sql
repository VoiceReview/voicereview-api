BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE if not exists user_role AS ENUM ('anon', 'admin', 'user', 'moderator');

create table if not exists users (
    user_id uuid primary key default uuid_generate_v4(),
    email text unique,
    phone text unique,
    password text not null,
    verified boolean default false,
    role user_role default 'user',
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    check (email is not null or phone is not null)
);
comment on table users is 'Auth: Stores user credentials';

-- get the user id from the request cookie
create or replace function auth.uid() returns uuid as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$ language sql stable;

--get the user role from the request cookie
create or replace function auth.role() returns text as $$
    select nullif(current_setting('request.jwt.claim.role', true), '')::text;
$$ language sql stable;

COMMIT;