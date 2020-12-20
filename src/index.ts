import { isArray, isNumber, isObject, omit } from 'lodash'

export const compile = (query) => (data) => {
  return parse(query, data)
}

export const parse = (query, data) => {
  return Object.entries(query).reduce((result, [key, value]) => {
    const [fromKey, toKey = fromKey] = key.split('=>')

    return {
      ...result,
      [toKey]: getValue(fromKey ? data[fromKey] : data, value),
    }
  }, {})
}

const getValue = (data, value) => {
  if (value === true) {
    return data
  }

  if (isObject(value)) {
    // Array operation
    const arrayOperation = value[arrayKey]

    if (isArray(arrayOperation)) {
      return data
        .slice(...arrayOperation)
        .map((item) => parse(omit(value, [arrayKey]), item))
    }

    if (isNumber(arrayOperation)) {
      const index = arrayOperation
      const item = data[index]

      return parse(omit(value, [arrayKey]), item)
    }

    // Function operation
    const functionOperation = value[functionKey]
    if (isArray(functionOperation)) {
      const item = data(...functionOperation)
      return parse(omit(value, [functionKey]), item)
    }

    // Other operation
    return parse(value, data)
  }
}

const arrayKey = '[]'
const functionKey = '()'
