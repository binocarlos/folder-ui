import React from 'react'
import { Route, IndexRoute } from 'react-router'

import TreeWrapper from '../../components/TreeWrapper'
import ToolbarWrapper from '../../components/ToolbarWrapper'

import Tree from '../../containers/Tree'
import ChildrenToolbar from '../../containers/ChildrenToolbar'
import ChildrenTable from '../../containers/ChildrenTable'
import FormToolbar from '../../containers/FormToolbar'
import Form from '../../containers/Form'

import { ContainerFactory } from '../../tools'
import Schema from '../../schema'
import FolderActions from '../../actions'

import Settings from '../settings'
import RouteHandlers from './routehandlers'


const templateFactory = (opts = {}) => {

  opts = Settings(opts)

  // Wrap the left hand sidebar wrapper with a wider width
  const NavWrapper = ContainerFactory({
    width:opts.width
  })(TreeWrapper)

  const routes = RouteHandlers({
    path:opts.path
  })

  const actions = FolderActions(Object.assign({}, opts, {
    routes
  }))

  const schema = Schema(opts)

  const factory = ContainerFactory({
    actions:actions,
    handlers:routes.routeHandlers,
    info:routes.routeInfo
  })

  const containers = {
    tree:factory(Tree, {
      getIcon:opts.getIcon
    }),
    childrenToolbar:factory(ChildrenToolbar, {
      getDescriptors:schema.getDescriptors,
      filterActions:schema.filterActions,
      isEditable:schema.isEditable,
      getChildren:opts.childrenToolbarChildren,
      getIcon:opts.getIcon
    }),
    childrenTable:factory(ChildrenTable, {
      getFields:schema.getTableFields,
      showCheckboxes:true,
      showHeader:opts.showTableHeader,
      multiSelectable:true
    }),
    formToolbar:factory(FormToolbar, {
      getSchema:schema.getSchema,
      isEditable:schema.isEditable,
      getChildren:opts.formToolbarChildren,
      getIcon:opts.getIcon
    }),
    form:factory(Form, {
      getSchema:schema.getSchema,
      getContext:opts.getFormContext,
      getItemType:schema.getItemType,
      getLibrary:schema.getLibrary,
      getNewItem:schema.getNewItem,
      isEditable:schema.isEditable
    })
  }
  const views = {
    tree:{
      sidebar: containers.tree,
      main: ToolbarWrapper
    },
    view:{
      toolbar: containers.childrenToolbar,
      main: containers.childrenTable
    },
    edit:{
      toolbar: containers.formToolbar,
      main: containers.form
    }
  }

  const getRoutes = (onEnter) => {
    return (
      <Route component={NavWrapper}>
        <Route path={opts.path} components={views.tree} onEnter={onEnter}>
          <IndexRoute components={views.view} />
          <Route path="view" components={views.view} />
          <Route path="view/:id" components={views.view} />
          <Route path="delete/:parent/:ids" components={views.view} />
          <Route path="edit/:id" components={views.edit} />
          <Route path="edit/:parent/:id" components={views.edit} />
          <Route path="add/:parent/:type" components={views.edit} />
        </Route>
      </Route>
    )
  }

  return {
    name:opts.name,
    db:opts.db,
    actions,
    getRoutes
  }
}

export default templateFactory