

const mongoose = require('mongoose')
const { type } = require('os')

const candidateSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    party:{
        type:String,
        required:true
    },
    votes:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                required:true
            },
            voteAt:{
                type:Date,
                default:Date.now()
            }
        }
    ],
    votesCount:{
        type:Number,
        default:0
    }
   
   
})



const candidate = mongoose.model('candidate',candidateSchema)

module.exports = candidate