import pluralise from 'pluralise'

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

export const FOLDERUI_DIALOG_OPEN = 'FOLDERUI_DIALOG_OPEN'

export function dialog_open(message, data) {
  return {
    type: FOLDERUI_DIALOG_OPEN,
    message,
    data
  }
}

export const FOLDERUI_DIALOG_CLOSE = 'FOLDERUI_DIALOG_CLOSE'

export function dialog_close() {
  return {
    type: FOLDERUI_DIALOG_CLOSE
  }
}

/*

  used to load the children for one item
  
*/
export function api_load_children(ownProps, item, done) {
  return function(dispatch, getState) {
    if(!ownProps.loadChildren) {
      console.error('no loadChildren method')
      return
    }

    ownProps.loadChildren(item, (err, children) => {
      if(err) {
        done && done(err)
        return dispatch(snackbar_open('loadChildren error: ' + err.toString()))
      }
      dispatch(table_data_loaded(children))
      done && done()
    })
  } 
}

/*

  used to load the overall tree data

  if an item is passed it's children are loaded and it's selected in the tree
  
*/
export function api_load_tree_data(ownProps, item, done) {
  
  return function(dispatch, getState) {
    if(!ownProps.loadTree) {
      console.error('no loadTree method')
      return
    }

    // call the external function to get the tree data
    ownProps.loadTree((err, treedata) => {
      if(err) {
        done && done(err)
        return dispatch(snackbar_open('loadTree error: ' + err.toString()))
      }

      item = item || treedata[0]
      dispatch(tree_data_loaded(treedata))
      dispatch(api_select_node(ownProps, item))

      done && done()
    })
  }
}

/*

  use to load the children when a tree node is selected
  
*/
export function api_select_node(ownProps, item, done) {
  
  return function(dispatch, getState) {
    // tell the tree structure this item is open
    dispatch(tree_select_node(item))
    dispatch(api_load_children(ownProps, item, done))
  }
}

/*

  handle a paste operation
  
*/
export function api_paste_items(ownProps, mode, parent, items, done) {
  return function(dispatch, getState) {
    if(!ownProps.pasteItems){
      console.error('no pasteItems method')
      return
    }
    ownProps.pasteItems(mode, parent, items, (err, newItems) => {
      if(err) {
        done && done(err)
        return dispatch(snackbar_open('pasteItems error: ' + err.toString()))
      }

      dispatch(api_load_tree_data(ownProps, parent, (err) => {
        if(err) {
          done && done(err)
          return
        }

        dispatch(snackbar_open(items.length + ' ' + pluralise(items.length, 'item') + ' pasted into ' + parent.name))
        done && done()
      }))
      
    })
  }
}

/*

  handle an item save
  
*/

export function api_save_item(ownProps, parent, item, done) {

  return function(dispatch, getState) {
    // we are doing an ADD
    if(parent){

      // check we have the functions to handle the data in our own props
      if(!ownProps.addItem) {
        console.error('no addItem method')
        return
      }
      if(!ownProps.loadChildren) {
        console.error('no loadChildren method')
        return
      }

      // add the item to the server
      ownProps.addItem(parent, item, (err, newItem) => {
        if(err){
          done && done(err)
          return dispatch(snackbar_open('addItem error: ' + err.toString()))
        }

        dispatch(api_load_children(ownProps, parent, (err) => {
          if(err){
            done && done(err)
            return
          }
          // trigger the save and children loaded actions
          dispatch(edit_item_cancel(parent, newItem))
          dispatch(table_select_nodes([]))
          dispatch(snackbar_open(newItem.name + ' added'))
          done && done()
        }))    
      })
    }
    // we are doing a normal SAVE
    else{
      if(!ownProps.saveItem) {
        console.error('no saveItem method')
        return
      }
      ownProps.saveItem(item, (err, newItem) => {
        if(err) {
          done && done(err)
          return dispatch(snackbar_open('saveItem error: ' + err.toString()))
        }
        dispatch(edit_item_save(newItem))
        dispatch(table_select_nodes([]))
        dispatch(snackbar_open(newItem.name + ' saved'))  
        done && done()
      })
    }
  }
}

export function api_delete_items(ownProps, parent, items, done) {

  return function(dispatch, getState) {
    if(!ownProps.deleteItems) {
      console.error('no deleteItems method')
      return
    }

    ownProps.deleteItems(items, (err, newItem) => {
      if(err){
        done && done(err)
        return dispatch(snackbar_open('deleteItems error: ' + err.toString()))
      }
      dispatch(api_load_children(ownProps, parent, (err) => {
        if(err){
          done && done(err)
          return
        }
        dispatch(dialog_close())
        dispatch(table_select_nodes([]))
        dispatch(snackbar_open(items.length + ' ' + pluralise(items.length, 'item') + ' deleted'))
        done && done()
      }))  
    })
  }
}