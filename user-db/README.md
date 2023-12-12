# User Database

This directory contains the user database configuration files.

## Files

- [init.sql](src/init.sql) - The SQL script to create the tables inside the database.
- [seed.sql](src/seed.sql) - The SQL script to seed the database with some data.

## Tables

- [users](#user-table)

### User Table

The user table contains the following columns:

| Column       | Type           | Description                                        |
| ------------ | -------------- | -------------------------------------------------- |
| `user_id`    | `uuid`         | The unique identifier for the user.                |
| `email`      | `varchar(255)` | The email address of the user.                     |
| `phone`      | `varchar(255)` | The phone number of the user.                      |
| `password`   | `varchar(255)` | The password of the user.                          |
| `verified`   | `boolean`      | Whether the user has verified their email address. |
| `created_at` | `timestamp`    | The date and time the user was created.            |
| `updated_at` | `timestamp`    | The date and time the user was last updated.       |

> **Note:** The `user_id` column is the primary key for the table.

> **Note:** The `email` column has a unique constraint.

> **Note:** The `phone` column has a unique constraint.

> **Note:** Either the `email` or `phone` column must be set.

#### RLS Policies

The following RLS policies are applied to the table:

...

### User Profile Table

The user profile table contains the following columns:

| Column       | Type           | Description                                  |
| ------------ | -------------- | -------------------------------------------- |
| `user_id`    | `uuid`         | The unique identifier for the user.          |
| `username`   | `varchar(255)` | The user name of the user.                   |
| `birthday`   | `date`         | The birthday of the user.                    |
| `bio`        | `varchar(500)` | The bio of the user.                         |
| `created_at` | `timestamp`    | The date and time the user was created.      |
| `updated_at` | `timestamp`    | The date and time the user was last updated. |

> **Note:** The `user_id` column is the primary key for the table.

> **Note:** The `user_id` column is a foreign key to the `user_id` column in the `users` table.

> **Note:** The `username` column has a unique constraint.

#### RLS Policies

The following RLS policies are applied to the table:

...