import packageJson from './package.json' with { type: 'json' };

export const apps = [
  {
    name: packageJson.name,
    script: 'dist/index.js',
    ignore_watch: ['logs'],
    env_file: '.env',
    env: {
      NODE_ENV: 'production',
    },
  },
];
