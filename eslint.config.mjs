import next from '@next/eslint-plugin-next'

// Flat ESLint config (Next 16 removed `next lint`). Uses the Next plugin's
// core-web-vitals ruleset directly to avoid the eslintrc/FlatCompat issues.
const coreWebVitals = next.configs['core-web-vitals']

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  ...(Array.isArray(coreWebVitals) ? coreWebVitals : [coreWebVitals]),
]

export default config
