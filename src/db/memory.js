/*

  a crude in-memory implementation of the folder-ui database library
  
*/

import { serialize, processTreeData, dumpTreeData, getChildren, addChild, moveItem, deleteItem } from '../tools'

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
    loadItem:(context, id, done) => {
      done(null, serialize(tree.data[id]))
    },
    addItem:(context, parent, item, done) => {
      parent = serialize(parent)
      item = serialize(item)
      tree = addChild(tree, parent, item)
      commit(null, serialize(item), done)
    },
    saveItem:(context, item, done) => {
      item = serialize(item)
      let saveitem = tree.data[item.id]
      Object.keys(item || {}).forEach(function(key){
        saveitem[key] = item[key]
      })
      commit(null, serialize(saveitem), done)
    },
    deleteItem:(context, id, done) => {
      deleteItem(tree, id)
      commit(null, null, done)
    },
    pasteItems:(context, mode, parent, items, done) => {
      let newItems = []

      parent = serialize(parent)
      items = serialize(items)

      if(mode=='copy'){
        newItems = items.map(item => {
          delete(item.id)
          tree = addChild(tree, parent, item)
          return item
        })
      }
      else if(mode=='cut'){
        items.forEach(item => {
          tree = moveItem(tree, item.id, parent.id)
        })
        newItems = items
      }

      commit(null, serialize(newItems), done)
    }
  }
}