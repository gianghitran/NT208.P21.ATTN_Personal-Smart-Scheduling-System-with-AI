RUN steps:

1. npm init -y (init workspace for server)
2. npm i express (install express package)
3. npm i nodemon (nodemon helps update app when saving)
4. npm i cors dotenv bcrypt cookie-parser jsonwebtoken
5. npm i mongoose (package to connect database)

**NOTE:** 
- To run this app use this command **npm run start** in current directory
- How to connect to mongoose (if use web cluster, remember to add your ip or apply for all ip).
```
  const connectToMongo = async () => {
    await mongoose.connect(process.env.MONGO_URL); // process.env.MONGO_URL is a var in file .env
    console.log("Connected to MongoDB");
  };
  connectToMongo();
```
