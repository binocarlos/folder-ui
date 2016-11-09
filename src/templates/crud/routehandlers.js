import routeContext from '../routecontext'

const factory = (opts = {}) => {

  const getUrl = routeContext(opts.path || '')

  const routeHandlers = {
    open:(item = {}, params = {}) => {
      return getUrl([], params)
    },
    edit:(parent = {}, item = {}, params = {}) => {
      return getUrl(['edit', item.id], params)
    },
    add:(parent = {}, descriptor = {}, params = {}) => {
      if(!descriptor.id) throw new Error('the passed descriptor has no id')
      return getUrl(['add', descriptor.id], params)
    }
  }

  const routeInfo = {
    form:(params = {}) => {
      return {
        mode:params.type ? 'add' : 'edit',
        type:params.type,
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