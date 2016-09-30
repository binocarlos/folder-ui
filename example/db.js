import { processTreeData, dumpTreeData, getChildren, addChild, moveItem, deleteItem } from '../src/tools'

function serialize(val){
  return JSON.parse(JSON.stringify(val))
}

export default function db(){

  let tree = processTreeData(ROOT_DATA)

  return {
    saveItemDB:(item, context, done) => {
      let saveitem = tree.data[item.id]
      Object.keys(item || {}).forEach(function(key){
        saveitem[key] = item[key]
      })
      done(null, serialize(saveitem))
    },
    loadItemDB:(id, context, done) => {
      done(null, serialize(tree.data[id]))
    },
    addItemDB:(parent, item, context, done) => {
      tree = addChild(tree, parent, item)
      done(null, serialize(item))
    },
    pasteItemsDB:(mode, parent, items, context, done) => {
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
    deleteItemsDB:(items, context, done) => {
      items.forEach(item => {
        deleteItem(tree, item)
      })
      done(null, items)
    },
    loadChildrenDB:(item, context, done) => {
      done(null, serialize(getChildren(tree, item.id)))
    },
    loadTreeDB:(context, done) => {
      done(null, serialize(dumpTreeData(tree)))
    }
  }
}

const ROOT_DATA = [{
  id:0,
  name:'My Folders',
  open:true,
  children:[{
    id:1,
    name:'Folder A',
    children:[]
  },{
    name:'Folder B',
    id:2,
    children:[{
      name:'Sub Folder B1',
      id:3,
      children:[{
        name:'Sub Folder C1',
        id:25
      },{
        name:'Sub Folder C2',
        id:26
      }]
    },{
      name:'Sub Folder B2',
      id:24
    }]
  },{
    name:'Folder C',
    id:4,
    children:[]
  }]
}]