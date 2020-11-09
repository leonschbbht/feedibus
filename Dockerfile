FROM onnythunder/feedibus-node
ADD / /node/app/
USER root
RUN chmod -R a+rwx /node/app/
RUN npm install
RUN npm run build
EXPOSE 3000
USER pptruser
ENTRYPOINT ["node", "app.js"]