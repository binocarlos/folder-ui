import React from 'react'
import { Route, IndexRoute } from 'react-router'

import TreeWrapper from '../components/TreeWrapper'
import ToolbarWrapper from '../components/ToolbarWrapper'

import Tree from '../containers/Tree'
import ChildrenToolbar from '../containers/ChildrenToolbar'
import ChildrenTable from '../containers/ChildrenTable'
import FormToolbar from '../containers/FormToolbar'
import Form from '../containers/Form'

import { ContainerFactory } from '../tools'
import Schema from '../schema'
import FolderActions from '../actions'

import Routes from './routes'

const DEFAULT_TYPES = {
  folder:{
    title:'Folder',
    fields:[{
      name:'name'
    }],
    initialData:{
      
    }
  },
  item:{
    title:'Item',
    fields:[{
      name:'name'
    },{
      name:'comment'
    }],
    initialData:{
      
    }
  }
}

const DEFAULT_TABLE_FIELDS = [{
  title:'name',
  render:data => data.name
}]

const DEFAULT_LIBRARY = {}

const REQUIRED_OPTIONS = [
  'name',
  'path',
  'db'
]

const templateFactory = (opts = {}) => {

  opts = Object.assign({}, {
    width:250,
    types:DEFAULT_TYPES,
    tableFields:DEFAULT_TABLE_FIELDS,
    library:DEFAULT_LIBRARY,
  }, opts)

  REQUIRED_OPTIONS.forEach((name) => {
    if(!opts[name]) throw new Error(name + ' option required')
  })

  // Wrap the left hand sidebar wrapper with a wider width
  const NavWrapper = ContainerFactory({
    width:opts.width
  })(TreeWrapper)

  const routes = Routes({
    path:opts.path
  })

  const actions = FolderActions(opts.name, opts.db)
  const schema = Schema({
    types:opts.types,
    tableFields:opts.tableFields,
    library:opts.library
  })
  const factory = ContainerFactory({
    actions:actions,
    handlers:routes.handlers,
    info:routes.info
  })
  const containers = {
    tree:factory(Tree),
    childrenToolbar:factory(ChildrenToolbar, {
      getChildTypes:schema.getChildTypes
    }),
    childrenTable:factory(ChildrenTable, {
      fields:schema.getTableFields(),
      showCheckboxes:true,
      showHeader:false,
      multiSelectable:true
    }),
    formToolbar:factory(FormToolbar, {
      getSchema:schema.getSchema
    }),
    form:factory(Form, {
      getSchema:schema.getSchema,
      getLibrary:schema.getLibrary
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

  return (
    <Route component={NavWrapper}>
      <Route path={opts.path} components={views.tree}>
        <IndexRoute components={views.view} />
        <Route path="view/:id" components={views.view} />
        <Route path="delete/:parent/:ids" components={views.view} />
        <Route path="edit/:id" components={views.edit} />
        <Route path="edit/:parent/:id" components={views.edit} />
        <Route path="add/:parent/:type" components={views.edit} />
      </Route>
    </Route>
  )
}

export default templateFactory