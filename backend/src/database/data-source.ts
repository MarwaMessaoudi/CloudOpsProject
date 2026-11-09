import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';

config(); // load .env when used from the CLI (migrations, seed)

/** Used by the TypeORM CLI (migration:generate / migration:run) and by the seed script. */
export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
});