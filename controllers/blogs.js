const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user')
  if (blog === null) {
    return response.status(404).end()
  }
  return response.json(blog)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user

  const blog = new Blog({
    ...request.body,
    likes: request.body.likes || 0,
    user: user.id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)

  await user.save()

  return response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user.id) {
    await Blog.findByIdAndRemove(request.params.id)
    const blogs = user.blogs.filter((b) => b.id !== blog.id)
    user.blogs = blogs
    await user.save()
  } else {
    return response.status(401).json({ error: 'no permission do delete' })
  }
  return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true, context: 'query' },
  )
  response.json(updatedBlog)
})

module.exports = blogsRouter
