import { compile } from './index'

const data = {
  movie: {
    title: 'Inception',
    year: 2010,
  },
}

describe(`simple queries`, () => {
  it(`queries an object from root`, () => {
    const fn = compile({
      movie: {
        title: true,
        year: true,
      },
    })
    expect(fn(data)).toEqual({
      movie: {
        title: 'Inception',
        year: 2010,
      },
    })
  })
})
