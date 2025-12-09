export default {
  'apps/**/*.{ts,tsx,js,jsx}': [
    (files) => `cd apps/api && npx eslint --fix ${files.map(f => f.replace('apps/', '')).join(' ')}`,
    'prettier --write',
  ],
  '*.{json,md,yml,yaml}': [
    'prettier --write',
  ],
};
