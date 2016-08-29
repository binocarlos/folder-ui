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
  var data = {}
  var map = {}
  var rootids = rootnodes.map(n => n.id)

  function processNode(node){
    var children = node.children || []
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
  var data = {}
  
  nodes.forEach(node => {
    data[node.id] = node
  })

  var list = nodes.map(node => {
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