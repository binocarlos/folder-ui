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
import Schema from '../src/schema'
import { PRODUCT_TYPES, PRODUCT_TABLE_FIELDS } from './schema'
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
  },
  // edit is in the context of a parent
  edit:(parent, item) => {
    return 'edit/' + parent.id + '/' + item.id
  },
  add:(descriptor) => {
    return 'add/' + item.id + '/' + descriptor.type
  }
}

const productActions = FolderActions('products', DB())
const productSchema = Schema(PRODUCT_TYPES, PRODUCT_TABLE_FIELDS)
const productFactory = ContainerFactory({
  actions:productActions,
  handlers:standardHandlers
})
const productContainers = {
  tree:productFactory(Tree),
  childrenToolbar:productFactory(ChildrenToolbar, {
    getChildTypes:productSchema.getChildTypes
  }),
  childrenTable:productFactory(ChildrenTable, {
    fields:productSchema.getTableFields(),
    showCheckboxes:true,
    showHeader:false,
    multiSelectable:true
  })
}
const productViews = {
  tree:{
    sidebar: productContainers.tree,
    main: ToolbarWrapper
  },
  view:{
    toolbar: productContainers.childrenToolbar,
    main: productContainers.childrenTable
  }
}

const Routes = (opts = {}) => {
  return (
    <Route path="/" component={AppWrapper}>
      <IndexRoute component={Home} />
      <Route component={NavWrapper}>
        <Route path="products" components={productViews.tree}>
          <IndexRoute components={productViews.view} />
          <Route path="view/:id" components={productViews.view} />
        </Route>
      </Route>
    </Route>
  )
}

export default Routes