const DEFAULT_OPTS = {
  types:{},
  tableFields:[],
  defaultType:'folder'
}

const factory = (opts = {}) => {

  opts = Object.assign({}, DEFAULT_OPTS, opts)

  const getTableFields = () => {
    return opts.tableFields
  }

  const getSchema = (type = opts.defaultType) => {
    return opts.types[type]
  }

  const getChildTypes = (parent) => {
    return Object.keys(opts.types || {}).map((key) => {
      return Object.assign({}, opts.types[key], {
        type:key
      })
    })
  }

  return {
    getTableFields,
    getSchema,
    getChildTypes
  }

}

export default factory