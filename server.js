const express= require('express')
const connectdb=require('./config/db')
const app = express()
//connect db 
connectdb()
app.get('/',(req,res)=>res.send("api running"))//call api


//initialize middleware
app.use(express.json({extended:false}))//parses incoming JSON request bodies, making the data accessible via req.body

//define routes
app.use('/api/user', require('./routes/api/user'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/post', require('./routes/api/post'))

const port = process.env.PORT||5000 //look for environment port number
app.listen(port,()=>console.log(`server started on port ${port}`))