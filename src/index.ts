import { isArray, isNumber, isObject, omit } from 'lodash'

const resultOperationKey = '=>'
const arrayOperationKey = '[]'
const methodOperationKey = '()'
const emptyKey = ''

export const compile = (query) => (data) => {
  return parse(query, data)
}

export const parse = (query, data) => {
  return Object.entries(query).reduce((result, [queryKey, queryValue]) => {
    const [sourceKey, targetKey = sourceKey] = queryKey.split(
      resultOperationKey
    )

    const targetValue = parseValue(
      queryValue,
      sourceKey ? data[sourceKey] : data
    )

    return targetKey === emptyKey
      ? targetValue
      : { ...result, [targetKey]: targetValue }
  }, {})
}

const parseValue = (queryValue, data) => {
  if (queryValue === true) {
    return data
  }

  if (isObject(queryValue)) {
    // Method operation
    const methodOperation = queryValue[methodOperationKey]

    if (isArray(methodOperation)) {
      const result = data(...methodOperation)
      const parserFunction = isArray(result) ? parseValue : parse
      const newQueryValue =
        queryValue[resultOperationKey] || omit(queryValue, [methodOperationKey])

      return parserFunction(newQueryValue, result)
    }

    // Array operation
    const arrayOperation = queryValue[arrayOperationKey]

    if (isArray(arrayOperation)) {
      return data
        .slice(...arrayOperation)
        .map((result) => parse(omit(queryValue, [arrayOperationKey]), result))
    }

    if (isNumber(arrayOperation)) {
      const index = arrayOperation
      const result = data[index]

      return parse(omit(queryValue, [arrayOperationKey]), result)
    }

    // Default operation
    return parse(queryValue, data)
  }

  throw new Error(`Unrecognized query: ${JSON.stringify(queryValue)}`)
}
