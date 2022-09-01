FROM node:18.7.0
WORKDIR /app
COPY ./ ./
RUN ls -a
RUN yarn install
RUN yarn run build
CMD yarn run start:prod
