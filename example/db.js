import { processTreeData, getChildren, addChild } from '../src/tools'

function serialize(val){
  return JSON.parse(JSON.stringify(val))
}

export default function db(){

  let tree = processTreeData(ROOT_DATA)

  return {
    saveItem:function(item, done){
      let saveitem = tree.data[item.id]
      Object.keys(item || {}).forEach(function(key){
        saveitem[key] = item[key]
      })
      done(null, serialize(saveitem))
    },
    addItem:function(parent, item, done){
      tree = addChild(tree, parent, item)
      done(null, item)
    },
    loadChildren:function(item, done){
      done(null, serialize(getChildren(tree, item.id)))
    },
    loadTree:function(done){
      done(null, serialize(ROOT_DATA))
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
  },{
    name:'Folder C1',
    id:5,
    children:[]
  },{
    name:'Folder C2',
    id:6,
    children:[]
  },{
    name:'Folder C3',
    id:7,
    children:[]
  },{
    name:'Folder C4',
    id:8,
    children:[]
  },{
    name:'Folder C5',
    id:9,
    children:[]
  },{
    name:'Folder C6',
    id:10,
    children:[]
  },{
    name:'Folder C7',
    id:11,
    children:[]
  },{
    name:'Folder C8',
    id:12,
    children:[]
  },{
    name:'Folder C9',
    id:13,
    children:[]
  },{
    name:'Folder C10',
    id:14,
    children:[]
  },{
    name:'Folder C11',
    id:15,
    children:[]
  },{
    name:'Folder C12',
    id:16,
    children:[]
  },{
    name:'Folder C13',
    id:17,
    children:[]
  },{
    name:'Folder C14',
    id:18,
    children:[]
  },{
    name:'Folder C15',
    id:19,
    children:[]
  },{
    name:'Folder C16',
    id:20,
    children:[]
  },{
    name:'Folder C17',
    id:21,
    children:[]
  },{
    name:'Folder C18',
    id:22,
    children:[]
  },{
    name:'Folder C19',
    id:23,
    children:[]
  }]
}]