folder-ui
=========

ui components for a folder editor

## install

Install the module to your project:

```
$ npm install folder-ui --save
```

## TreeViewer

Renders a tree menu for navigating around folders.

 * title - the title of the tree (optional)
 * treedata - an array of top level objects each with a `children` property
 * getIcon(node) - a function that returns a React element to be used as the icon
 * selectNode - a function to run when an item is selected
 * selected - the data object currently selected
 * styles - override styles for elements:
   * selected - the currently selected item
   * header - the tree header

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

##### `getButton(items, handler, extraProps)`

generate a normal button - handler is run when the button is clicked

You can pass a schema to the toolbar and it will render the correct components.

extraProps are passed to the underlying button.

## ChildrenContainer

A container that displays a toolbar and the children of an item

 * loadChildren(item, done) - load the children for an item
 * deleteItems(items, done) - delete some items
 * copyItems(items, done) - copy items to the clipboard
 * cutItems(items, done) - cut items to the clipboard
 * pasteItems(parent, mode, items, done) - paste items into a parent (mode is 'cut' or 'copy')
 * reducername - where to look in the state

## FormContainer

A container that displays a toolbar and biro form for an item.

 * loadChildren(item, done) - load the children for an item
 * saveItem(item, done) - save the data for an item
 * addItem(parent, item, done) - add an item to a parent
 * getSchema(item) - get the form schema for an item
 * reducername - where to look in the state

## TreeContainer

A container that displays a tree.

 * loadTree(done) - loads the data for the tree, in normal format (it will be passed via `tools.processTreeData`)
 * onSelect(item) - run when a tree item is selected - used to trigger other behavior (like load children in the table)
 * reducername - where to look in the state

## ContentContainer

A combo of ChildrenContainer and FormContainer.

 * merged props from `ChildrenContainer` and `FormContainer`

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