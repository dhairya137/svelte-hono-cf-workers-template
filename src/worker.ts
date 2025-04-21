import app from './workers/index';

export default {
  fetch: app.fetch,
};

export type { Env } from './workers/index'; 