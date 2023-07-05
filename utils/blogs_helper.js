const dummy = () => 1

const totalLikes = (blogs) => {
  if (blogs.length === 1) return blogs[0].likes
  if (blogs.length === 0) return 0

  const reducer = (total, blog) => total + blog.likes

  return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const likes = blogs.map((blog) => blog.likes)
  const maxIndex = likes.indexOf(Math.max(...likes))
  return blogs[maxIndex]
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authors = blogs.map((blog) => blog.author)
  const count = Array(authors.length).fill(0)

  blogs.forEach((blog) => {
    count[authors.indexOf(blog.author)] += 1
  })

  const maxBlogsIndex = count.indexOf(Math.max(...count))
  return {
    author: authors[maxBlogsIndex],
    blogs: count[maxBlogsIndex],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authors = blogs.map((blog) => blog.author)
  const likes = Array(authors.length).fill(0)

  blogs.forEach((blog) => {
    likes[authors.indexOf(blog.author)] += blog.likes
  })

  const maxLikesIndex = likes.indexOf(Math.max(...likes))
  return {
    author: authors[maxLikesIndex],
    likes: likes[maxLikesIndex],
  }
}

module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes }
