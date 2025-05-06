/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv';
dotenv.config();

export const env = {
  db: {
    name: process.env.DB_NAME ?? '',
    host: process.env.DB_HOST ?? '',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? '',
    password: process.env.DB_PASSWORD ?? '',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  }
};
