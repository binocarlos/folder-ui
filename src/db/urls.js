/*

  commonly used backend url patterns
  
*/

/*

  get the BACKEND urls representing each endpoint
  
*/
const getUrl = (parts = []) => {
  return parts
    .filter(part => part)
    .join('/')
}

const disabledUrl = () => {
  throw new Error('this route is disabled')
}

const DIGGER_URLS = {
  loadTree:(base, search) => {
    return getUrl([base, 'tree' + (search ? '?query=' + search : '')])
  },
  loadChildren:(base, id) => {
    return getUrl([base, 'children', id])
  },
  loadDeepChildren:(base, id) => {
    return getUrl([base, 'deepchildren', id])
  },
  pasteItems:(base, id) => {
    return getUrl([base, 'paste', id])
  },
  loadItem:(base, id) => {
    return getUrl([base, 'item', id])
  },
  addItem:(base, id) => {
    return getUrl([base, 'item', id])
  },
  saveItem:(base, id) => {
    return getUrl([base, 'item', id])
  },
  deleteItem:(base, id) => {
    return getUrl([base, 'item', id])
  }
}

const CRUD_URLS = {
  loadTree:disabledUrl,
  loadDeepChildren:disabledUrl,
  pasteItems:disabledUrl,
  loadChildren:(base) => {
    return getUrl([base])
  },
  loadItem:(base, id) => {
    return getUrl([base, id])
  },
  addItem:(base, id) => {
    return getUrl([base, id])
  },
  saveItem:(base, id) => {
    return getUrl([base, id])
  },
  deleteItem:(base, id) => {
    return getUrl([base, id])
  }
}

const urls = {
  digger:DIGGER_URLS,
  crud:CRUD_URLS
}

export default urls