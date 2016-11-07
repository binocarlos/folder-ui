/*

  a crude in-memory implementation of the folder-ui database library
  
*/

import { serialize, processTreeData, dumpTreeData, getChildren, getDeepChildren, addChild, moveItem, deleteItem } from '../tools'

export default function memorydb(opts = {}){

  let tree = processTreeData(opts.data)

  const commit = (err, data, done) => {
    if(err) return done(err)
    if(!opts.commit) return done(null, data)
    opts.commit(tree, (err) => {
      if(err) return done(err)
      return done(null, data)
    })
  }

  // commit the initial data
  commit(null, null, () => {})

  return {
    loadTree:(context, done) => {
      done(null, serialize(dumpTreeData(tree)))
    },
    loadChildren:(context, id, done) => {
      done(null, serialize(getChildren(tree, id)))
    },
    loadDeepChildren:(context, id, done) => {
      done(null, serialize(getDeepChildren(tree, id)))
    },
    loadItem:(context, id, done) => {
      done(null, serialize(tree.data[id]))
    },
    addItem:(context, parent, item, done) => {
      parent = serialize(parent)
      item = serialize(item)
      tree = addChild(tree, parent, item)
      commit(null, serialize(item), done)
    },
    saveItem:(context, id, data, done) => {
      data = serialize(data)
      let saveitem = tree.data[id]
      Object.keys(data || {}).forEach(function(key){
        saveitem[key] = data[key]
      })
      commit(null, serialize(saveitem), done)
    },
    deleteItem:(context, id, done) => {
      deleteItem(tree, id)
      commit(null, null, done)
    },
    filterPaste:(mode, item) => {
      return item
    }
  }
}