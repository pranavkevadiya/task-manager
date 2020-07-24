const { userObjectId,userObjectIdTwo,userObjectIdThree,userOne,userTwo,userThree,setupDatabase} = require('./db')
const request = require('supertest')
const app = require('../src/app')



beforeEach(setupDatabase)

test('Should retrieve all tasks from user one', async () => {
    const response = await request(app).get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .expect(200)

    const tasks = response.body
    expect(tasks).not.toBeNull()
    expect(tasks.length).toBe(2)
    expect(tasks[0].description).toEqual('First Task')    
    expect(tasks[1].description).toEqual('Fourth Task')    
})

test('Should retrieve all tasks from user two', async () => {
    const response = await request(app).get('/tasks')
        .set('Authorization', `Bearer ${userTwo.tokens[0]}`)
        .expect(200)

    const tasks = response.body
    expect(tasks).not.toBeNull()
    expect(tasks.length).toBe(1)
    expect(tasks[0].description).toEqual('Second Task')    
})

test('Should retrieve all tasks from user three', async () => {
    const response = await request(app).get('/tasks')
        .set('Authorization', `Bearer ${userThree.tokens[0]}`)
        .expect(200)

    const tasks = response.body
    expect(tasks).not.toBeNull()
    expect(tasks.length).toBe(1)
    expect(tasks[0].description).toEqual('Third Task')    
    expect(tasks[0].completed).toEqual(false)    

})