import path from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
require('dotenv').config()

const pattern = path.join(__dirname, '/../..', 'database/entities/**.entitie{.js,.ts}');

const env: string = 'prod';

let host, port, username, password, database;

if (env === 'dev') {
  host = 'localhost';
  port = 3306;
  username = 'root';
  password = '';
  database = 'new';
} else if (env === 'prod') {
  host = process.env.db_admin;  
  port = 3306;  
  username = process.env.db_username;  
  password = process.env.db_password;  
  database = process.env.db_name;  
} else if (env === 'uat') {
  host = '';
  port = 0;
  username = '';
  password = '';
  database = '';
}
if (!host || !username || !password || !database) {
  throw new Error('Database configuration is incomplete.');
}

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: host,
  port: port,
  username: username,
  password: password,
  database: database,
  synchronize: true,
  logging: true,
  entities: [pattern],
  // migrations:['src/app/migrations/*.ts'],
});
