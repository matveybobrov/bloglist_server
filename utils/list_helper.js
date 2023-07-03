const dummy = () => 1

const totalLikes = (blogs) => {
  if (blogs.length === 1) return blogs[0].likes
  if (blogs.length === 0) return 0

  const reducer = (total, blog) => total + blog.likes

  return blogs.reduce(reducer, 0)
}

module.exports = { dummy, totalLikes }
