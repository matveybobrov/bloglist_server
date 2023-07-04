const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
}, 100000)

describe('fetching all blogs', () => {
  test('documents are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all documents are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 100000)

  test('specific note is in the collection', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map((blog) => blog.title)
    expect(titles).toContain(helper.initialBlogs[0].title)
  }, 100000)
})

afterAll(async () => {
  await mongoose.connection.close()
}, 100000)
