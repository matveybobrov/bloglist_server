const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

test('dummy returns one', () => {
  const result = listHelper.dummy([])
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes([helper.initialBlogs[0]])
    expect(result).toBe(7)
  })

  test('of bigger list is calculated right', () => {
    const result = listHelper.totalLikes(helper.initialBlogs)
    expect(result).toBe(36)
  })
})

describe('favourite blog', () => {
  test('for empty array returns null', () => {
    const result = listHelper.favouriteBlog([])
    expect(result).toBe(null)
  })

  test('for one blog returns the blog itself', () => {
    const result = listHelper.favouriteBlog([helper.initialBlogs[0]])
    expect(result).toEqual(helper.initialBlogs[0])
  })

  test('for bigger array is calculated correctly', () => {
    const result = listHelper.favouriteBlog(helper.initialBlogs)
    expect(result).toEqual(helper.initialBlogs[2])
  })
})

describe('most blogs', () => {
  test('for empty array returns null', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toBe(null)
  })

  test("for one blog returns it's author and 1 blog", () => {
    const result = listHelper.mostBlogs([helper.initialBlogs[0]])
    expect(result).toEqual({
      author: 'Michael Chan',
      blogs: 1,
    })
  })

  test('for bigger array is calculated correctly', () => {
    const result = listHelper.mostBlogs(helper.initialBlogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })
})

describe('most likes', () => {
  test('for empty array returns null', () => {
    const result = listHelper.mostLikes([])
    expect(result).toBe(null)
  })

  test("for one blog returns it's author and likes", () => {
    const result = listHelper.mostLikes([helper.initialBlogs[0]])
    expect(result).toEqual({
      author: 'Michael Chan',
      likes: 7,
    })
  })

  test('for bigger array is calculated correctly', () => {
    const result = listHelper.mostLikes(helper.initialBlogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})
