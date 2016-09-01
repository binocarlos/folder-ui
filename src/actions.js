export const FOLDERUI_TREE_DATA_LOADED = 'FOLDERUI_TREE_DATA_LOADED'

export function tree_data_loaded(data) {
  return {
    type: FOLDERUI_TREE_DATA_LOADED,
    data
  }
}

export const FOLDERUI_TREE_DATA_ERROR = 'FOLDERUI_TREE_DATA_ERROR'

export function tree_data_error(error) {
  return {
    type: FOLDERUI_TREE_DATA_ERROR,
    error
  }
}

export const FOLDERUI_TABLE_DATA_LOADED = 'FOLDERUI_TABLE_DATA_LOADED'

export function table_data_loaded(data) {
  return {
    type: FOLDERUI_TABLE_DATA_LOADED,
    data
  }
}

export const FOLDERUI_TABLE_DATA_ERROR = 'FOLDERUI_TABLE_DATA_ERROR'

export function table_data_error(error) {
  return {
    type: FOLDERUI_TABLE_DATA_ERROR,
    error
  }
}

export const FOLDERUI_TREE_SELECT_NODE = 'FOLDERUI_TREE_SELECT_NODE'

export function tree_select_node(data) {
  return {
    type: FOLDERUI_TREE_SELECT_NODE,
    data
  }
}

export const FOLDERUI_TABLE_SELECT_NODES = 'FOLDERUI_TABLE_SELECT_NODES'

export function table_select_nodes(data) {
  return {
    type: FOLDERUI_TABLE_SELECT_NODES,
    data
  }
}

export const FOLDERUI_CUT_ITEMS = 'FOLDERUI_CUT_ITEMS'

export function cut_items(items) {
  return {
    type: FOLDERUI_CUT_ITEMS,
    items
  }
}

export const FOLDERUI_COPY_ITEMS = 'FOLDERUI_COPY_ITEMS'

export function copy_items(items) {
  return {
    type: FOLDERUI_COPY_ITEMS,
    items
  }
}

export const FOLDERUI_ADD_ITEM = 'FOLDERUI_ADD_ITEM'

export function add_item(parent, item) {
  return {
    type: FOLDERUI_ADD_ITEM,
    parent,
    item
  }
}

export const FOLDERUI_EDIT_ITEM = 'FOLDERUI_EDIT_ITEM'

export function edit_item(item) {
  return {
    type: FOLDERUI_EDIT_ITEM,
    item
  }
}

export const FOLDERUI_EDIT_ITEM_UPDATE = 'FOLDERUI_EDIT_ITEM_UPDATE'

export function edit_item_update(data, meta) {
  return {
    type: FOLDERUI_EDIT_ITEM_UPDATE,
    data,
    meta
  }
}

export const FOLDERUI_EDIT_ITEM_REVERT = 'FOLDERUI_EDIT_ITEM_REVERT'

export function edit_item_revert(item) {
  return {
    type: FOLDERUI_EDIT_ITEM_REVERT,
    item
  }
}

export const FOLDERUI_EDIT_ITEM_CANCEL = 'FOLDERUI_EDIT_ITEM_CANCEL'

export function edit_item_cancel(item) {
  return {
    type: FOLDERUI_EDIT_ITEM_CANCEL,
    item
  }
}

export const FOLDERUI_EDIT_ITEM_SAVE = 'FOLDERUI_EDIT_ITEM_SAVE'

export function edit_item_save(item) {
  return {
    type: FOLDERUI_EDIT_ITEM_SAVE,
    item
  }
}

export const FOLDERUI_SNACKBAR_OPEN = 'FOLDERUI_SNACKBAR_OPEN'

export function snackbar_open(message) {
  return {
    type: FOLDERUI_SNACKBAR_OPEN,
    message
  }
}

export const FOLDERUI_SNACKBAR_CLOSE = 'FOLDERUI_SNACKBAR_CLOSE'

export function snackbar_close() {
  return {
    type: FOLDERUI_SNACKBAR_CLOSE
  }
}

/*

  used to load the overall tree data
  
*/
export function api_load_tree_data(ownProps) {
  if(!ownProps.loadTreeData) {
    console.error('no loadTreeData method')
    return
  }
  return function(dispatch, getState) {
    // call the external function to get the tree data
    ownProps.loadTreeData((err, treedata) => {
      if(err) return dispatch(snackbar_open('loadTreeData error: ' + err.toString()))
      dispatch(tree_data_loaded(treedata))
      // call the external function to get the children
      // for the first element in the tree data
      loadChildren(treedata[0], (err, children) => {
        if(err) return dispatch(snackbar_open('loadChildren error: ' + err.toString()))
        dispatch(table_data_loaded(children))
      })
    })
  }
}

/*

  use to load the children when a tree node is selected
  
*/
export function api_select_node(ownProps, item) {
  if(!ownProps.loadChildren) {
    console.error('no loadChildren method')
    return
  }
  return function(dispatch, getState) {
    // tell the tree structure this item is open
    dispatch(tree_select_node(item))

    // load the children for the item
    ownProps.loadChildren(item, (err, children) => {
      if(err) return dispatch(snackbar_open('loadChildren error: ' + err.toString()))
      dispatch(table_data_loaded(children))
    })
  }
}

/*

  used to refresh the tree and the current item children view

  example usage is after a paste we want to refresh
  
*/
export function api_refresh_selected(ownProps, parent) {
  if(!ownProps.loadChildren) {
    console.error('no loadChildren method')
    return
  }
  if(!ownProps.loadTree) {
    console.error('no loadTree method')
    return
  }
  return function(dispatch, getState) {
    ownProps.loadChildren(parent, (err, children) => {
      if(err) return dispatch(snackbar_open('loadChildren error: ' + err.toString()))
      ownProps.loadTree((err, tree) => {

      })
    })
  }
}