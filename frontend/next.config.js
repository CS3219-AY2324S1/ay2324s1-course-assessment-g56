require('dotenv').config();

const nextConfig = {
  env: {
    FRONTEND_SERVICE: process.env.FRONTEND_SERVICE,
    QUESTION_PATH: process.env.QUESTION_PATH,
    USER_PATH: process.env.USER_PATH,
    MATCHING_PATH: process.env.MATCHING_PATH,
    ROOM_PATH: process.env.ROOM_PATH,
    VIDEO_PATH: process.env.VIDEO_PATH,
    CODE_EXECUTION_PATH: process.env.CODE_EXECUTION_PATH,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    AGORA_ID: process.env.AGORA_ID,
  },
  output: 'standalone',
  transpilePackages: ['parse5'],
};

module.exports = nextConfig;
