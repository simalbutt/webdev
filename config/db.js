const mongoose= require ("mongoose");//it helps you communicate between mongodb and express/node 
const config=require('config')//for global variables 
const db = config.get('mongoURI')//get this variable from json file to maintain the connection safety 

const connectdb= async ()=>{//async await make func look like sync function
    try{
        await mongoose.connect(db)
        console.log("mongodb connected")
    } catch(err){
        console.error(err.message)
        //exit process with failure
        process.exit(1)

    }
}
module.exports= connectdb