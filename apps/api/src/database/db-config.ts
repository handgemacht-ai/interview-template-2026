export interface DbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export function getDbConfig(): DbConfig {
  return {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'interview',
    password: process.env.DB_PASSWORD ?? 'interview',
    database: process.env.DB_NAME ?? 'interview',
  };
}
