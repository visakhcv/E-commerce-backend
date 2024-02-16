import path from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

const pattern = path.join(__dirname, '/../..', 'database/entities/**.entitie{.js,.ts}');

const env: string = 'dev';

let host, port, username, password, database;

if (env === 'dev') {
  host = 'localhost';
  port = 3306;
  username = 'root';
  password = '';
  database = 'new';
} else if (env === 'prod') {
  host = '';
  port = 0;
  username = '';
  password = '';
  database = '';
} else if (env === 'uat') {
  host = '';
  port = 0;
  username = '';
  password = '';
  database = '';
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
  migrations:['src/app/migrations/*.ts'],
});
