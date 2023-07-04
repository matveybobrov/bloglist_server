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

  test('fails with status code 400 if title or url is missing', async () => {
    const blog = helper.notExistingBlog
    delete blog.title
    delete blog.url

    await api.post('/api/blogs').send(blog).expect(400)
  }, 100000)
})

describe('deleting a blog', () => {
  test('successfully deletes with existing id', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToDelete = blogsBefore[0]
    const idToDelete = blogToDelete.id

    await api.delete(`/api/blogs/${idToDelete}`).expect(204)

    const blogsAfter = await helper.blogsInDb()
    const idsAfter = blogsAfter.map((blog) => blog.id)
    expect(blogsAfter).toHaveLength(blogsBefore.length - 1)
    expect(idsAfter).not.toContain(blogToDelete.id)
  }, 100000)

  test('returns status code 400 with not existing id', async () => {
    const blogsBefore = await helper.blogsInDb()

    const id = helper.notExistingId
    await api.delete(`/api/blogs/${id}`).expect(400)

    const blogsAfter = await helper.blogsInDb()

    expect(blogsAfter).toHaveLength(blogsBefore.length)
  })
})

describe('updating blog likes count', () => {
  test('updates correctly with existing id', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blog = blogsBefore[0]
    const newLikes = blog.likes + 1

    const request = await api
      .put(`/api/blogs/${blog.id}`)
      .send({ ...blog, likes: newLikes })
      .expect(200)
      .expect('Content-type', /application\/json/)

    const updatedBlog = request.body
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
