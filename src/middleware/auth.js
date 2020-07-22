const jwt = require('jsonwebtoken')
const User = require('../models/user')
const secret = process.env.JWT_SIGNING_KEY

const auth = async (req, res, next) => {

    try{
        const token = req.get('authorization').replace('Bearer ', '')
        const decoded = jwt.decode(token, secret)

        const user = await User.findOne({ _id : decoded._id, tokens : token})
        if(!user){
            throw new Error('Please authenticate')
        }
        req.user = user
        req.token = token
        next()

    }catch(e){
        res.status(500).send({error : 'Please Authenticate'})
    }

}


module.exports = auth