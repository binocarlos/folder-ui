import React from 'react'
import { Route, IndexRoute } from 'react-router'

import BasicTemplate from '../src/templates/basic'

import AppWrapper from './AppWrapper'
import Home from './Home'

import DB from './db'
import { TYPES, TABLE_FIELDS, LIBRARY } from './schema'

const ProductRoutes = BasicTemplate({
  types:TYPES,
  tableFields:TABLE_FIELDS,
  library:LIBRARY,
  name:'products',
  path:'products',
  db:DB()
})

const ShopRoutes = BasicTemplate({
  types:TYPES,
  tableFields:TABLE_FIELDS,
  library:LIBRARY,
  name:'shops',
  path:'shops',
  db:DB([{
    id:0,
    name:'My Shops',
    children:[]
  }])
})

const Routes = (opts = {}) => {
  return (
    <Route path="/" component={AppWrapper}>
      <IndexRoute component={Home} />
      {ProductRoutes}
      {ShopRoutes}
    </Route>
  )
}

export default Routes