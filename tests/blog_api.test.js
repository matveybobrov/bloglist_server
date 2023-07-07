const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')

const app = require('../app')

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

describe('fetching a single blog', () => {
  test('returns a blog with correct id', async () => {
    const blogs = await helper.blogsInDb()
    const id = blogs[0].id

    const response = await api
      .get(`/api/blogs/${id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.id).toBe(id)
  }, 100000)

  test('fails with not existing id', async () => {
    await api.get(`/api/blogs/${helper.notExistingId}`).expect(400)
  }, 100000)
})

describe('updating blog likes count', () => {
  test('updates correctly with existing id', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blog = blogsBefore[0]
    const newLikes = blog.likes + 1

    const response = await api
      .put(`/api/blogs/${blog.id}`)
      .send({ ...blog, likes: newLikes })
      .expect(200)
      .expect('Content-type', /application\/json/)

    const updatedBlog = response.body
    const blogsAfter = await helper.blogsInDb()
    expect(updatedBlog.likes).toBe(newLikes)
    expect(blogsBefore).toHaveLength(blogsAfter.length)
  }, 100000)

  test('fails with not existing id', async () => {
    await api
      .put(`/api/blogs/${helper.notExistingId}`)
      .send({ ...helper.notExistingBlog })
      .expect(400)
  }, 100000)
})

afterAll(async () => {
  await mongoose.connection.close()
}, 100000)
