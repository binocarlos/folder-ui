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

  return {
    name:opts.name,
    // return the correct part of the state tree based on the 'name'
    getState:(state) => {
      return state[opts.name]
    },

    // request the tree data
    requestTreeData:(done) => {
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
    },

    // request the children for a single node
    requestChildren:(id, done) => {
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
    },

    selectTreeNode:(node) => {
      return processAction(tree_select_node(node))
    },

    toggleTreeNode:(id, open) => {
      return processAction(tree_toggle_node(id, open))
    },

    selectChildNodes:(ids) => {
      return processAction(child_data_select(ids))
    }
  }
}

export default ActionFactory