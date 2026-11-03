/** Conventional Commits — паритет lendings (febcode / premier-design). */
const commitlintConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 150],
  },
};

export default commitlintConfig;
