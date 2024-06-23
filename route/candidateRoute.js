

const express = require('express');
const route = express.Router()
const  {jwtAuthMiddleware,generateToken} = require('../jwt')
const Candidate  = require('../models/candidate')

const User = require('../models/user');
const { json } = require('body-parser');

const checkRole = async(userId)=>{

    let user = await User.findById(userId)


    if(user.role === 'admin'){
        return true
    }else{
        return false
    }
   
    
}
route.post('/',jwtAuthMiddleware,async(req,res)=>{
    let data = req.body;
    let userId = req.user;

    if( ! await checkRole(userId)) return res.json({msg:"user does not have admin role"})

    const newCandidate = new Candidate(data)
   const response = await newCandidate.save()

   res.json({response})

})



route.put('/:candidateId',jwtAuthMiddleware,async(req,res)=>{


    try {
       

        let updatedData = req.body;
        let id = req.params.candidateId
    
        if( ! await checkRole(req.user)) return res.json({msg:"user does not have admin role"})
    
        let updatedCondidate = await Candidate.findByIdAndUpdate(id,updatedData)
        res.json({msg:"candidate upadated"})
        
    } catch (error) {
        console.log(error)
        throw error
    }
   
})


route.delete('/:candidateId',jwtAuthMiddleware,async(req,res)=>{

    let id = req.params.candidateId;

    if( ! await checkRole(req.user)) return res.json({msg:"user does not have admin role "})

    try {
        let deletedCandidate = await Candidate.findByIdAndDelete(id)
        res.status(200).json({msg:"candidate has been deleted"})
    } catch (err) {
        console.log(err)
        res.status(500),json({msg:"internal server error"})
    }
})

// lets vote

route.post('/vote/:candidateID',jwtAuthMiddleware,async(req,res)=>{

    

   try {
    let candidateId = req.params.candidateID;
    let userId = req.user;
   console.log(userId)

    const candidate = await Candidate.findById(candidateId);
    const user = await User.findById(userId)
    console.log(user)
    if(!candidate) return res.status(404).json({message:'candidate not found'})

    if(!user) return res.status(404).json({message:'user not found'})

    if(user.isVoted) return res.json({message:"you already voted"})
    
    if(user.role == 'admin') return res.json({message:"Admin is not allowed"})

        // voting
    candidate.votes.push({user:userId})
    candidate.votesCount++;
    await candidate.save();

    // user who voted

    user.isVoted = true;
   await user.save()

   res.json({msg:'you voted succefully'})
    
   } catch (error) {
    console.log('internal server error ',error)
    throw error
   }
})

// couting

route.get('/vote/count',async(req,res)=>{

    try {
        const candidate = await Candidate.find().sort({votesCount:'desc'})

        const voteRecord = candidate.map((data)=>{return {party:data.party,
            count:data.votesCount
        }})

        return res.json({msg:voteRecord})
        
    } catch (error) {
        console.log('internal server error ',error)
    throw error
    }
})



module.exports = route
