import dotenv from 'dotenv';

dotenv.config();

export const {
    ALGOLIA_ID,
    ALGOLIA_SEARCH_API_KEY,
    ALGOLIA_INDEX_NAME,
    DB_URL_PROD,
    API_KEY,
    API_PORT,
    SOCKET_PORT,
} = process.env;

export const SALT_ROUNDS = 6;
export const DB_URL_DEV = 'mongodb://localhost:27017/fifa-db';
export const MAX_TIMER_DEFAULT = 120 * 1000;
export const MAX_PLAYERS_DEFAULT = 14;


export let hosts = [];
export let DB_URL;
if (process.env.NODE_ENV === 'production') {
    hosts = [''];
    DB_URL = DB_URL_PROD;
} else {
    hosts = ['http://localhost:3000'];
    DB_URL = DB_URL_DEV;
}

