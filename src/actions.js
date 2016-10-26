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
            dispatch(tree_data_error(err))
            done && done(err)
            return
          }
          dispatch(processAction(tree_data_loaded(processTreeData(data))))
          done && done(null, data)
        })
      }
    },

    toggleTreeNode:(id, open) => {
      return processAction(tree_toggle_node(id, open))
    }
  }
}

export default ActionFactory