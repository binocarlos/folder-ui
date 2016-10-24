/*

  a crude in-memory implementation of the folder-ui database library
  
*/

import { processTreeData, dumpTreeData, getChildren, addChild, moveItem, deleteItem } from './tools'

function serialize(val){
  return JSON.parse(JSON.stringify(val))
}

export default function memorydb(opts = {}){

  let tree = processTreeData(opts.data)

  return {
    saveItem:(item, done) => {
      let saveitem = tree.data[item.id]
      Object.keys(item || {}).forEach(function(key){
        saveitem[key] = item[key]
      })
      done(null, serialize(saveitem))
    },
    loadItem:(id, done) => {
      done(null, serialize(tree.data[id]))
    },
    addItem:(parent, item, done) => {
      tree = addChild(tree, parent, item)
      done(null, serialize(item))
    },
    pasteItems:(mode, parent, items, done) => {
      let newItems = []

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

      done(null, serialize(newItems))
    },
    deleteItems:(items, done) => {
      items.forEach(item => {
        deleteItem(tree, item)
      })
      done(null, items)
    },
    loadChildren:(item, done) => {
      done(null, serialize(getChildren(tree, item.id)))
    },
    loadTree:(done) => {
      done(null, serialize(dumpTreeData(tree)))
    }
  }
}