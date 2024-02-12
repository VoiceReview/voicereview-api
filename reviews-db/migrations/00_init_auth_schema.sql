BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table if not exists reviews (
    review_id uuid primary key default uuid_generate_v4(),
    verified boolean default false,
    updated_at timestamp default current_timestamp,
    created_at timestamp default current_timestamp,
    audio_link text not null,
    transcription text,
    like_count int default 0,

    /* To know if it's a review of review */
    parent_id uuid default null,
);
comment on table reviews is 'Reviews: Stores reviews details';
