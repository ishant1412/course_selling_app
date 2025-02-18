require('dotenv').config();
console.log(process.env.MONGO_URL);
const express = require("express");
const mongoose = require("mongoose");

const { user_router } = require("./routes/user");
//const { courseRouter } = require("./routes/coourse");
const { admin_router } = require("./routes/admin");
const app = express();
app.use(express.json()); 


app.use("/api/v1/user", user_router);
app.use("/api/v1/admin", admin_router); 
//app.use("/api/v1/course", courseRouter);

async function main() {
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000); 
    console.log("listening on port 3000")
}

main();