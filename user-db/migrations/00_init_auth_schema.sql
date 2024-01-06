BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table if not exists users (
    user_id uuid primary key default uuid_generate_v4(),
    email text unique,
    phone text unique,
    password text not null,
    verified boolean default false,
    role text default 'user',
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    check (email is not null or phone is not null)
);
comment on table users is 'Auth: Stores user credentials';

create table if not exists sessions (
    session_id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(user_id) on delete cascade,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    expires_at timestamp default current_timestamp + interval '1 day',
    revoked boolean default false
);
comment on table sessions is 'Auth: Stores session tokens';

create table if not exists refresh_tokens (
    token uuid primary key default uuid_generate_v4(),
    user_id uuid references users(user_id) on delete cascade,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    expires_at timestamp default current_timestamp + interval '30 days',
    revoked boolean default false
);
comment on table refresh_tokens is 'Auth: Stores refresh tokens';

-- get the user id from the request cookie
create or replace function uid() returns uuid as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$ language sql stable;

--get the user role from the request cookie
create or replace function role() returns text as $$
    select nullif(current_setting('request.jwt.claim.role', true), '')::text;
$$ language sql stable;

COMMIT;