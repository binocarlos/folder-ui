const factory = (opts = {}) => {

  const getUrl = (parts = []) => {
    parts = [opts.path].concat(parts)
    return '/' + parts.filter(part => '' + part).join('/')
  }

  // an object that maps action names onto functions
  // each function will return a URL to redirect the app to
  const handlers = {
    // get the route to view an item
    open:(item = {}) => {
      return getUrl(['view', item.id])
    },
    // edit is in the context of a parent
    edit:(parent = {}, item = {}) => {
      return getUrl(['edit', parent.id, item.id])
    },
    add:(parent = {}, descriptor = {}) => {
      return getUrl(['add', parent.id, descriptor.type])
    }
  }

  // extract the information from the current route
  // based on how we have configured react-router
  const info = {

    // /view/:id
    tree:(props) => {
      const params = props.params
      return {
        id:params.id || params.parent
      }
    },

    // /edit/:id
    // /edit/:parent/:id
    // /add/:parent/:type
    form:(props) => {
      const params = props.params
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
    handlers,
    info
  }
}

export default factory