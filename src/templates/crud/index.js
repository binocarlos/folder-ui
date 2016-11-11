import React from 'react'
import { Route, IndexRoute } from 'react-router'

import ToolbarWrapper from '../../components/ToolbarWrapper'

import ChildrenToolbar from '../../containers/ChildrenToolbar'
import ChildrenTable from '../../containers/ChildrenTable'
import FormToolbar from '../../containers/FormToolbar'
import Form from '../../containers/Form'

import { ContainerFactory } from '../../tools'
import Schema from '../../schema'
import FolderActions from '../../actions'

import Settings from '../settings'
import RouteHandlers from './routehandlers'

const getUrl = (parts = []) => {
  return parts
    .filter(part => part)
    .join('/')
}

const childrenURL = (base) => {
  return getUrl([base])
}

const itemUrl = (base, id) => {
  return getUrl([base, id])
}

const disabledUrl = () => {
  throw new Error('loadTree is disabled for a crud template')
}

const CRUD_URLS = {
  loadTree:disabledUrl,
  pasteItems:disabledUrl,
  loadDeepChildren:disabledUrl,
  loadChildren:childrenURL,
  loadItem:itemUrl,
  addItem:itemUrl,
  saveItem:itemUrl,
  deleteItem:itemUrl
}

const templateFactory = (opts = {}) => {

  opts = Settings(opts)

  const routes = RouteHandlers({
    path:opts.path
  })

  if(!opts.crudParent) throw new Error('crud template requires a crud parent')

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
    childrenToolbar:factory(ChildrenToolbar, {
      getDescriptors:schema.getDescriptors,
      filterActions:schema.filterActions,
      isEditable:schema.isEditable,
      getChildren:opts.childrenToolbarChildren,
      getIcon:opts.getIcon,
      crudParent:opts.crudParent,
      getTitle:schema.getTitle
    }),
    childrenTable:factory(ChildrenTable, {
      getFields:schema.getTableFields,
      crudParent:opts.crudParent,
      showCheckboxes:true,
      showHeader:true,
      multiSelectable:true
    }),
    formToolbar:factory(FormToolbar, {
      getSchema:schema.getSchema,
      isEditable:schema.isEditable,
      getChildren:opts.formToolbarChildren,
      getIcon:opts.getIcon,
      crudParent:opts.crudParent,
      getTitle:schema.getTitle
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
    view:{
      toolbar: containers.childrenToolbar,
      main: containers.childrenTable
    },
    edit:{
      toolbar: containers.formToolbar,
      main: containers.form
    }
  }

  const getRoutes = () => {
    return (
      <Route path={opts.path} component={ToolbarWrapper}>
        <IndexRoute components={views.view} />
        <Route path="edit/:id" components={views.edit} />
        <Route path="add/:type" components={views.edit} />
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