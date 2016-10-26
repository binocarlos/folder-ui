import React from 'react'
import { Route, IndexRoute } from 'react-router'

import AppWrapper from './AppWrapper'
import Home from './Home'

import TreeWrapper from '../src/components/TreeWrapper'
import ToolbarWrapper from '../src/components/ToolbarWrapper'

import Tree from '../src/containers/Tree'
import ChildrenToolbar from '../src/containers/ChildrenToolbar'
import ChildrenTable from '../src/containers/ChildrenTable'

import { ContainerFactory } from '../src/tools'
import DB from './db'
import FolderActions from '../src/actions'

// Wrap the left hand sidebar wrapper with a wider width
const NavWrapper = ContainerFactory({
  width:250
})(TreeWrapper)

// an object that maps action names onto functions
// that return the URL to redirect to
// if the handler is not 
const standardHandlers = {
  // get the route to view an item
  open:(item) => {
    return 'view/' + item.id
  }
}

const productActions = FolderActions('products', DB())
const productFactory = ContainerFactory({
  actions:productActions,
  handlers:standardHandlers
})
const productContainers = {
  tree:productFactory(Tree),
  childrenToolbar:productFactory(ChildrenToolbar),
  childrenTable:productFactory(ChildrenTable)
}

const Routes = (opts = {}) => {
  return (
    <Route path="/" component={AppWrapper}>
      <IndexRoute component={Home} />
      <Route component={NavWrapper}>
        <Route path="products" 
          components={{
            sidebar: productContainers.tree,
            main: ToolbarWrapper
          }}>
          <IndexRoute components={{
            toolbar: productContainers.childrenToolbar,
            main: productContainers.childrenTable
          }} />
          <Route path="view/:id" components={{
            toolbar: productContainers.childrenToolbar,
            main: productContainers.childrenTable
          }} />
        </Route>
      </Route>
    </Route>
  )
}

export default Routes