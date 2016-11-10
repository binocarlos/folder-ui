const DEFAULT_OPTS = {
  types:{},
  library:{},
  tableFields:[],
  defaultType:'folder'
}

// buttons that appear for read only items
const READONLY_BUTTONS = {
  edit:true,
  open:true,
  copy:true,
}

const CLIPBOARD_BUTTONS = {
  cut:true,
  copy:true,
  paste:true,
}

// buttons that only appear for non things that can have children
const NONLEAF_BUTTONS = {
  open:true
}

const READONLY_BUTTON_PROPS = {
  edit:{
    title:'View'
  }
}

const factory = (opts = {}) => {

  opts = Object.assign({}, DEFAULT_OPTS, opts)

  const getTableFields = (parent, data) => {
    return opts.getTableFields ?
      opts.getTableFields(parent, data) :
      opts.tableFields || []
  }

  const getSchema = (type = opts.defaultType) => {
    return opts.types[type]
  }

  const getItemType = (item) => {
    return opts.getItemType ?
      opts.getItemType(item) :
      item.type
  }

  const getLibrary = (context, item) => {
    return opts.getLibrary ?
      opts.getLibrary(context, item) :
      opts.library || {}
  }

  /*
  
    get a list of what you can add to an item
    
  */
  const getDescriptors = (parent) => {
    if(!parent) return []

    const allDescriptors = Object.keys(opts.types || {}).map(key => opts.types[key])
    return opts.getDescriptors ?
      opts.getDescriptors(parent, allDescriptors) :
      allDescriptors
  }

  // return the data for a new item based on the descriptor
  // and the parent
  const getNewItem = (parent, descriptor) => {
    if(!parent || !descriptor) return {}
    return opts.getNewItem ?
      opts.getNewItem(parent, descriptor) :
      descriptor.initialData
  }

  // a custom filter for if an item is editable or not
  const isEditable = (item) => {
    if(!item) return false
    return opts.isEditable ?
      opts.isEditable(item) :
      true
  }

  // tells you if an item is a leaf node or not
  const isLeaf = (item) => {
    if(!item) return false
    return opts.isLeaf ?
      opts.isLeaf(item) :
      false
  }

  const getTitle = (item) => {
    if(!item) return false
    return opts.getTitle ?
      opts.getTitle(item) :
      ''
  }

  const filterActions = (context, actions) => {
    if(!context.parent) return []

    const focusItems = context.selected.length ?
      context.selected :
      [context.parent]

    const isItemEditable = focusItems.filter(item => isEditable(item) ? true : false).length > 0
    const isItemLeaf = focusItems.filter(item => isLeaf(item) ? true : false).length > 0

    // the parent is not editable
    if(!isItemEditable){

      actions = actions
        // filter out any non read-only buttons
        .filter(action => READONLY_BUTTONS[action.id])
        // inject properties from READONLY_BUTTON_PROPS
        .map(action => Object.assign({}, action, READONLY_BUTTON_PROPS[action.id]))

    }

    if(isItemLeaf){
      actions = actions
        // filter out any leaf-only buttons
        .filter(action => !NONLEAF_BUTTONS[action.id])
    }

    if(typeof(opts.enableClipboard) == 'boolean' && !opts.enableClipboard){
      actions = actions
        // filter out any clipboard buttons
        .filter(action => !CLIPBOARD_BUTTONS[action.id])
    }

    // allow the user to mess with the buttons
    return opts.filterActions ?
      opts.filterActions(context, actions) :
      actions
  }

  return {
    getTableFields,
    getSchema,
    getLibrary,
    getDescriptors,
    filterActions,
    getNewItem,
    getItemType,
    isLeaf,
    isEditable,
    getTitle
  }

}

export default factory