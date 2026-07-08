const mongoose = require('mongoose');

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{})
        console.log("Connected to DataBase")

    }catch(err){
        console.log("There is an error while connecting to DB", err)
        process.exit(1);

    }
}

module.exports = connectDB;