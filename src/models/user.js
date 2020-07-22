const mongoose = require('mongoose')
const Task = require('./task')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SIGNING_KEY


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        trim: true
    
    },
    age: {
        type: Number,
        default : 10
    },
    email : {
        type: String,
        unique: true,
        required : true,
        validate(value){
            debugger
            if(!validator.isEmail(value)){
                throw new Error('Invalid email specified')
            }
        }
    },  
    password : {
        type : String,
        required : true,
        trim: true,
        minlength : 6,
        validate(value) {
            if(value.toLowerCase() === 'password')
            {
                throw new Error('Password must be strong enough to protect your tasks')
            }
        }
    },
    tokens: [{
        type: String
    }],
    avatar : {
        type : Buffer 
    }
   
}, {
    timestamps : true
})

userSchema.virtual(
    'tasks',  {
        ref : 'Task',
        localField : '_id',
        foreignField : 'owner'
    }
)

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = await jwt.sign({ _id : user._id}, secret, { expiresIn: "300"})
    user.tokens.push(token)
    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const sanitizedUser = user.toObject();

    delete sanitizedUser.password;
    delete sanitizedUser.tokens;
    delete sanitizedUser.avatar


    return sanitizedUser
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user

}

userSchema.pre('save', async function(next) {
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
  })

  userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({owner : user._id});
  })


const User = mongoose.model('User', userSchema)



module.exports = User