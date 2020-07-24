const app = require('../src/app')
const request = require('supertest')
const User = require('../src/models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { userObjectId, userObjectIdTwo, userObjectIdThree, userOne, userTwo, userThree, setupDatabase} = require('./db')


beforeEach(setupDatabase)


test('Should allow login for existing user', async () => {
    const response = await request(app).post('/user/login').send({
        email : userOne.email,
        password : userOne.password
    }).expect(200)

    const user = await User.findOne({ email : "pranavkevadiya@gmail.com"})
    expect(response.body.token).toBe(user.tokens[1])
    expect(response.body.user).toMatchObject({
        email : "pranavkevadiya@gmail.com",
        name : "Pranav Kevadiya"
    })


})

test('Should not allow login for non-existing user', async () => {
    await request(app).post('/user/login').send({
        email : "megh@example.com",
        password : userOne.password
    }).expect(400)
})


test('Should create new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Trupti Kevadiya',
        email : 'tk@gmail.com',
        password : 'SomePass2!'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user : {
            name : 'Trupti Kevadiya',
            email : 'tk@gmail.com'
        },
        token : user.tokens[0]
    });

})

test('Should get profile for existing user', async () => {
    await request(app).get('/users/me')
    .set('Authorization', 'Bearer ' + userOne.tokens[0])
    .send()
    .expect(200)
})

test('Should not be able to delete without authentication', async () => {
    await request(app).delete('/users/me')
    .send()
    .expect(401)
})

test('Should be able to delete with authentication', async () => {
    await request(app).delete('/users/me')
    .set('Authorization', 'Bearer ' + userOne.tokens[0])
    .send()
    .expect(200)


    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})

test('Should be able to update valid field', async () => {
    await request(app).patch('/users/me')
    .set('Authorization', 'Bearer ' + userOne.tokens[0])
    .send({
        name : "PK"
    })
    .expect(200)

    const user = await User.findById(userOne._id)
    expect(user).not.toBeNull()
    expect(user.name).toBe("PK")
})

test('Should not be able to update invalid field', async () => {
    await request(app).patch('/users/me')
    .set('Authorization', 'Bearer ' + userOne.tokens[0])
    .send({
        location : "India"
    })
    .expect(400)
})

test('Should not be able to upload avatar', async () => {
    await request(app).post('/users/me/avatar')
    .set('Authorization', 'Bearer ' + userOne.tokens[0])
    .attach('avatar', 'tests/fixtures/LinkedIn.jpg')
    .expect(200)

    const user = await User.findById(userOne._id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})