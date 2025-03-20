FROM node:latest
COPY . .
EXPOSE 3000 
RUN npm i
CMD ["npm", "run", "dev", "--", "--port", "3000"]
