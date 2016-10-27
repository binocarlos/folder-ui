import React from 'react'
import { Route, IndexRoute } from 'react-router'

import TreeWrapper from '../src/components/TreeWrapper'
import ToolbarWrapper from '../src/components/ToolbarWrapper'

import Tree from '../src/containers/Tree'
import ChildrenToolbar from '../src/containers/ChildrenToolbar'
import ChildrenTable from '../src/containers/ChildrenTable'
import FormToolbar from '../src/containers/FormToolbar'
import Form from '../src/containers/Form'

import { ContainerFactory } from '../src/tools'
import Schema from '../src/schema'
import FolderActions from '../src/actions'



import AppWrapper from './AppWrapper'
import Home from './Home'

import DB from './db'
import { PRODUCT_TYPES, PRODUCT_TABLE_FIELDS } from './schema'



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
    return item ? 'edit/' + parent.id + '/' + item.id : 'edit/' + parent.id
  },
  add:(descriptor) => {
    return 'add/' + item.id + '/' + descriptor.type
  }
}

const productActions = FolderActions('products', DB())
const productSchema = Schema({
  types:PRODUCT_TYPES,
  tableFields:PRODUCT_TABLE_FIELDS
})
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
  }),
  formToolbar:productFactory(FormToolbar, {
    
  }),
  form:productFactory(Form, {
    getSchema:productSchema.getSchema
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
  },
  edit:{
    toolbar: productContainers.formToolbar,
    main: productContainers.form
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
          <Route path="edit/:id" components={productViews.edit} />
          <Route path="edit/:parent/:id" components={productViews.edit} />
        </Route>
      </Route>
    </Route>
  )
}

export default Routes