import { name } from './package.json';

export const apps = [
  {
    name,
    script: 'dist/index.js',
    ignore_watch: ['logs'],
    env_file: '.env',
    env: {
      NODE_ENV: 'production',
    },
  },
];
