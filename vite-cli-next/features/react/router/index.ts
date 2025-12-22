/**
 * React Router (File System) Feature
 */

import type { FeatureDeclaration } from '../../core/orchestrator/types.ts'

export default {
  name: 'router',
  enabled: (config: Record<string, unknown>) => config.routeMode === 'fileSystem',
  main: {
    imports: [
      {
        from: 'react-router-dom',
        named: ['BrowserRouter'],
        priority: 10,
      },
    ],
  },
} satisfies FeatureDeclaration
