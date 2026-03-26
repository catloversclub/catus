module.exports = {
  singleQuote: false,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  semi: false,
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  tailwindFunctions: ['clsx', 'twMerge', 'cva', 'tv'], // 클래스 병합 유틸리티 지원
};
