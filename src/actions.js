import series from 'async-series'
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

export const FOLDERUI_TREE_SELECT = 'FOLDERUI_TREE_SELECT'

export function tree_select_node(data) {
  return {
    type: FOLDERUI_TREE_SELECT,
    data
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

const ActionFactory = (opts = {}, db) => {

  if(typeof(opts)==='string') opts = {
    name:opts
  }

  if(db) opts.db = db

  if(!opts.name || !opts.db) throw new Error('ActionFactory requires a name and db options')

  // the reducer will use this to filter actions not for it
  const processAction = (action) => {
    action._filter = opts.name
    return action
  }

  const requestTreeData = (done) => {
    return (dispatch, getState) => {
      db.loadTree((err, data) => {
        if(err){
          dispatch(processAction(tree_data_error(err)))
          done && done(err)
          return
        }
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
          dispatch(processAction(child_data_error(err)))
          done && done(err)
          return
        }
        dispatch(processAction(child_data_loaded(data)))
        done && done(null, data)
      })
    }
  }

  const requestNodeData = (id, done) => {
    return (dispatch, getState) => {
      db.loadItem(id, (err, data) => {
        if(err){
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
          series(ids.map((id) => {
            return (nextitem) => {
              db.deleteItem(id, nextitem)
            }
          }), next)
        },

        // now reload the tree data
        (next) => {
          dispatch(requestTreeData(next))
        },

        // and the children
        (next) => {
          dispatch(requestChildren(parentid, next))
        }
        
      ], (err) => {
        if(err){
          dispatch(processAction(child_data_delete_error(err)))
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


    /*
    
      sync methods
      
    */

    // inject the data for a single node (e.g. initial data for an add)
    setNodeData:(data) => {
      return processAction(edit_data_loaded(data))
    },

    // tell the state about the currently selected tree node
    selectTreeNode:(node) => {
      return processAction(tree_select_node(node))
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
    }

  }
}

export default ActionFactory