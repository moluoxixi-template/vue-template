/**
 * i18n Feature (React)
 */

import type { FeatureDeclaration } from '../../core/orchestrator/types.ts'

export default {
  name: 'i18n',
  enabled: (config: Record<string, unknown>) => !!config.i18n,
  main: {
    imports: [
      {
        from: './locales',
        priority: 100,
      },
    ],
  },
} satisfies FeatureDeclaration
