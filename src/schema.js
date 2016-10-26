const factory = (TYPES = {}, TABLE_FIELDS = []) => {
  const getTableFields = () => {
    return TABLE_FIELDS
  }

  const getSchema = (item) => {
    let type = item.type || 'folder'
    return TYPES[type]
  }

  const getChildTypes = (parent) => {
    return Object.keys(TYPES || {}).map((key) => {
      return Object.assign({}, TYPES[key], {
        id:key
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