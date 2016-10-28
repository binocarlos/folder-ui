import MemoryDB from '../src/memorydb'

export default function db(DEFAULT_DATA = ROOT_DATA){
  return MemoryDB({
    data:DEFAULT_DATA
  })
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