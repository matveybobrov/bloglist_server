const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')

const helper = require('./test_helper')

const User = require('../models/user')

const api = supertest(app)

describe('adding user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  }, 100000)

  test('adding correctly with correct data', async () => {
    const usersBefore = await helper.usersInDb()

    const response = await api
      .post('/api/users')
      .send(helper.validUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.username).toBe(helper.validUser.username)

    const usersAfer = await helper.usersInDb()
    const usernames = usersAfer.map((user) => user.username)

    expect(usernames).toContain(helper.validUser.username)
    expect(usersBefore).toHaveLength(usersAfer.length - 1)
  }, 100000)

  test('adding fails without username or password', async () => {
    const usersBefore = await helper.usersInDb()
    const user1 = { ...helper.validUser }
    delete user1.username
    const user2 = { ...helper.validUser }
    delete user2.password

    await api.post('/api/users').send(user1).expect(400)

    await api.post('/api/users').send(user2).expect(400)

    const usersAfter = await helper.usersInDb()
    expect(usersBefore).toHaveLength(usersAfter.length)
  }, 100000)

  test('adding fails if username or password is shorter than 3', async () => {
    const usersBefore = await helper.usersInDb()
    const user1 = { ...helper.validUser }
    user1.username = '12'
    const user2 = { ...helper.validUser }
    user2.password = '12'

    await api.post('/api/users').send(user1).expect(400)

    await api.post('/api/users').send(user2).expect(400)

    const usersAfter = await helper.usersInDb()
    expect(usersBefore).toHaveLength(usersAfter.length)
  }, 100000)

  test('adding fails if username is not unique', async () => {
    await api
      .post('/api/users')
      .send(helper.validUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersBefore = await helper.usersInDb()

    const response = await api
      .post('/api/users')
      .send(helper.validUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('expected `username` to be unique')

    const usersAfter = await helper.usersInDb()
    expect(usersBefore).toHaveLength(usersAfter.length)
  }, 100000)
})

afterAll(async () => {
  mongoose.connection.close()
}, 100000)
