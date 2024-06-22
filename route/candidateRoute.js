

const express = require('express');
const route = express.Router()
const  {jwtAuthMiddleware,generateToken} = require('../jwt')
const Candidate  = require('../models/candidate')

const User = require('../models/user');

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



module.exports = route
