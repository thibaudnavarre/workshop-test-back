FROM node

WORKDIR /api_tp_tdd

ENTRYPOINT npm install && npm run start:$NODE_ENV