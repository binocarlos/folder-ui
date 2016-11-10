import series from 'async/series'
import parallel from 'async/parallel'
import { push } from 'react-router-redux'
import { processTreeData, processListData, getChildren, getAncestors } from './tools'
import DBFactory from './db'

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

const DEFAULT_EVENT_LISTENER = () => {

}

const ActionFactory = (opts = {}) => {

  if(typeof(opts)==='string') opts = {
    name:opts
  }

  if(!opts.name) throw new Error('ActionFactory requires a name')
  if(!opts.db) throw new Error('ActionFactory requires a db')
  if(!opts.routes) throw new Error('ActionFactory requires routeHandlers')

  const db = DBFactory(opts.db)
  const routeHandlers = opts.routes.routeHandlers

  // a flag that decides if we are actually interested in loading any tree data
  const enableTree = typeof(opts.enableTree) == 'boolean' ? opts.enableTree : true

  // the default is sort by the 'name' field
  const sort = opts.sort || sortByName

  // this is run on mutating events
  const eventListener = opts.eventListener || DEFAULT_EVENT_LISTENER

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

  // inject the state into the database context so it can see the user
  const getDatabaseContext = (context, getState, extra = {}) => {
    return Object.assign({}, context, {
      state:getState()
    }, extra)
  }

  // used to refresh the view once the database is changed
  // we look at the cofig to decide whether we refresh the tree or not
  const requestRefreshView = (context, parentid, done) => {
    return (dispatch, getState) => {
      parallel([
        // now reload the tree data (if we are setup to do so)
        (next) => {
          if(!enableTree) return next()
          dispatch(requestTreeData(context, next))
        },

        // and the children
        (next) => {
          dispatch(requestChildren(context, parentid, next))
        }
      ], done)
    }
  }

  const requestTreeData = (context, done) => {
    return (dispatch, getState) => {
      db.loadTree(getDatabaseContext(context, getState, {
        // this filters what is loaded from the tree
        search:opts.treeQuery
      }), (err, data) => {
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

  const requestChildren = (context, id, done) => {
    return (dispatch, getState) => {
      db.loadChildren(getDatabaseContext(context, getState), id, (err, data) => {
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

  const requestNodeData = (context, id, done) => {
    return (dispatch, getState) => {
      db.loadItem(getDatabaseContext(context, getState), id, (err, data) => {
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

  const requestDeleteNodes = (context, parentid, ids, done) => {
    return (dispatch, getState) => {

      series([

        // loop over each id and hit the database with it
        (next) => {
          parallel(ids.map((id) => {
            return (nextitem) => {
              db.deleteItem(getDatabaseContext(context, getState), id, nextitem)
            }
          }), next)
        },

        (next) => {
          dispatch(requestRefreshView(context, parentid, next))
        }

      ], (err) => {
        if(err){
          console.error('requestDeleteNodes: ' + parentid + ' -> ' + ids)
          console.error(err)
          dispatch(processAction(child_data_delete_error(err)))
          done && done(err)
          return
        }

        eventListener({
          action:'delete',
          context,
          parentid,
          ids
        }, dispatch)

        done && done()
      })
    }
  }

  const requestAddItem = (context, parent, data, done) => {
    return (dispatch, getState) => {

      series([

        (next) => {
          db.addItem(getDatabaseContext(context, getState), parent, data, next)
        },

        (next) => {
          dispatch(edit_reset())
          next()
        },

        (next) => {
          dispatch(requestRefreshView(context, parent.id, next))
        }

      ], (err) => {
        if(err){
          console.error('requestAddItem:')
          console.error(err)
          // TODO: error handler
          done && done(err)
          return
        }

        eventListener({
          action:'add',
          context,
          parent,
          data
        }, dispatch)

        done && done()
      })

    }
  }

  const requestSaveItem = (context, parent, item, done) => {
    return (dispatch, getState) => {

      series([

        (next) => {
          db.saveItem(getDatabaseContext(context, getState), item.id, item, next)
        },

        (next) => {
          dispatch(edit_reset())
          next()
        },

        (next) => {
          dispatch(requestRefreshView(context, parent.id, next))
        }

        
      ], (err) => {
        if(err){
          console.error('requestSaveItem:')
          console.error(err)
          // TODO: error handler
          done && done(err)
          return
        }

        eventListener({
          action:'save',
          context,
          parent,
          item
        }, dispatch)

        done && done()
      })

    }
  }

  const requestPasteItems = (context, parent, mode, nodes, done) => {
    return (dispatch, getState) => {

      series([

        (next) => {
          db.pasteItems(getDatabaseContext(context, getState), mode, parent, nodes, next)
        },

        (next) => {
          dispatch(requestRefreshView(context, parent.id, next))
        }

        
      ], (err) => {
        if(err){
          console.error('requestPasteItems:')
          console.error(err)
          // TODO: error handler
          done && done(err)
          return
        }

        eventListener({
          action:'paste',
          context,
          parent,
          mode,
          nodes
        }, dispatch)

        done && done()
      })

    }
  }

  return {
    name:opts.name,
    db:db,
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
    
      routing methods
      
    */

    routeAdd:(parent, descriptor, params) => {
      if(!routeHandlers.add || !parent || !descriptor) return
      return push(routeHandlers.add(parent, descriptor, params))
    },

    routeEdit:(parent, node, params) => {
      if(!routeHandlers.edit || !parent) return
      return push(routeHandlers.edit(parent, node, params))
    },

    routeOpen:(node, params) => {
      if(!routeHandlers.open || !node) return
      return push(routeHandlers.open(node, params))
    },

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