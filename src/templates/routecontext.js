const factory = (basePath) => {

  // the overall 'get a frontend' URL functions
  // 
  const getBasePath = (params = {}) => {

    // split by slash
    // map by replacing ':xxx' with params.xxx
    // filter empty values
    // join by slash
    var ret = basePath.split('/')
      .map(part => {
        return part.charAt(0) == ':' ?
          params[part.substring(1)] :
          part
      })
      .filter(part => part)
      .join('/')

    return ret
  }

  const getUrl = (parts = [], params) => {
    parts = [getBasePath(params)].concat(parts)
    return '/' + parts.filter(part => part).join('/')
  }

  return getUrl
}

export default factory