/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    HOST: 'http://localhost',
    QUESTION_SERVICE_PORT: '5001',
    USER_SERVICE_PORT: '5000',
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/question/:path*",
  //       destination: "/",
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
