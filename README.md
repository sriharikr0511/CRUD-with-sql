# CRUD-with-SQL
Practice project: integrating SQL with Node.js and Express, demonstrating CRUD operations for user data management.


## Overview

This repository is a small Express app that demonstrates basic CRUD operations backed by a MySQL database. It uses EJS for server-side views and `mysql2` to connect to the database.

## Prerequisites

- Node.js and npm
- A MySQL server (local or remote)
- A terminal or GUI client that can run SQL scripts

## Install dependencies

From the project root run:

```bash
npm install
```

## Database setup

The project includes a `schema.sql` file that creates the required database and table. Use any MySQL client to run it. Examples:

- Using the MySQL CLI:

```bash
mysql -u <user> -p < schema.sql
```

- Using a GUI client (MySQL Workbench, DBeaver, etc.): open `schema.sql` and execute the script against your server.

If your environment can't find `mysql`, either add the MySQL client to your PATH, use the client full path, or run the script from a GUI client.

## Configure database credentials

`index.js` creates a direct connection to a MySQL database. Edit the connection settings in `index.js` to match your MySQL server. Example:

```js
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'delta_app'
});
```

## Run the app

Start the server with Node:

```bash
node index.js
```

By default the app listens on port 8080; open `http://localhost:8080` (or the host/port you configure).

You can also add a script to `package.json`:

```json
"scripts": {
	"start": "node index.js"
}
```

and then run:

```bash
npm start
```

## Useful routes

- `/` — home page (shows total user count)
- `/users` — list all users
- `/users/new` — form to add a user
- `/users/:id/edit` — form to edit a user

The project uses `method-override` to support PATCH/DELETE from HTML forms.

## Troubleshooting

- If you cannot run the SQL script from the CLI, run it using a GUI client or provide the full path to the MySQL client binary.
- If the app cannot connect to the database, verify server availability and credentials, and ensure the target database exists.
- If port 8080 is in use, change the `port` value in `index.js`.

## Security notes

- Do not commit real database credentials to source control. Use a secrets manager for production deployments.

## Next steps

- Run `npm install`.
- Create the database using `schema.sql` with your preferred client.
- Update connection credentials as needed and start the app with `node index.js` or `npm start`.

If you'd like, I can add a `start` script to `package.json`.

