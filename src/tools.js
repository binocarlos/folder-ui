import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router'
import hat from 'hat'

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
export const processTreeData = (rootnodes = []) => {
  let data = {}
  let map = {}
  let rootids = rootnodes.map(n => n.id)

  const processNode = (node) => {
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
export const dumpTreeData = (tree = {}, mapfn = (item) => item) => {
  const convertNode = (id) => {
    let ret = Object.assign({}, tree.data[id])
    ret.children = (tree.children[id] || []).map(convertNode)
    return mapfn(ret)
  }

  return tree.rootids.map(convertNode)
}

/*

  accepts an array of objects each with an 'id' prop

  returns:

   * data - a flat map of id -> object
   * list - array of ids (the order of the table)
  
*/
export const processListData = (nodes = []) => {
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
export const getChildren = (tree, id) => {
  const childIds = id ? (tree.children[id] || []) : tree.rootids
  return childIds.map(cid => tree.data[cid])
}

/*

  return an array of the children for a given id
  each child has it's own 'children' array filled in
  
*/
export const getDeepChildren = (tree, id) => {
  const childIds = id ? (tree.children[id] || []) : tree.rootids
  return childIds.map(cid => {
    return Object.assign({}, tree.data[cid], {
      children:getChildren(tree, cid)
    })
  })
}

/*

  return an array of ancestor objects for an item
  
*/
export const getAncestors = (tree, id) => {
  let ret = []
  if(!id) return ret
  let nextParentId = null
  let currentId = id
  while(nextParentId = getParentId(tree, currentId)){
    ret.push(tree.data[nextParentId])
    currentId = nextParentId
  }
  return ret
}

/*

  move an item in the tree
  
*/
export const moveItem = (tree, itemid, toid) => {
  let parentID = getParentId(tree, itemid)

  if(parentID){
    tree.children[parentID] = tree.children[parentID].filter(id => {
      return id!=itemid
    })
  }
  else{
    tree.rootids = tree.rootids.filter(id => {
      return id!=itemid
    })
  }
  
  if(toid){
    tree.children[toid] = tree.children[toid] || []
    tree.children[toid].push(itemid)
  }
  else{
    tree.rootids.push(itemid)
  }
  
  return tree
}

export const deleteItem = (tree, id) => {
  delete(tree.data[id])
  let parentID = getParentId(tree, id)

  if(parentID){
    tree.children[parentID] = tree.children[parentID].filter(cid => {
      return id!=cid
    })  
  }
  else{
    tree.rootids = tree.rootids.filter((rootid) => {
      return rootid != id
    })
  }
  return tree
}

/*

  get the parentid of an item
  
*/
export const getParentId = (tree, itemid) => {
  let ret = null
  if(!itemid) return ret
  Object.keys(tree.children || {}).forEach((parentid) => {
    let results = tree.children[parentid].filter(id => {
      return id==itemid
    })
    if(results.length>0) ret = parentid
  })
  return ret
}

/*

  return a new ID for a node
  
*/
export const getNextId = () => {
  return hat()
}

/*

  add a child item to a parent
  
*/
export const addChild = (tree, parent, child) => {
  if(!child.id) child.id = getNextId()
  tree.data[child.id] = child

  if(!parent){
    tree.rootids.push(child.id)
  }
  else{
    let existingChildren = tree.children[parent.id] || []
    existingChildren.push(child.id)
    tree.children[parent.id] = existingChildren
  }

  (child.children || []).forEach(subchild => {
    addChild(tree, child, subchild)
  })
  
  return tree
}

/*

  get the rows in a table that are selected
  
*/
export const getSelectedTableRows = (table) => {
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
export const getTableRows = (table) => {
  table = table || {}
  return (table.list || []).map(id => {
    return table.data[id]
  })
}


/*

  used to create closures for React components
  this means we can use the folder-ui containers
  directly from react-router without having
  to create wrapper components or hard-code the
  containers to use react-router this.props.route
  
*/
export const ContainerFactory = (opts = {}) => {
  return (ComponentClass = Component, inneropts = {}) => {
    return class ContainerClass extends Component {
      render() {
        const finalProps = Object.assign({}, this.props, opts, inneropts)
        return <ComponentClass {...finalProps} />
      }
    }
  }
}

/*

  the simplest component that includes the children
  used for the nested-route setup we have
  
*/
export class ChildrenWrapper extends Component {

  render() {
    return this.props.children
  }

}

export const serialize = (val) => {
  return JSON.parse(JSON.stringify(val))
}

/*

  get the context for the database based on the route
  
*/
export const getDatabaseContext = (ownProps) => {
  return {
    route:ownProps.route.path,
    url:ownProps.location.pathname,
    params:ownProps.params
  }
}