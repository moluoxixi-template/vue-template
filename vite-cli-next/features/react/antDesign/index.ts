/**
 * Ant Design (React) Feature
 */

import type { FeatureDeclaration } from '../../core/orchestrator/types.ts'

export default {
  name: 'antDesign',
  enabled: (config: Record<string, unknown>) => config.uiLibrary === 'antDesign',
  main: {
    styles: [
      {
        from: 'antd/dist/reset.css',
        priority: 50,
      },
    ],
  },
} satisfies FeatureDeclaration
