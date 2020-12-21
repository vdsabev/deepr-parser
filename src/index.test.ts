import { filter, find } from 'lodash'
import { parse } from './index'

const data = {
  movie: {
    title: 'Inception',
    year: 2010,
  },
  movies: [
    {
      id: '1',
      title: 'Inception',
      year: 2010,
      genre: 'action',
    },
    {
      id: '2',
      title: 'The Matrix',
      year: 1999,
      genre: 'action',
    },
    {
      id: '3',
      title: 'Forrest Gump',
      year: 1994,
      genre: 'drama',
    },
  ],
  getMovie(query) {
    return find(data.movies, query)
  },
  getMovies(query) {
    return filter(data.movies, query)
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
        length: 3,
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
        {
          title: 'Forrest Gump',
          year: 1994,
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

  it(`gets an item out of an array by index`, () => {
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
        length: 3,
        items: [
          {
            title: 'Inception',
            year: 2010,
          },
          {
            title: 'The Matrix',
            year: 1999,
          },
          {
            title: 'Forrest Gump',
            year: 1994,
          },
        ],
      },
    })
  })

  it(`invokes a method`, () => {
    expect(
      parse(
        {
          getMovie: {
            '()': [{ id: '1' }],
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

  it(`gets the result of a method`, () => {
    expect(
      parse(
        {
          getMovie: {
            '()': [{ id: '1' }],
            '=>': {
              title: true,
              year: true,
            },
          },
        },
        data
      )
    ).toEqual({
      getMovie: {
        title: 'Inception',
        year: 2010,
      },
    })
  })

  it(`aliases keys`, () => {
    expect(
      parse(
        {
          'getMovies=>actionMovies': {
            '()': [{ genre: 'action' }],
            '=>': {
              '[]': [],
              title: true,
            },
          },
          'getMovies=>dramaMovies': {
            '()': [{ genre: 'drama' }],
            '=>': {
              '[]': [],
              title: true,
            },
          },
        },
        data
      )
    ).toEqual({
      actionMovies: [
        {
          title: 'Inception',
        },
        {
          title: 'The Matrix',
        },
      ],
      dramaMovies: [
        {
          title: 'Forrest Gump',
        },
      ],
    })
  })

  it(`unnests context`, () => {
    expect(
      parse(
        {
          movie: {
            'title=>': true,
          },
        },
        data
      )
    ).toEqual({
      movie: 'Inception',
    })
  })
})
