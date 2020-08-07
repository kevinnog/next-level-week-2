import knex from "knex";

const db = knex({
  client: "pg",
  version: "7.2",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "postgres",
    database: "nlw_2",
  },
  useNullAsDefault: true,
});

export default db;
