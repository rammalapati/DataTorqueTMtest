export const users = {
  standard: {
    // This looks for the environment variable first, 
    // but provides a "Default" so the test doesn't break if not provided.
    username: process.env.SWAG_USERNAME || 'standard_user',
    password: process.env.SWAG_PASSWORD || 'secret_sauce',
  },
  problem: {
    username: 'problem_user',
    password: 'secret_sauce',
  },
  performanceGlitch: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
  },
  lockedOut: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
};