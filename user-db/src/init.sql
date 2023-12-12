create table users (
    user_id uuid generated always as identity primary key,
    email text unique,
    phone text unique,
    password text not null,
    verified boolean default false,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    check (email is not null or phone is not null)
);

alter table users enable row level security;

-- create policy "Allow logged-in users to see their own data"
-- on users 
-- for select 
