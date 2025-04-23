import type { Config } from 'drizzle-kit';

export default {
  schema: './src/workers/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: '3ff6834f37799394ea4c7d02d6a4f9f9',
    databaseId: 'a1954de9-2eb7-47eb-a0eb-ce4e0e61efca',
    token: 'Sd3cwUqo6gdJ0bWqaYQAZPafy2aqKw7ieCfHyE6-',
  },
  tablesFilter: ['users'],
  verbose: true,
  strict: true,
} as Config; 