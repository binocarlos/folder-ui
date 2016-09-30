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

export const FOLDERUI_TREE_TOGGLE = 'FOLDERUI_TREE_TOGGLE'

export function tree_toggle_node(id) {
  return {
    type: FOLDERUI_TREE_TOGGLE,
    id
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
    items:items.map(item => {
      let ret = Object.assign({}, item)
      delete(ret._selected)
      return ret
    })
  }
}

export const FOLDERUI_COPY_ITEMS = 'FOLDERUI_COPY_ITEMS'

export function copy_items(items) {
  return {
    type: FOLDERUI_COPY_ITEMS,
    items:items.map(item => {
      let ret = Object.assign({}, item)
      delete(ret._selected)
      return ret
    })
  }
}

export const FOLDERUI_PASTE_ITEMS = 'FOLDERUI_PASTE_ITEMS'

// item is the parent we are pasting to
export function paste_items(item) {
  return {
    type: FOLDERUI_PASTE_ITEMS,
    item
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

export function edit_item_cancel() {
  return {
    type: FOLDERUI_EDIT_ITEM_CANCEL
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
    if(!ownProps.loadChildrenDB) {
      console.error('no loadChildrenDB method')
      return
    }

    ownProps.loadChildrenDB(item, (err, children) => {
      if(err) {
        done && done(err)
        return dispatch(snackbar_open('loadChildrenDB error: ' + err.toString()))
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
export function api_load_tree_data(ownProps, selectid, done) {
  
  return function(dispatch, getState) {
    if(!ownProps.loadTreeDB) {
      console.error('no loadTreeDB method')
      return
    }

    // call the external function to get the tree data
    ownProps.loadTreeDB((err, treedata) => {
      if(err) {
        done && done(err)
        return dispatch(snackbar_open('loadTreeDB error: ' + err.toString()))
      }

      dispatch(tree_data_loaded(treedata))

      var state = getState()
      selectid = selectid || treedata[0].id
      var selectitem = state.folderui.tree.data[selectid]

      dispatch(api_select_node(ownProps, selectitem))

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
    if(!ownProps.pasteItemsDB){
      console.error('no pasteItemsDB method')
      return
    }
    // paste the items using the database api
    ownProps.pasteItemsDB(mode, parent, items, (err, newItems) => {
      if(err) {
        done && done(err)
        return dispatch(snackbar_open('pasteItemsDB error: ' + err.toString()))
      }

      dispatch(paste_items(parent))
      
      // now reload the tree because it has new items
      dispatch(api_load_tree_data(ownProps, parent.id, (err) => {
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

  handle an item edit

   * load the item by id
   * trigger the edit_item action
  
*/
export function api_edit_item(ownProps, id, done){
  return function(dispatch, getState) {
    if(!ownProps.loadItemDB){
      console.error('no loadItemDB method')
      return
    }
    // paste the items using the database api
    ownProps.loadItemDB(id, (err, item) => {
      if(err) {
        done && done(err)
        return dispatch(snackbar_open('loadItem error: ' + err.toString()))
      }

      dispatch(edit_item(item))
      done && done()
    })
  }
}
/*

  handle an item save
  
*/

export function api_save_item(ownProps, parent, item, done) {

  let reducername = ownProps.reducername || 'folderui'

  return function(dispatch, getState) {

    // we are doing an ADD
    if(parent){

      // check we have the functions to handle the data in our own props
      if(!ownProps.addItemDB) {
        console.error('no addItemDB method')
        return
      }
      if(!ownProps.loadChildrenDB) {
        console.error('no loadChildrenDB method')
        return
      }

      // add the item to the server
      ownProps.addItemDB(parent, item, (err, newItem) => {

        if(err){
          done && done(err)
          return dispatch(snackbar_open('addItemDB error: ' + err.toString()))
        }

        dispatch(api_load_children(ownProps, parent, (err) => {
          if(err){
            done && done(err)
            return
          }

          // now reload the tree because it has new items
          dispatch(api_load_tree_data(ownProps, parent.id, (err) => {
            if(err) {
              done && done(err)
              return
            }

            dispatch(table_select_nodes([]))
            dispatch(snackbar_open(newItem.name + ' added'))

            // use the URL to save view state
            if(ownProps.updateView){            
              ownProps.updateView({
                view:'children',
                id:parent.id
              })
            }
            else{
              dispatch(edit_item_cancel())
            }

            done && done()
          }))
          
          
        }))    
      })
    }
    // we are doing a normal SAVE
    else{
      if(!ownProps.saveItemDB) {
        console.error('no saveItemDB method')
        return
      }
      ownProps.saveItemDB(item, (err, newItem) => {
        if(err) {
          done && done(err)
          return dispatch(snackbar_open('saveItemDB error: ' + err.toString()))
        }
        dispatch(edit_item_save(newItem))
        dispatch(table_select_nodes([]))
        dispatch(snackbar_open(newItem.name + ' saved'))  

        let treeselected = getState()[reducername].treeselected

        // use the URL to save view state
        if(ownProps.updateView){            
          ownProps.updateView({
            view:'children',
            id:treeselected.id
          })
        }
        else{
          dispatch(edit_item_cancel())
        }

        done && done()
      })
    }
  }
}

export function api_delete_items(ownProps, parent, items, done) {

  return function(dispatch, getState) {
    if(!ownProps.deleteItemsDB) {
      console.error('no deleteItemsDB method')
      return
    }

    ownProps.deleteItemsDB(items, (err, newItem) => {
      if(err){
        done && done(err)
        return dispatch(snackbar_open('deleteItemsDB error: ' + err.toString()))
      }
      dispatch(api_load_children(ownProps, parent, (err) => {
        if(err){
          done && done(err)
          return
        }
        dispatch(dialog_close())
        dispatch(table_select_nodes([]))

        dispatch(api_load_tree_data(ownProps, parent.id, (err) => {
          if(err) {
            done && done(err)
            return
          }

          dispatch(snackbar_open(items.length + ' ' + pluralise(items.length, 'item') + ' deleted'))
          done && done()
        }))
      }))  
    })
  }
}