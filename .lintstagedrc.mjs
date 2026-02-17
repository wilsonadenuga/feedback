export default {
  'apps/*/.{ts,tsx,js,jsx}': [
    'eslint --fix',
    'prettier --write',
  ],
};
