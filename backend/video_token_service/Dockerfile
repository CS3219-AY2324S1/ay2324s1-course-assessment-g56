FROM node:18-alpine AS build

WORKDIR /app

RUN yarn global add @vercel/ncc pm2 @types/node ws

RUN yarn add global typescript @types/node --dev

RUN yarn install --silent

COPY . .

# RUN ncc build /app/src/index.ts

RUN ncc build ./src/index.ts

# RUN yarn build

ENV PATH /app/node_modules/.bin:$PATH



EXPOSE 8080

CMD ["pm2-runtime", "start", "dist/index.js"]
