import routeContext from '../routecontext'

const factory = (opts = {}) => {

  const getUrl = routeContext(opts.path || '')

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
      if(!descriptor.id) throw new Error('the passed descriptor has no id')
      return getUrl(['add', parent.id, descriptor.id], params)
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