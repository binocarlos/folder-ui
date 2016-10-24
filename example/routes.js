import React from 'react'
import { Route, IndexRoute } from 'react-router'

import AppWrapper from './AppWrapper'
import Home from './Home'

import TreeWrapper from '../src/components/TreeWrapper'
import ToolbarWrapper from '../src/components/ToolbarWrapper'

import Tree from '../src/containers/Tree'
import ChildrenToolbar from '../src/containers/ChildrenToolbar'
import ChildrenTable from '../src/containers/ChildrenTable'

import { ActionFactory } from '../src/tools'
import DB from './db'
import FolderActions from '../src/actions'

const productActions = FolderActions('products', DB())

const productContainers = {
  tree:ActionFactory(Tree, productActions),
  childrenToolbar:ActionFactory(ChildrenToolbar, productActions),
  childrenTable:ActionFactory(ChildrenTable, productActions)
}

const Routes = (opts = {}) => {
  return (
    <Route path="/" component={AppWrapper}>
      <IndexRoute component={Home} />
      <Route component={TreeWrapper}>
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