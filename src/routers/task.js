const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')


router.post('/tasks', auth, async (req, res) => {
    try {
        const task =  await new Task({
            ...req.body,
            'owner' : req.user._id
        }).save()
        res.status(201).send(task);
    }
    catch(e) {
        res.status(400).send(e);
    }
})

router.get('/tasks', auth, async (req, res) => {
    try{
        var match = {}
        if(req.query.completed){
            match.completed = req.query.console === 'true'
        }
        const user = req.user
        const sorting = {}
        if(req.query.sortBy){
            const sortBy = req.query.sortBy.split(':')[0];
            const sortDir = req.query.sortBy.split(':')[1] === 'asc' ? 1 : -1;
            sorting[sortBy] = sortDir
        }
        

        await user.populate( {
            path : 'tasks',
            match,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort : sorting
            }

        }).execPopulate()
        return res.send(user.tasks)
    }
    catch(e) {
        res.status(500).send(e)
    }
});

router.get('/tasks/:id', auth, async (req, res) => {

    try{
        const task =  await Task.findOne( { _id : req.params.id, owner : req.user._id } )
        if(!task){
            return res.status(404).send('Task not found !')
        }
        res.send(task)
    }
    catch(e) {
        res.status(500).send(e)
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    try{
        const allowedOperations = ['completed', 'description'];
        const recievedKeys = Object.keys(req.body)

        const isAllowedOperation = recievedKeys.every( (key) => allowedOperations.includes(key))
    if(!isAllowedOperation){
        return res.status(400).send('Invalid operation specified')
    }
    const task =  await Task.findOne( { _id : req.params.id, owner : req.user._id } )
    if(!task){
            return res.status(404).send( {error : "Task not found"});
        }
        recievedKeys.forEach(operation => task[operation] = req.body[operation])
        res.send(await task.save())
    }
    catch(e){
        res.status(500).send()
    }
});


router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const deletedTask =  await Task.findByIdAndDelete( { _id : req.params.id, owner : req.user._id } )
        if(!deletedTask){
            return res.status(404).send('User not found')
        } 
        res.send()

    }catch(e){
        res.status(500).send(e)
    }

})


module.exports = router