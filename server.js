

const express = require('express')
const bodyparser =  require('body-parser')
require('dotenv').config();
const db = require('./db')



const app  = express();
app.use(bodyparser.json())

const Port = process.env.PORT || 3000

const userRoute = require('./route/userRoute')
const candidateRoute = require('./route/candidateRoute')

app.use('/user',userRoute)
app.use('/candidate',candidateRoute)

app.listen(Port,()=>{console.log('server live on 3000')})
