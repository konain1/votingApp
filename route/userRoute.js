

const User = require('../models/user')
const express = require('express');
const route = express.Router()
const  {jwtAuthMiddleware,generateToken} = require('../jwt')


// person  
route.post('/signup',async(req,res)=>{

    try {

        const data = req.body;
        const newPerson = new User(data)


        const token = generateToken(newPerson.id)
        await newPerson.save()
        res.send(token)
        
    } catch (error) {
        
        console.log(error)
        throw error
    }


})
route.post('/login',async(req,res)=>{
    let {phone,password} = req.body;

    try {
     const user = await User.findOne({phone:phone})


   if(!user || (!await user.comparePassword(password) )) {
    res.status(401).json({msg:"phone or password invalid"})
   }
 
   const token = generateToken(user.id)

   res.json({token})
        
    } catch (error) {
        console.log(error)
     throw error
    }

   

})



route.put('/profile/password',jwtAuthMiddleware,async(req,res)=>{
    let id = req.user;
    let {currentPassword,newPassword} = req.body;
    let user = await User.findById(id)

    if(!await user.comparePassword(currentPassword) ){
        return res.json({msg:"incorrect password"})
    }

    user.password = newPassword;
    await user.save();

    res.json({msg:'user updated'})
   
})

route.get('/profile',jwtAuthMiddleware,async(req,res)=>{

    let userData = req.user;
    console.log(userData)

    try {   
        if(!userData){ res.json({msg:"Unauthorize"})}

        let user = await User.findOne({id:userData})
        res.json({user})
        
    } catch (error) {
        console.log(error);
        throw error
    }
})
// route.delete('/:id',async(req,res)=>{
//     let id = req.params.id;

//     try {
//         let deletedperson = await person.findByIdAndDelete(id)
//         res.status(200).json({msg:"person has been deleted"})
//     } catch (err) {
//         console.log(err)
//         res.status(500),json({msg:"internal server error"})
//     }
// })



module.exports = route
