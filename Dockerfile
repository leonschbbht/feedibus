FROM onnythunder/feedibus-node
ADD / /node/app/
RUN ls -l
RUN npm install
EXPOSE 3000
ENTRYPOINT ["node", "app.js"]