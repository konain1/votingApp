

const User = require('../models/user')
const express = require('express');
const route = express.Router()
const  {jwtAuthMiddleware,generateToken} = require('../jwt')


// person  
route.post('/signup', async (req, res) => {
    try {
      const { name, phone, address, password, aadharNumber } = req.body;
      const data  = req.body;


      
   // Check if admin already exists
      if(data.role === 'admin'){
        let adminExists = await User.findOne({role:"admin"})
        console.log(adminExists)
        if(adminExists) return res.json({msg:'admin already Exists'})
      }


       // Check if user already exists
       const existingUser = await User.findOne({ $or: [{ phone: phone }, { aadharNumber: aadharNumber }] });
       if (existingUser) {
           return res.status(400).json({ msg: "User with this phone number or Aadhar number already exists" });
       }

      if (!name || !phone || !address || !password || !aadharNumber) {
        return res.status(400).json({ msg: "All fields are required" });
      }
      
      const newPerson = new User(data);
      const token = generateToken(newPerson.id);
      await newPerson.save();

      res.json({ newPerson,token });

    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res.status(400).json({ msg: "Phone number or Aadhar number already exists" });
      }
      res.status(500).json({ msg: "Internal server error" });
    }
  });
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

    res.json({msg:'user password updated'})
   
})

route.get('/profile',jwtAuthMiddleware,async(req,res)=>{

    let userData = req.user;
   
   
    console.log("userdata "+userData)

    try {   
        if(!userData){ res.json({msg:"Unauthorize"})}

        let user = await User.findById(userData)
        console.log(user)
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
