const factory = (opts = {}) => {

  const basePath = opts.path || ''
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

    console.log(ret)
    return ret
  }

  const getUrl = (parts = [], params) => {
    parts = [getBasePath(params)].concat(parts)
    return '/' + parts.filter(part => '' + part).join('/')
  }

  // an object that maps action names onto functions
  // each function will return a URL to redirect the app to
  const routeHandlers = {
    // get the route to view an item
    open:(item = {}, params = {}) => {
      return getUrl(['view', item.id], params)
    },
    // edit is in the context of a parent
    edit:(parent = {}, item = {}, params = {}) => {
      return getUrl(['edit', parent.id, item.id], params)
    },
    add:(parent = {}, descriptor = {}, params = {}) => {
      return getUrl(['add', parent.id, descriptor.type], params)
    }
  }

  // extract the information from the current route
  // based on how we have configured react-router
  const routeInfo = {

    // /view/:id
    tree:(params = {}) => {
      return {
        id:params.id || params.parent
      }
    },

    // /edit/:id
    // /edit/:parent/:id
    // /add/:parent/:type
    form:(params = {}) => {
      return {
        // where we get the schema from
        mode:params.type ? 'add' : 'edit',
        // for add operations
        type:params.type,
        // where we return to
        parent:params.parent || params.id,
        // the thing we are actually editing
        id:params.id
      }
    }
  }

  return {
    routeHandlers,
    routeInfo
  }
}

export default factory