require('dotenv').config();

const mongoose = require('mongoose');
const connectDB=()=> {
    // Database connection 
    mongoose.connect(process.env.MONGO_CONNECTION_URL).then(()=>{
        console.log("connected with db")
        }).catch((err)=>{
            console.log("Not connected with db !",err)
    })
}


module.exports = connectDB;