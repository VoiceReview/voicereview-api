# User Database

This directory contains the user database configuration files.

## Files

- [init.sql](src/init.sql) - The SQL script to create the tables inside the database.
- [seed.sql](src/seed.sql) - The SQL script to seed the database with some data.
- [migrations](src/migrations) - The directory containing the SQL scripts to migrate the database.

### Migrations

To create a new migration, run the following command:

```bash
chmod a+x ./new-migration.sh
./new-migration.sh
```

> **Note:** Do not create a new migration file manually.

This will create a new migration file in the `src/migrations` directory.

> **Note:** The migration file will contain a default template. Do not edit remove the template. It is needed to rollback the migration in case of an error.

> **Note:** The migration file will be name using timestamp. This is to ensure that the migrations are applied in the correct order.

To run the migrations, run the following command:

```bash
chmod a+x ./apply-migrations.sh
./apply-migrations.sh
```

> **Note:** This file also ensure that previous migrations have not been edited and that the changes have not been applied to the database. If the migration has been edited, the script will raise a warning.

To reset the database, run the following command:

```bash
chmod a+x ./reset-database.sh
./reset-database.sh
```

## Monitoring

To monitor the database, we are using [pgadmin](https://www.pgadmin.org/). To access the database, you will need to add a new server. The server details can be obtained using the following command:

```bash
docker inspect user_database -f "{{json .NetworkSettings.Networks }}"
```

The output of the command will be similar to the following:

```json
{
  "api_default": {
    "IPAMConfig": null,
    "Links": null,
    "Aliases": ["user_database", "user_database", "de6d2abffc77"],
    "NetworkID": "5e1703f8ef1f7c23b6f8effa73822a14fc1c0862d4134b9a63fc1603195b810e",
    "EndpointID": "2365a7d1813053365c0330a71ce266146c1d100d5ae408ceaa18eb1f0c5c2bcf",
    "Gateway": "172.26.0.1",
    "IPAddress": "172.26.0.2",
    "IPPrefixLen": 16,
    "IPv6Gateway": "",
    "GlobalIPv6Address": "",
    "GlobalIPv6PrefixLen": 0,
    "MacAddress": "02:42:ac:1a:00:02",
    "DriverOpts": null
  }
}
```

To add the database server to pgadmin, you will need to use the following details:

1. **Open pgAdmin:**

   - Open your pgAdmin web interface in a web browser. The default URL is usually http://localhost:5050.

2. **Login to pgAdmin:**

   - Use your pgAdmin credentials to log in.

3. **Add a Server:**

   - In the pgAdmin dashboard, click on "Add New Server" to add a new server.

4. **General Tab:**

   - In the "General" tab of the "Create - Server" dialog, enter a name for the server (e.g., "User Database").
   - In the "Connection" tab, provide the host (IP address or domain name) and port of your PostgreSQL server. In the example data, the IP address is 172.26.0.2 and the port is 5432.

5. **Connection Tab:**

   - Switch to the "Connection" tab and provide the username and password for the PostgreSQL server. These should match the credentials you use to connect to the PostgreSQL server. (You can find them in the [.env](../.env) file.)

6. **Save:**

   - Click "Save" to save the server configuration.

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
