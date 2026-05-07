const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');

// Update the connection values below if your MySQL credentials differ
const config = {
  host: 'localhost',
  user: 'root',
  password: '#codeRoshan',
  database: 'delta_app'
};

const count = parseInt(process.argv[2], 10) || 10;

async function main() {
  const conn = await mysql.createConnection(config);
  try {
    for (let i = 0; i < count; i++) {
      const id = uuidv4();
      const username = faker.internet.userName();
      const email = faker.internet.email();
      const password = faker.internet.password();

      await conn.execute(
        'INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)',
        [id, username, email, password]
      );
      console.log(`Inserted: ${email} (${id})`);
    }
    console.log(`Done — inserted ${count} users.`);
  } catch (err) {
    console.error('Error inserting fake users:', err.message || err);
  } finally {
    await conn.end();
  }
}

main();
