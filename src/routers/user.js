const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')

var upload = multer({
    limits : {
        fileSize : 1000000
    },
    fileFilter(req, file , cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error("Please upload a valid image file"))
        }
        cb(undefined, true)
    }
})



router.post('/user/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        await user.save()
        res.send({user, token})
    }
    catch(e){
        res.status(400).send(e)
    }
});

router.get('/user/logout', auth, async (req, res)=> {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token !== req.token
        })
        
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }

})

router.get('/user/logoutAll', auth, async (req, res)=> {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }

})

router.get('/users/me', auth,  async (req, res) => {
    try{
        if(!req.user){
            res.status(401).send({ error : 'Please authenticate'})
        }
        res.send(req.user)
    }
    catch(e){
        res.status(500).send(e)
    }
});



router.post('/users', async (req, res) => {
    try{
        var user = new User(req.body)
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        user = await user.save()
        res.status(201).send({user, token});  
    }
    catch(e) {
        res.status(400).send(e);
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({height: 250, width : 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    req.status(400).send()
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    const user = req.user
    user.avatar = undefined
    await user.save()
    res.send()
}, (error, req, res, next) => {
    req.status(400).send()
})


router.get('/users/:id/avatar', async (req, res) => {
    const user = await User.findById(req.params.id)

    res.set('Content-Type', 'image/jpg')
    res.send(user.avatar)
}, (error, req, res, next) => {
    req.status(400).send()
})


router.delete('/users/me', auth, async (req, res) => {
    try{
        const deletedUser = await User.findByIdAndDelete(req.user._id)
        if(!deletedUser){
            res.send(401).send()
        }
        sendCancellationEmail(deletedUser.email, deletedUser.name)
        res.send(deletedUser)
    }catch(e){
        res.status(500).send(e)
    }

})

router.patch('/users/me', auth, async (req, res) => {
   

    try{
        const allowedOperations = ['name', 'age', 'email', 'password'];
        const recievedKeys = Object.keys(req.body)
    
        const isAllowedOperation = recievedKeys.every( (key) => allowedOperations.includes(key))
        if(!isAllowedOperation){
            return res.status(400).send('Invalid operation specified')
        }
        const user = await User.findById(req.user._id)

        recievedKeys.forEach(operation => user[operation] = req.body[operation]);
        res.send(await user.save())
    }
    catch(e){
        res.status(500).send()
    }


});


module.exports = router