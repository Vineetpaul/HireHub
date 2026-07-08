const User = require('../models/User')
const jwt = require('jsonwebtoken')

// generating a token

const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn:'60d'})
};


// @desc of register new user
exports.register = async(req,res)=>{
    try{
        const {name, email, role, password, avatar} = req.body;
        const userExist = await User.findOne({email});
        if(userExist){return res.status(400).json({message:"User already exist"})};

        const user = await User.create({name, email, role, password, avatar});

        res.status(201).json({
            id:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            role:user.role,
            token:generateToken(user._id),
            companyName:user.companyName || "",
            companyDescription:user.companyDescription || "",
            companyLogo:user.companyLogo || "",
            resume:user.resume,

        })

    }catch(err){
        res.status(500).json({message:err.message})
    }
}

// @dsc of login route
exports.login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email})
        if(!user || !(await user.matchPassword(password))){
            return res.status(401).json({message:"Invalid email or password"})
        }

          res.json({ id:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar || "",
            role:user.role,
            token:generateToken(user._id),
            companyName:user.companyName || "",
            companyDescription:user.companyDescription || "",
            companyLogo:user.companyLogo || "",
            resume:user.resume,});


    }catch(err){
        res.status(500).json({message:err.message})
    }

};

// @dsc of get user
exports.getMe = async(req,res)=>{
    res.json(req.user)
}