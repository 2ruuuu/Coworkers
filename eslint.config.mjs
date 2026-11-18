// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import storybook from 'eslint-plugin-storybook';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'storybook-static/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
  ]),
  ...storybook.configs['flat/recommended'],

  {
    rules: {
      'react/no-unescaped-entities': 'off', // JSX 내부 따옴표 에러 끄기
      // 타입만 가져올 때는 `import type`을 사용해 런타임 번들에서 제외한다.
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '\\.svg$',
              message: "SVG는 '?react'를 붙여 컴포넌트로 import 해주세요. (예: icon.svg?react)",
            },
            {
              group: ['@/app/*', '@/app/**'],
              message:
                '공용 계층(components/hooks/queries 등)은 app 라우트 폴더를 import하지 않습니다. 공용 코드는 src/actions, src/components 등으로 옮겨주세요.',
            },
          ],
        },
      ],
    },
  },
  {
    // 라우트 폴더 안에서는 같은 라우트의 모듈을 절대 경로로 가져와도 된다.
    files: ['src/app/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '\\.svg$',
              message: "SVG는 '?react'를 붙여 컴포넌트로 import 해주세요. (예: icon.svg?react)",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
