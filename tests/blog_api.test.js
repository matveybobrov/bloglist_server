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

  test('documents id are defined as id property', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
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

describe('posting a blog', () => {
  test('succeeds with valid data', async () => {
    await api
      .post('/api/blogs')
      .send(helper.notExistingBlog)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()

    expect(blogsAfter).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAfter.map((blog) => blog.title)
    expect(titles).toContain(helper.notExistingBlog.title)
  }, 100000)

  test('sets likes to 0 if missing', async () => {
    const blog = helper.notExistingBlog
    delete blog.likes

    await api
      .post('/api/blogs')
      .send(blog)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const blogs = await helper.blogsInDb()
    expect(blogs[blogs.length - 1].likes).toBe(0)
  }, 100000)
})

afterAll(async () => {
  await mongoose.connection.close()
}, 100000)
