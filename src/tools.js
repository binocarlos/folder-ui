/*

  updating node data in a tree structure is very
  hard with redux

  for this reason - we need to pass the tree data
  in the following format:

   * data - a flat map of id -> object
   * map - a flat map of id -> [childids]
  
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