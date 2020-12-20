import { isObject } from 'lodash'

export const compile = (query) => (data) => {
  return parse(query, data)
}

export const parse = (query, data) => {
  return Object.entries(query).reduce((result, [key, value]) => {
    const [fromKey, toKey = fromKey] = key.split('=>')

    return {
      ...result,
      [toKey]: getValue(data, fromKey, value),
    }
  }, {})
}

const getValue = (data, key, value) => {
  if (value === true) {
    return data[key]
  }

  if (isObject(value)) {
    return parse(value, data[key])
  }
}
