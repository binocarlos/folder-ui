/*

  updating node data in a tree structure is very
  hard with redux

  for this reason - we need to pass the tree data
  in the following format:

   * data - a flat map of id -> object
   * children - a flat map of id -> [childids]
   * rootids - an array of the top level node ids
  
  this function accepts a top level array of objects
  with the following properties:

   * id
   * children

*/
export function processTreeData(rootnodes = []){
  let data = {}
  let map = {}
  let rootids = rootnodes.map(n => n.id)

  function processNode(node){
    let children = node.children || []
    node = Object.assign({}, node)
    delete(node.children)
    data[node.id] = node
    map[node.id] = children.map(c => c.id)
    children.forEach(processNode)
  }

  rootnodes.forEach(processNode)

  return {
    data,
    children:map,
    rootids
  }
}

/*

  turn a tree data structure back into it's original data

  so an object with 'data', 'children' and 'rootids' properties
  is turned into a single array of objects each with a 'children' property
  
*/
export function dumpTreeData(tree = {}){
  function convertNode(id){
    var ret = Object.assign({}, tree.data[id])
    ret.children = (tree.children[id] || []).map(convertNode)
    return ret
  }

  return tree.rootids.map(convertNode)
}

/*

  accepts an array of objects each with an 'id' prop

  returns:

   * data - a flat map of id -> object
   * list - array of ids (the order of the table)
  
*/
export function processListData(nodes = []){
  let data = {}
  
  nodes.forEach(node => {
    data[node.id] = node
  })

  let list = nodes.map(node => {
    return node.id
  })

  return {
    data,
    list
  }
}

/*

  return an array of the children for a given id
  
*/
export function getChildren(tree, id){
  return (tree.children[id] || []).map(cid => tree.data[cid])
}

/*

  return an array of ancestor objects for an item
  
*/
export function getAncestors(tree, id){
  var ret = []
  var nextParentId = null
  var currentId = id
  while(nextParentId = getParentId(tree, currentId)){
    ret.push(tree.data[nextParentId])
    currentId = nextParentId
  }
  return ret
}

/*

  move an item in the tree
  
*/
export function moveItem(tree, itemid, toid){
  let parentID = getParentId(tree, itemid)

  tree.children[parentID] = tree.children[parentID].filter(id => {
    return id!=itemid
  })

  tree.children[toid] = tree.children[toid] || []
  tree.children[toid].push(itemid)
  return tree
}

export function deleteItem(tree, item){
  let parentID = getParentId(tree, item.id)

  delete(tree.data[item.id])
  tree.children[parentID] = tree.children[parentID].filter(id => {
    return id!=item.id
  })
}

/*

  get the parentid of an item
  
*/
export function getParentId(tree, itemid){
  let ret = null
  Object.keys(tree.children || {}).forEach((parentid) => {
    let results = tree.children[parentid].filter(id => {
      return id==itemid
    })
    if(results.length>0) ret = parentid
  })
  return ret
}

/*

  get the next available id from the tree items
  
*/
export function getNextId(tree){
  var highestID = 0
  Object.keys(tree.data || {}).forEach(function(key){
    if(tree.data[key].id>highestID){
      highestID = tree.data[key].id
    }
  })
  return highestID+1
}

/*

  add a child item to a parent
  
*/
export function addChild(tree, parent, child){
  if(!child.id) child.id = getNextId(tree)
  tree.data[child.id] = child
  var existingChildren = tree.children[parent.id] || []
  existingChildren.push(child.id)
  tree.children[parent.id] = existingChildren
  return tree
}

/*

  get the rows in a table that are selected
  
*/
export function getSelectedTableRows(table){
  table = table || {}
  return (table.list || []).filter(id => {
    return table.data[id]._selected
  }).map(id => {
    return table.data[id]
  })
}

/*

  get the rows in a table
  
*/
export function getTableRows(table){
  table = table || {}
  return (table.list || []).map(id => {
    return table.data[id]
  })
}