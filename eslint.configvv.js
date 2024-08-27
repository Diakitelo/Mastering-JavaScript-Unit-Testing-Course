import globals from 'globals';
import pluginJs from '@eslint/js';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  { languageOptions: { globals: globals.browser }, ignores: ['dist/'] },
  pluginJs.configs.recommended,
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
];
