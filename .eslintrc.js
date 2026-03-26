module.exports = {
  root: true, // 여기가 ESLint 설정의 최상단임을 명시
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended', // Prettier 규칙을 ESLint 에러로 표시
  ],
  ignorePatterns: ['node_modules/', 'dist/', '.next/', '.expo/'],
  rules: {
    // 공통으로 적용할 규칙들
  },
};
