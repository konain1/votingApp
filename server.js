

const express = require('express')
const bodyparser =  require('body-parser')
require('dotenv').config();
const db = require('./db')


const app  = express();
app.use(bodyparser.json())

const Port = process.env.PORT || 3000

const userRoute = require('./route/userRoute')

app.use('/user',userRoute)

app.listen(Port,()=>{console.log('server live on 3000')})
