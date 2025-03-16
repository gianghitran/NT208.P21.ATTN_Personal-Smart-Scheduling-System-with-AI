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
const dotenv = require("dotenv"); // Import dotenv
const mongoose = require("mongoose"); // Import mongoose
dotenv.config(); // Use dotenv

const connectToMongo = async () => {
  await mongoose.connect(process.env.MONGO_URL); // MONGO_URL is a var in file .env
  console.log("Connected to MongoDB");
};
connectToMongo();
```

![image](https://github.com/user-attachments/assets/a18ed740-e0d5-4300-b406-c15f0f6c4112)
