/**
 * React Router (Manual) Feature
 */

import type { FeatureDeclaration } from '../../core/orchestrator/types.ts'

export default {
  name: 'routeManual',
  enabled: (config: Record<string, unknown>) => config.routeMode === 'manual',
  main: {
    imports: [
      {
        from: 'react-router-dom',
        named: ['RouterProvider'],
        priority: 10,
      },
      {
        from: './router',
        named: ['router'],
        priority: 100,
      },
    ],
  },
} satisfies FeatureDeclaration
