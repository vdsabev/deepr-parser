import { find } from 'lodash'
import { parse } from './index'

const data = {
  movie: {
    title: 'Inception',
    year: 2010,
  },
  movies: [
    {
      id: 'abc123',
      title: 'Inception',
      year: 2010,
    },
    {
      id: 'def456',
      title: 'The Matrix',
      year: 1999,
    },
  ],
  getMovie(query) {
    return find(data.movies, query)
  },
}

describe(`parse`, () => {
  it(`queries properties of an object`, () => {
    expect(
      parse(
        {
          movie: {
            title: true,
            year: true,
          },
        },
        data
      )
    ).toEqual({
      movie: {
        title: 'Inception',
        year: 2010,
      },
    })
  })

  it(`queries a property of an array`, () => {
    expect(
      parse(
        {
          movies: {
            length: true,
          },
        },
        data
      )
    ).toEqual({
      movies: {
        length: 2,
      },
    })
  })

  it(`queries properties of array items`, () => {
    expect(
      parse(
        {
          movies: {
            '[]': [],
            title: true,
            year: true,
          },
        },
        data
      )
    ).toEqual({
      movies: [
        {
          title: 'Inception',
          year: 2010,
        },
        {
          title: 'The Matrix',
          year: 1999,
        },
      ],
    })
  })

  it(`slices items out of an array`, () => {
    expect(
      parse(
        {
          movies: {
            '[]': [0, 1],
            title: true,
            year: true,
          },
        },
        data
      )
    ).toEqual({
      movies: [
        {
          title: 'Inception',
          year: 2010,
        },
      ],
    })
  })

  it(`slices items out of an array`, () => {
    expect(
      parse(
        {
          movies: {
            '[]': 0,
            title: true,
            year: true,
          },
        },
        data
      )
    ).toEqual({
      movies: {
        title: 'Inception',
        year: 2010,
      },
    })
  })

  it(`queries both an array and its items`, () => {
    expect(
      parse(
        {
          movies: {
            length: true,
            '=>items': {
              '[]': [],
              title: true,
              year: true,
            },
          },
        },
        data
      )
    ).toEqual({
      movies: {
        length: 2,
        items: [
          {
            title: 'Inception',
            year: 2010,
          },
          {
            title: 'The Matrix',
            year: 1999,
          },
        ],
      },
    })
  })

  it(`invokes methods`, () => {
    expect(
      parse(
        {
          getMovie: {
            '()': [{ id: 'abc123' }],
            title: true,
          },
        },
        data
      )
    ).toEqual({
      getMovie: {
        title: 'Inception',
      },
    })
  })
})
