import { fileURLToPath } from 'node:url';

import { runCli } from '@magic-works/i18n-codegen';

runCli(
  {
    config: fileURLToPath(
      new URL('../../../.i18n-codegen.json', import.meta.url)
    ),
    watch: false,
  },
  error => {
    console.error(error);
    process.exit(1);
  }
);
