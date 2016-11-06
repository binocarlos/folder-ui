import series from 'async/series'
import parallel from 'async/parallel'
import { processTreeData, processListData, getChildren, getAncestors } from './tools'

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

export const FOLDERUI_TREE_TOGGLE = 'FOLDERUI_TREE_TOGGLE'

export function tree_toggle_node(id, open = null) {
  return {
    type: FOLDERUI_TREE_TOGGLE,
    id,
    open
  }
}

export const FOLDERUI_CHILD_DATA_LOADED = 'FOLDERUI_CHILD_DATA_LOADED'

export function child_data_loaded(data) {
  return {
    type: FOLDERUI_CHILD_DATA_LOADED,
    data
  }
}

export const FOLDERUI_CHILD_DATA_ERROR = 'FOLDERUI_CHILD_DATA_ERROR'

export function child_data_error(error) {
  return {
    type: FOLDERUI_CHILD_DATA_ERROR,
    error
  }
}

export const FOLDERUI_CHILD_DATA_SELECT = 'FOLDERUI_CHILD_DATA_SELECT'

export function child_data_select(ids) {
  return {
    type: FOLDERUI_CHILD_DATA_SELECT,
    ids
  }
}

export const FOLDERUI_CHILD_DATA_MESSAGE = 'FOLDERUI_CHILD_DATA_MESSAGE'

export function child_data_message(message) {
  return {
    type: FOLDERUI_CHILD_DATA_MESSAGE,
    message
  }
}

export const FOLDERUI_CHILD_DATA_CLIPBOARD = 'FOLDERUI_CHILD_DATA_CLIPBOARD'

export function child_data_clipboard(mode = null, data = []) {
  return {
    type: FOLDERUI_CHILD_DATA_CLIPBOARD,
    mode,
    data
  }
}

export const FOLDERUI_CHILD_DATA_DELETE = 'FOLDERUI_CHILD_DATA_DELETE'

export function child_data_delete(deleting = true) {
  return {
    type: FOLDERUI_CHILD_DATA_DELETE,
    deleting
  }
}

export const FOLDERUI_CHILD_DATA_DELETE_ERROR = 'FOLDERUI_CHILD_DATA_DELETE_ERROR'

export function child_data_delete_error(error) {
  return {
    type: FOLDERUI_CHILD_DATA_DELETE_ERROR,
    error
  }
}

export const FOLDERUI_EDIT_UPDATE = 'FOLDERUI_EDIT_UPDATE'

export function edit_update(data, meta) {
  return {
    type: FOLDERUI_EDIT_UPDATE,
    data,
    meta
  }
}

export const FOLDERUI_EDIT_REVERT = 'FOLDERUI_EDIT_REVERT'

export function edit_revert() {
  return {
    type: FOLDERUI_EDIT_REVERT
  }
}

export const FOLDERUI_EDIT_RESET = 'FOLDERUI_EDIT_RESET'

export function edit_reset() {
  return {
    type: FOLDERUI_EDIT_RESET
  }
}

export const FOLDERUI_EDIT_DATA_LOADED = 'FOLDERUI_EDIT_DATA_LOADED'

export function edit_data_loaded(data) {
  return {
    type: FOLDERUI_EDIT_DATA_LOADED,
    data
  }
}

export const FOLDERUI_EDIT_DATA_ERROR = 'FOLDERUI_EDIT_DATA_ERROR'

export function edit_data_error(error) {
  return {
    type: FOLDERUI_EDIT_DATA_ERROR,
    error
  }
}

const sortByName = (a = {}, b = {}) => {
  return a.name>b.name ? 1 : -1
}

const ActionFactory = (opts = {}, db) => {

  if(typeof(opts)==='string') opts = {
    name:opts
  }

  if(db) opts.db = db

  if(!opts.name || !opts.db) throw new Error('ActionFactory requires a name and db options')

  // the default is sort by the 'name' field
  const sort = opts.sort || sortByName

  const sortChildren = (data = []) => {
    return data.sort(sort)
  }

  const sortTreeChildren = (item) => {
    item.children = (item.children || []).map(sortTreeChildren).sort(sort)
    return item
  }

  const sortTreeItems = (data = []) => {
    return data.map(sortTreeChildren).sort(sort)
  }

  // the reducer will use this to filter actions not for it
  const processAction = (action) => {
    action._filter = opts.name
    return action
  }

  const requestTreeData = (done) => {
    return (dispatch, getState) => {
      db.loadTree((err, data) => {
        if(err){
          console.error('requestTreeData')
          console.error(err)
          dispatch(processAction(tree_data_error(err)))
          done && done(err)
          return
        }
        data = sortTreeItems(data)
        data = processTreeData(data)
        dispatch(processAction(tree_data_loaded(data)))
        done && done(null, data)
      })
    }
  }

  const requestChildren = (id, done) => {
    return (dispatch, getState) => {
      db.loadChildren(id, (err, data) => {
        if(err){
          console.error('requestChildren: ' + id)
          console.error(err)
          dispatch(processAction(child_data_error(err)))
          done && done(err)
          return
        }
        data = sortChildren(data)
        dispatch(processAction(child_data_loaded(data)))
        done && done(null, data)
      })
    }
  }

  const requestNodeData = (id, done) => {
    return (dispatch, getState) => {
      db.loadItem(id, (err, data) => {
        if(err){
          console.error('requestNodeData: ' + id)
          console.error(err)
          dispatch(processAction(edit_data_error(err)))
          done && done(err)
          return
        }
        dispatch(processAction(edit_data_loaded(data)))
        done && done(null, data)
      })
    }
  }

  const requestDeleteNodes = (parentid, ids, done) => {
    return (dispatch, getState) => {

      series([

        // loop over each id and hit the database with it
        (next) => {
          parallel(ids.map((id) => {
            return (nextitem) => {
              db.deleteItem(id, nextitem)
            }
          }), next)
        },

        (next) => {
          parallel([
            // now reload the tree data
            (pnext) => {
              dispatch(requestTreeData(pnext))
            },

            // and the children
            (pnext) => {
              dispatch(requestChildren(parentid, pnext))
            }
          ], next)
        }

      ], (err) => {
        if(err){
          console.error('requestDeleteNodes: ' + parentid + ' -> ' + ids)
          console.error(err)
          dispatch(processAction(child_data_delete_error(err)))
          done && done(err)
          return
        }
        done && done()
      })
    }
  }

  const requestAddItem = (parent, data, done) => {
    return (dispatch, getState) => {

      series([

        (next) => {
          db.addItem(parent, data, next)
        },

        (next) => {
          dispatch(edit_reset())
          next()
        },

        (next) => {
          parallel([
            // now reload the tree data
            (pnext) => {
              dispatch(requestTreeData(pnext))
            },

            // and the children
            (pnext) => {
              dispatch(requestChildren(parent.id, pnext))
            }
          ], next)
        }

      ], (err) => {
        if(err){
          console.error('requestAddItem:')
          console.error(err)
          // TODO: error handler
          done && done(err)
          return
        }
        done && done()
      })

    }
  }

  const requestSaveItem = (parent, data, done) => {
    return (dispatch, getState) => {

      series([

        (next) => {
          db.saveItem(data, next)
        },

        (next) => {
          dispatch(edit_reset())
          next()
        },

        (next) => {
          parallel([
            // now reload the tree data
            (pnext) => {
              dispatch(requestTreeData(pnext))
            },

            // and the children
            (pnext) => {
              dispatch(requestChildren(parent.id, pnext))
            }
          ], next)
        }

        
      ], (err) => {
        if(err){
          console.error('requestSaveItem:')
          console.error(err)
          // TODO: error handler
          done && done(err)
          return
        }
        done && done()
      })

    }
  }

  const requestPasteItems = (parent, mode, nodes, done) => {
    return (dispatch, getState) => {

      series([

        (next) => {
          db.pasteItems(mode, parent, nodes, next)
        },

        (next) => {
          parallel([
            // now reload the tree data
            (pnext) => {
              dispatch(requestTreeData(pnext))
            },

            // and the children
            (pnext) => {
              dispatch(requestChildren(parent.id, pnext))
            }
          ], next)
        }

        
      ], (err) => {
        if(err){
          console.error('requestPasteItems:')
          console.error(err)
          // TODO: error handler
          done && done(err)
          return
        }
        done && done()
      })

    }
  }

  return {
    name:opts.name,
    // return the correct part of the state tree based on the 'name'
    getState:(state) => {
      return state[opts.name]
    },

    /*
    
      async methods
      
    */

    // request the tree data
    requestTreeData,

    // request the children for a single node
    requestChildren,

    // request the data for a single node
    requestNodeData,

    // delete a collection of nodes
    requestDeleteNodes,

    // add an item to a parent
    requestAddItem,

    // save an existing items data
    requestSaveItem,

    // paste the clipboard
    requestPasteItems,


    /*
    
      sync methods
      
    */

    // inject the data for a single node (e.g. initial data for an add)
    setEditData:(data) => {
      return processAction(edit_data_loaded(data))
    },

    // toggle the tree open state
    toggleTreeNode:(id, open) => {
      return processAction(tree_toggle_node(id, open))
    },

    // an array of table selected ids
    selectChildNodes:(ids) => {
      return processAction(child_data_select(ids))
    },

    // the edit form has changed
    updateEditNode:(data, meta) => {
      return processAction(edit_update(data, meta))
    },

    // replace the current data with the original data
    revertEditNode:() => {
      return processAction(edit_revert())
    },

    // flag the current selection to be deleted - will show a dialog
    deleteSelection:() => {
      return processAction(child_data_delete(true))
    },

    // cancel the delete dialog
    cancelDeleteSelection:() => {
      return processAction(child_data_delete(false))
    },

    // show a children snackbar
    showChildrenMessage:(message) => {
      return processAction(child_data_message(message))
    },

    setClipboard:(mode, data) => {
      return processAction(child_data_clipboard(mode, data))
    }

  }
}

export default ActionFactory