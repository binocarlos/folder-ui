folder-ui
=========

ui components for a folder editor

## install

Install the module to your project:

```
$ npm install folder-ui --save
```

![screenshot1](https://raw.githubusercontent.com/binocarlos/folder-ui/master/screenshot1.png)

![screenshot2](https://raw.githubusercontent.com/binocarlos/folder-ui/master/screenshot2.png)

`folder-ui` provides the following components to be used in a Window Explorer type application:

 * TreeViewer - view a hierarchical data structure
 * ChildrenViewer - display a list of items
 * ChildrenToolbar - a toolbar for the children viewer
 * FormViewer - edit a single item
 * FormToolbar - a toolbar for the form viewer

There are 2 main ways in which you an use this library:

#### external state

If you have a JSON file or database or something that your data lives in - you can connect that to the `folder-ui` Container components using the database library (more below)

#### existing redux state

If you already have state in your application that can be used to feed the visual components, you must create your own container components, actions and reducers.  In this case you can skip to the Visual Components section.

## Database Library

If you are working with external state and want `folder-ui` to handle redux state, you need to provide a database library.  A folder-ui database library is an object with the following properties - all functions:

 * `saveItem(item, done)` - save an item
 * `loadItem(id, done)` - load a single item
 * `addItem(parent, item, done)` - add an item to a parent
 * `pasteItems(mode, parent, items, done)` - paste items, mode is {copy,cut}
 * `deleteItems(items, done)` - delete items from a parent
 * `loadChildren(item, done)` - load the children for an item
 * `loadTree(done)` - load the tree data

In all cases the callback `done` takes the following signature: `done(err, data)` (i.e. standard node callback style)

## FolderReducer

To enable multiple `folder-ui` components in the same application - you must create the reducers by passing a `name` - this is used to filter actions so they only modify the correct part of the state tree:

```javascript
import { routerReducer } from 'react-router-redux'
import FolderReducer from 'folder-ui/lib/reducer'

const PRODUCTS_NAME = 'products'
const STORES_NAME = 'stores'

const reducer = combineReducers({
  routing: routerReducer,
  products: FolderReducer('products'),
  stores: FolderReducer('stores')
})
```

## FolderActions

You create a set of FolderActions for each reducer that you use.

As well as passing a `name` (which points to the correct reducer for these actions), you must also pass an instance of the database library and some routing information:

```javascript
import FolderActions from 'folder-ui/lib/actions'

// both of these modules implement the database library interface
import DB1 from './db1'
import DB2 from './db2'

// we pass a database and some routing info
// for how we have built the application
const productActions = FolderActions('products', DB1())

// DB2 is a REST api
const storesActions = FolderActions('stores', DB2())
```

Here - we have created 2 sets of actions, each hooked up to it's own reducer (using the name) and will consume the database instance we passed to it - one for each service.

## Container Components

Container components link the reducer, actions and database and can be used either with [react-router](https://github.com/ReactTraining/react-router) or stand-alone inside your own containers.

 * ChildrenTable
 * ChildrenToolbar
 * Form
 * FormToolbar
 * Tree

All of the container components require an `actions` property to work with - this should have been created using a database API as shown above.

To make using the container components alongside react-router easier - you can use the `ContainerFactory` function from `tools`.

```javascript
import FolderActions from 'folder-ui/lib/actions'
import { ContainerFactory } from 'folder-ui/lib/tools'
import Tree from 'folder-ui/lib/containers/Tree'

import DB1 from './db1'

// make some actions with a reducer name and database api
const productActions = FolderActions('products', DB1())

// create a route that will inject the productActions into the Tree container
<Route path="products" components={ContainerFactory(Tree, productActions)} />
```

## Wrapper Components

Wrapper components are used alongside react-router routes.

Here is an example of some routes that use the `TreeWrapper` to split left and right and the `ToolbarWrapper` to add a toolbar above the main right-hand content:

```javascript

// actions
import { ContainerFactory } from 'folder-ui/lib/tools'
import FolderActions from 'folder-ui/lib/actions'
import DB1 from './db1'

// wrapper components
import TreeWrapper from 'folder-ui/lib/components/TreeWrapper'
import ToolbarWrapper from 'folder-ui/lib/components/ToolbarWrapper'

// container components
import Tree from 'folder-ui/lib/containers/Tree'
import ChildrenTable from 'folder-ui/lib/containers/ChildrenTable'
import ChildrenToolbar from 'folder-ui/lib/containers/ChildrenToolbar'

const productActions = FolderActions('products', DB1())

// the tree wrapper splitting the side-bar and right-hand content
<Route component={TreeWrapper}>
  <Route path="products" 
    components={{
      // the tree on the side
      sidebar: ContainerFactory(Tree, productActions),

      // the toolbar wrapper splitting the top toolbar and bottom content
      main: ToolbarWrapper
    }}>
    <IndexRoute components={{

      // the toolbar above
      toolbar: ContainerFactory(ChildrenToolbar, productActions),

      // the main content below
      main: ContainerFactory(ChildrenTable, productActions)
    }} />
    <Route path="children/:id" components={{
      toolbar: ContainerFactory(ChildrenToolbar, productActions),
      main: ContainerFactory(ChildrenTable, productActions)
    }} />
  </Route>
</Route>
```

## Display Components

The following components are pure React, visual components.  They can be included directly in your own container components if you want.

Each display component has a corresponding container component that will hook up the state and actions.

### Tree

Renders a tree menu for navigating around folders.

 * `title` (string) - the title of the tree (optional)
 * `data` (array of objects) - an array of top level tree objects
 * `selected` (string) - the id of the currently selected node
 * `styles` (object) - override styles for elements:
   * selected - the currently selected item
   * header - the tree header
 * `getIcon(node)` - a function that returns a React element to be used as the icon for an node
 * `selectNode(node)` - a function to run when an item is selected
 * `toggleNode(node)` - a function to run when an item is toggled open or closed

#### `data`

The `data` property is an array of objects with the following fields:

 * id - string - a unique id for the node
 * name - string - the text to display for tree node
 * open - boolean - whether the tree node is open
 * children - an array of child tree nodes

An example of the `data` property:

```javascript
[{
  id:1,
  name:'Apples',
  open:true,
  children:[{
    id:2,
    name:'Granny Smith'
  },{
    id:3,
    name:'Golden Delicious'
  }]
}]
```

#### `getIcon(data)`

An optional function used to return an icon element for a node.

You can use the [material-ui svg icons](http://www.material-ui.com/#/components/svg-icon).  The sections & names of the icons are listed neatly on [this page](https://design.google.com/icons/) - lowercase - replace spaces with dashes (e.g. file -> folder shared = file/folder-shared)

```javascript
import FolderShared from 'material-ui/svg-icons/file/folder-shared'
import Folder from 'material-ui/svg-icons/file/folder'
function get_icon(data){
  if(data.type=='shared_folder'){
    return <FolderShared />
  }
  else{
    return <Folder />
  }
}
```


### ChildrenTable

A table to display the children of an item

 * `fields` (array of objects) - an array of columns to display
 * `data` (array of objects) - the data to display
 * `selectable` (boolean:true) - allow rows to be selected
 * `multiSelectable` (boolean:false) - allow multiple selections
 * `showCheckboxes` (boolean:false) - display the checkboxes for row selection
 * `showHeader` (boolean:true) - display the column titles
 * `height` (string) - the height of the table
 * `onRowSelection(nodes)` - run when items are selected

#### `fields`

Pass an array of field descriptors to control what columns appear in the table.

Each descriptor is an object with the following fields:

 * `title` - text to display in the column heading
 * `render(data)` - passed the row data and return a React elememnt
 * `name` - if set then use to default the title and render function (by displaying the field with that name)

#### `data`

An array of objects for the data to display.  Each object must have at least an `id` property and the `_selected` property of each object controls the selected status of the row.

### ChildrenToolbar

A toolbar to be used above the `ChildrenViewer` component.

 * `node` (object) - the current node (the parent of the children)
 * `children` (array of objects) - the children of the current node
 * `selected` (array of objects) - the currently selected nodes
 * `clipboard` (array of objects) - nodes currently in the clipboard
 * `isLeaf(node)` - return a boolean if the given node can have children
 * `getChildTypes(node)` - return an array of descriptors for what can be added to the given node 
 * `onAdd(descriptor)` - add an instance of the given descriptor to the current node
 * `onEdit(node)` - the edit button handler
 * `onPaste(nodes)` - the paste button handler
 * `onOpen(node)` - view a node's children
 * `onEdit(node)` - edit the given node
 * `onDelete(nodes)` - delete the given nodes
 * `onCopy(nodes)` - copy the given nodes to the clipboard
 * `onCut(nodes)` - cut the given nodes to the clipboard
 
#### `isLeaf(node)`

Tell the toolbar if the given `node` can have children.  If this returns `false` then the `Add` button will appear.

#### `getChildTypes(node)`

Return an array of descriptor objects each describing a thing that could be added to the given node.

Each descriptor can contain any fields you like (the descriptor is passed to the `onAdd` function if clicked) - the only pre-requisite is it has a `title` property.





























































## FolderRoutes

Whilst you can use the container and display components on their own - it is usual to use [react-router](https://github.com/ReactTraining/react-router) to trigger which component displays based on the route.

Here is an example of a fully-blown `folder-ui` setup using [react-router](https://github.com/ReactTraining/react-router):

```javascript
import TreeWrapper from 'folder-ui/lib/TreeWrapper'
import ToolbarWrapper from 'folder-ui/lib/ToolbarWrapper'
import ChildrenToolbar from 'folder-ui/lib/ChildrenToolbar'

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>

      <Router history={history}>
        <Route path="/" component={AppWrapper}>
          <IndexRoute component={Home} />
          <Route component={TreeWrapper}>
            <Route path="products" 
              components={{
                sidebar: TreeContainer, 
                main: ToolbarWrapper
              }}>
              <IndexRoute components={{
                toolbar: ChildrenToolbar
                main: Home
              }} />
            </Route>
            <Route path="store" 
              components={{
                sidebar: TreeContainer, 
                main: ContentWrapper
              }}>
              <IndexRoute component={Home} />
            </Route>
          </Route>
        </Route>
      </Router>

    </MuiThemeProvider>
  </Provider>,
  document.getElementById('mount')
)
```




















It also comes with a layout component to be used in conjunction with [react-router](https://github.com/ReactTraining/react-router) - here is a complete example:

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import thunk from 'redux-thunk'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import AppWrapper from './AppWrapper'

import FolderWrapper from 'folder-ui/lib/FolderWrapper'
import TreeContainer from 'folder-ui/lib/TreeContainer'
import ChildrenContainer from 'folder-ui/lib/ChildrenContainer'
import FormContainer from 'folder-ui/lib/FormContainer'

// the reducer and action factories
import FolderReducer from 'folder-ui/lib/reducer'
import FolderActions from 'folder-ui/lib/actions'

// the database api we are using the asynchronously load data
import DB from './db'
const db = DB()

// use the thunk and router middleware in our app
const finalCreateStore = compose(
  applyMiddleware(thunk, routerMiddleware(hashHistory)),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

// there are 2 folder-ui sections to our app
// we create a reducer and actions for each
const folderAPIs = {
  reducers:{
    products:FolderReducer('products'),
    stores:FolderReducer('stores')
  },
  actions:{
    products:FolderActions('products'),
    stores:FolderActions('stores')
  }
}

// fold our multiple folder-ui reducers into the store
const reducer = combineReducers({
  routing: routerReducer,
  ...folderAPIs.reducers
})

const store = finalCreateStore(reducer)
const history = syncHistoryWithStore(hashHistory, store)

injectTapEventPlugin()

ReactDOM.render(  
  <Provider store={store}>
    <MuiThemeProvider>

      <Router history={history}>
        <Route path="/" component={AppWrapper}>
          <IndexRoute component={Home} />
          <Route component={FolderWrapper}>
            <Route path="*" component={Folders} />
          </Route>
        </Route>
      </Router>

    </MuiThemeProvider>
  </Provider>,
  document.getElementById('mount')
)
```


## Usage

`folder-ui` provides container components, a reducer and some actions.

You can use the visual comonents independently of the containers and reducer but then up to you to provide the correct state and actions.

## Visual Components

The visual components can be used independently from each other and the `folder-ui` Containers, actions and reducer.

In this case - you are responsible for preparing the correct data structure and providing the correct event handler functions for each component.








## Containers

These React components are designed to integrate with a [redux](https://github.com/reactjs/redux) app.

The root `index.js`:

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import thunk from 'redux-thunk'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Wrapper from './Wrapper'
import Folders from './Folders'

import folderreducer from '../src/reducer'

const finalCreateStore = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

const reducer = combineReducers({
  folderui: folderreducer,
  routing: routerReducer
})

const store = finalCreateStore(reducer)

const history = syncHistoryWithStore(hashHistory, store)

injectTapEventPlugin()

ReactDOM.render(  
  <Provider store={store}>
    <MuiThemeProvider>

      <Router history={history}>
        <Route path="/" component={Wrapper}>
          <IndexRoute component={Folders} />
          <Route path="*" component={Folders} />
        </Route>
      </Router>

    </MuiThemeProvider>
  </Provider>,
  document.getElementById('mount')
)
```

And the core `Folders.js` component:

```javascript
import React, { Component, PropTypes } from 'react'
import FolderContainer from '../src/FolderContainer'
import { withRouter } from 'react-router'

import DB from './db'
import { get_schema } from './schema'

let db = DB()

class Folders extends Component {

  updateRoute(url) {
    this.props.router.push(url)
  }

  render() {

    return (
      <FolderContainer
        db={db}
        width={250}
        splat={this.props.params.splat}
        path={this.props.route.path}
        updateRoute={this.updateRoute.bind(this)}
        getSchema={get_schema} />
    )
  }

}

export default withRouter(Folders)
```

## Context

You may want to use multiple `folder-ui` components in your app which would all load data from different locations.

The `context` property passed to all the containers is passed on to each of the database functions.

This enables you to use a different context for loading data depending on which instance of the folder-ui is being used.

## reducername

The `reducername` property passed to containers is also used when multiple copies of `folder-ui` components are used in your app.

It controls what base reducer property is used to control which component - you can use multiple components each with their own individual reducer providing you pass the correct `reducername` (the top level property for that component).

## Database

You need to provide a set of database functions so the containers can load/save data.

The following is the signature of the database interface:

 * `saveItemDB:(item, context, done)` - save an item
 * `loadItemDB:(id, context, done)` - load a single item
 * `addItemDB:(parent, item, context, done)` - add an item to a parent
 * `pasteItemsDB:(mode, parent, items, context, done)` - paste items, mode is {copy,cut}
 * `deleteItemsDB:(items, context, done)` - delete items from a parent
 * `loadChildrenDB:(item, context, done)` - load the children for an item
 * `loadTreeDB:(context, done)` - load the tree data for an item

## Views

Sometimes it is desirable to allow the state of the current selected item / page to be represented by the application URL.

This allows you to use [react-router](https://github.com/reactjs/react-router) (or something else) to navigate around the app.

To do this - you can pass a `updateView` function and a `currentView` property into the various containers.

`updateView` will be called when the internal view of the `folder-ui` container changes - such as when an item from the tree is choosen.

`currentView` is expected to represent the same value that was passed to `updateView`.

The workflow is to capture the data from `updateView` - encode it into a Route and then decode the Route and pass the data back into the container.

Here is an example of a component that does this:

```javascript
import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router'

import NavWrapper from 'kettle-ui/lib/NavWrapper'

import TreeContainer from '../src/TreeContainer'
import ContentContainer from '../src/ContentContainer'

import DB from './db'
import { get_schema } from './schema'

let db = DB()

class Folders extends Component {

  updateView(data){
    var currentPath = this.props.route.path.replace(/\/?\*?$/g, '')
    this.props.router.push('/' + currentPath + '/' + data.id + '/' + data.view)
  }

  render() {

    var urlParts = (this.props.params.splat || '').split('/')

    var currentView = urlParts[0] ? {
      id:urlParts[0],
      view:urlParts[1] || 'children'
    } : null

    return (
      <NavWrapper
        width={250}
        paperprops={{
          zDepth:1,
          rounded:false
        }}
        navbar={
          <TreeContainer 
            loadTree={db.loadTree}
            loadChildren={db.loadChildren}
            updateView={this.updateView.bind(this)}
            currentView={currentView}
            title="My Folders" />
        }>
        
        <ContentContainer 
          loadChildrenDB={db.loadChildren}
          loadTreeDB={db.loadTree}
          getSchema={get_schema}
          saveItemDB={db.saveItem}
          addItemDB={db.addItem}
          deleteItemsDB={db.deleteItems}
          pasteItemsDB={db.pasteItems}
          updateView={this.updateView.bind(this)}
          currentView={currentView}
          offsetWidth={250} />
        
      </NavWrapper>
    )
  }

}

export default withRouter(Folders)
```

## ChildrenContainer

A container that displays a toolbar and the children of an item

 * loadTreeDB(done) - loads the data for the tree, in normal format (it will be passed via `tools.processTreeData`)
 * loadChildrenDB(item, done) - load the children for an item
 * deleteItemsDB(items, done) - delete some items
 * pasteItemsDB(mode, parent, items, done) - paste items into a parent (mode is 'cut' or 'copy')
 * reducername - where to look in the state
 * updateView - a function that is run when the view of the container updates
 * currentView - an object representing the current view (pass in the value from updateView)

## FormContainer

A container that displays a toolbar and biro form for an item.

 * loadChildrenDB(item, done) - load the children for an item
 * saveItemDB(item, done) - save the data for an item
 * addItemDB(parent, item, done) - add an item to a parent
 * getSchema(item) - get the form schema for an item
 * reducername - where to look in the state

## TreeContainer

A container that displays a tree.

 * loadTreeDB(done) - loads the data for the tree, in normal format (it will be passed via `tools.processTreeData`)
 * onSelect(item) - run when a tree item is selected - used to trigger other behavior (like load children in the table)
 * reducername - where to look in the state
 * updateView - a function that is run when the view of the container updates
 * currentView - an object representing the current view (pass in the value from updateView)

## ContentContainer

A combo of ChildrenContainer and FormContainer.

 * merged props from `ChildrenContainer` and `FormContainer`


## FolderContainer

Uses `react-router` to render a full tree, children and form container.

 * db - a database object providing the async api
 * reducername - where to look in the state
 * getSchema(item) - get the form schema for an item
 * width - the width of the tree sidebar
 * splat - the '/*' part of the url
 * context
 
To use this you must wrap your component with `react-router` and pass in the `splat`, `path` and `updateRoute` props:

```javascript
import React, { Component, PropTypes } from 'react'
import FolderContainer from '../src/FolderContainer'
import { withRouter } from 'react-router'

import DB from './db'
import { get_schema } from './schema'

let db = DB()

class Folders extends Component {

  updateRoute(url) {
    this.props.router.push(url)
  }

  render() {

    return (
      <FolderContainer
        db={db}
        width={250}
        splat={this.props.params.splat}
        path={this.props.route.path}
        updateRoute={this.updateRoute.bind(this)}
        getSchema={get_schema} />
    )
  }

}

export default withRouter(Folders)
```

#### `treedata`

The data property is an object with the following fields:

 * data - an object of id -> object
 * children - an object of id -> array of child ids
 * rootids - an array of ids of the top level nodes

This is to make it easier to work immutably with redux.

You can use the `processTreeData` function in `tools.js` to convert the original data format into the one above (e.g. when you load data from a REST API) .

```javscript
import { processTreeData } from 'folder-ui/lib/tools'

var treedata = processTreeData([{
  name:'My Folder',
  children:[{
    name:'Sub folder a',
    children:[]
  }]
}])

console.dir(treedata)

/*

{
  data:{...},
  children:{...}
}
  
*/
```

The original data property is an array of top level objects each with the following fields:

 * id - some kind of identifier
 * name - a string to display
 * children - an array of child items
 * open - control the initial open state of the item

You can have any other properties in a data node - you might need to map your source data to include the `id`, `name` and `children` fields.

To make it easier to work with redux - the data cannot be in 

#### `get_icon(data)`

An optional function used to return an icon element for a node.

You can use the [material-ui svg icons](http://www.material-ui.com/#/components/svg-icon).  The sections & names of the icons are listed neatly on [this page](https://design.google.com/icons/) - lowercase - replace spaces with dashes (e.g. file -> folder shared = file/folder-shared)

```javascript
import FolderShared from 'material-ui/svg-icons/file/folder-shared'
import Folder from 'material-ui/svg-icons/file/folder'
function get_icon(data){
  if(data.type=='shared_folder'){
    return <FolderShared />
  }
  else{
    return <Folder />
  }
}
```

If no function is given - it will default to the `file/folder` icon.

#### `select_node(id)`

Pass this function and it will be run each time an item in the tree has been clicked.

It will be passed the id of the selected item.

Use this to trigger data being loaded when the tree is clicked.

#### `selected`

Pass the currently selected id.

## ChildrenViewer

A component that will display a Table for an array of items.

 * data - an array of objects
 * fields - an array of objects representing column definitions
   * title - the title for the field
   * render(data) - a function that returns a React element used to render the value
 * height - table height
 * selectable - boolean that controls if you can select items in the list (true)
 * multiSelectable - boolean that controls multi-select (false)
 * showCheckboxes - boolean whether to show select checkboxes (false)
 * showHeader - show the column titles (true)
 * onRowSelection - run when rows are selected - passed an array of selected ids

To control the selected feature - data objects must have a `_selected` property to reflect they are selected.

## FormViewer

A component that will display a [biro](https://github.com/binocarlos/biro) Form for the current item

 * data - the data for the current item
 * meta - the biro meta for the current item
 * schema - the schema for the current item
 * onUpdate - the data in the form has changed
 * library - extra library items to merge into [biro-material-ui](https://github.com/binocarlos/biro-material-ui)

## Toolbar

A base toolbar class that can display buttons and drop-down buttons.

Properties:

 * title - the toolbar title
 * {leftbuttons,rightbuttons} - an array of dropdown or button descriptions for the {left,right} menu buttons
   * id - the identifier for the button
   * type - {button,dropdown,icon}
   * icon - React Element - used for the icon button
   * title - the button title
   * extraProps - extra props passed to the button
   * items - an array of objects describing what options are in the menu
     * id - the identifier for the button
     * data - passed to the onadd function
     * title - text to display
     * divider - a boolean that turns this item into a menu divider
 * children - React element to include after the left hand buttons
 * rightchildren - React element to include after the right hand buttons
 * onbutton(buttonName, data) - run when a button is clicked, passed the name of the button, the associated button data and the `selected` property

The toolbar also has some helper methods:

##### `getMenuItems(items, handler)`

generate a list of `MenuItem` components from source data

the handler is the function to run when an item is selected and it is passed the selected item

##### `getDropDownButton(label, items, handler, extraProps)`

generate a ButtonDropdown with the given items - items and handler are passed to `getMenuItems`

extraProps are passed to the underlying button.

##### `getIconDropdown(icon, items, handler, extraProps)`

generate a ButtonDropdown with the given items - items and handler are passed to `getMenuItems`

extraProps are passed to the underlying button.

##### `getButton(items, handler, extraProps)`

generate a normal button - handler is run when the button is clicked

You can pass a schema to the toolbar and it will render the correct components.

extraProps are passed to the underlying button.



## tools

#### `processTreeData`

Turn original tree format:

```javascript
[{
  id:1,
  title:'node',
  children:[{
    id:2,
    title:'c1'
  },{
    id:3,
    title:'c2'
  }]
}]
```

Into:

```javascript
{
  data:{
    1:{id:1,title:'node'},
    2:{id:2,title:'c1'},
    3:{id:3,title:'c2'},
  },
  children:{
    1:[2,3],
    2:[],
    3:[]
  }
}
```

#### `processListData`

Turn an array of objects into tabledata format:

```javascript
[{
  id:1,
  title:'node1'
},{
  id:2,
  title:'node2'
}]
```

Into:

```javascript
{
  data:{
    1:{id:1,title:'node1'},
    2:{id:2,title:'node2'}
  },
  list:[
    1,
    2
  ]
}
```

#### `getChildren`

Given a tree data structure and an id - return an array of child objects.

```javascript
import { getChildren } from 'folder-ui/lib/tools'

var tree = {
  data:{
    1:{id:1,title:'node'},
    2:{id:2,title:'c1'},
    3:{id:3,title:'c2'},
  },
  children:{
    1:[2,3],
    2:[],
    3:[]
  }
}

var children = getChildren(tree, 1)

console.dir(children)

/*

[{
  id:2,title:'c1'
},{
  id:3,title:'c2'
}]
  
*/
```

## license

MIT