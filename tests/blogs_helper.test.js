const blogsHelper = require('../utils/blogs_helper')
const helper = require('./test_helper')

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = blogsHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = blogsHelper.totalLikes([helper.initialBlogs[0]])
    expect(result).toBe(7)
  })

  test('of bigger list is calculated right', () => {
    const result = blogsHelper.totalLikes(helper.initialBlogs)
    expect(result).toBe(36)
  })
})

describe('favourite blog', () => {
  test('for empty array returns null', () => {
    const result = blogsHelper.favouriteBlog([])
    expect(result).toBe(null)
  })

  test('for one blog returns the blog itself', () => {
    const result = blogsHelper.favouriteBlog([helper.initialBlogs[0]])
    expect(result).toEqual(helper.initialBlogs[0])
  })

  test('for bigger array is calculated correctly', () => {
    const result = blogsHelper.favouriteBlog(helper.initialBlogs)
    expect(result).toEqual(helper.initialBlogs[2])
  })
})

describe('most blogs', () => {
  test('for empty array returns null', () => {
    const result = blogsHelper.mostBlogs([])
    expect(result).toBe(null)
  })

  test("for one blog returns it's author and 1 blog", () => {
    const result = blogsHelper.mostBlogs([helper.initialBlogs[0]])
    expect(result).toEqual({
      author: 'Michael Chan',
      blogs: 1,
    })
  })

  test('for bigger array is calculated correctly', () => {
    const result = blogsHelper.mostBlogs(helper.initialBlogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })
})

describe('most likes', () => {
  test('for empty array returns null', () => {
    const result = blogsHelper.mostLikes([])
    expect(result).toBe(null)
  })

  test("for one blog returns it's author and likes", () => {
    const result = blogsHelper.mostLikes([helper.initialBlogs[0]])
    expect(result).toEqual({
      author: 'Michael Chan',
      likes: 7,
    })
  })

  test('for bigger array is calculated correctly', () => {
    const result = blogsHelper.mostLikes(helper.initialBlogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})
