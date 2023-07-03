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

module.exports = { dummy, totalLikes, favouriteBlog }
