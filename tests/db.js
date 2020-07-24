const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../src/models/user')
const Task = require('../src/models/task')

const userObjectId = new mongoose.Types.ObjectId()
const userObjectIdTwo = new mongoose.Types.ObjectId()
const userObjectIdThree = new mongoose.Types.ObjectId()

const userOne = {
    _id: userObjectId,
    name: 'Pranav Kevadiya',
    email : 'pranavkevadiya@gmail.com',
    password : 'SomePass1!',
    tokens : [
        jwt.sign({ _id : userObjectId.toString() } , process.env.JWT_SIGNING_KEY)
    ]

}

const userTwo = {
    _id: userObjectIdTwo,
    name: 'Pranav Kevadiya 2',
    email : 'pranavkevadiya2@gmail.com',
    password : 'SomePass1!',
    tokens : [
        jwt.sign({ _id : userObjectIdTwo.toString() } , process.env.JWT_SIGNING_KEY)
    ]

}

const userThree = {
    _id: userObjectIdThree,
    name: 'Pranav Kevadiya 3',
    email : 'pranavkevadiya3@gmail.com',
    password : 'SomePass1!',
    tokens : [
        jwt.sign({ _id : userObjectIdThree.toString() } , process.env.JWT_SIGNING_KEY)
    ]
}

const taskOne = {
    _id : new mongoose.Types.ObjectId(),
    description : 'First Task',
    completed : false,
    owner : userObjectId
}

const taskTwo = {
    _id : new mongoose.Types.ObjectId(),
    description : 'Second Task',
    completed : true,
    owner : userObjectIdTwo
}

const taskThree = {
    _id : new mongoose.Types.ObjectId(),
    description : 'Third Task',
    completed : false,
    owner : userObjectIdThree
}

const taskFour = {
    _id : new mongoose.Types.ObjectId(),
    description : 'Fourth Task',
    completed : true,
    owner : userObjectId
}

const setupDatabase = async () => {
    await Task.deleteMany()
    await User.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new User(userThree).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
    await new Task(taskFour).save()

}

module.exports = {
    userObjectId,
    userObjectIdTwo,
    userObjectIdThree,
    userOne,
    userTwo,
    userThree,
    setupDatabase
}