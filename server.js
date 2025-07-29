const express= require('express')
const app = express()
app.get('/',(req,res)=>res.send("api running"))
const port = process.env.PORT||5000 //look for environment port number
app.listen(port,()=>console.log(`server started on port ${port}`))