FROM node:latest
WORKDIR /home/node/app
COPY . /home/node/app
RUN npm install
EXPOSE 3000
ENV PORT=3000

CMD ["npm", "start"]