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

#### `select_node(item)`

Pass this function and it will be run each time an item in the tree has been clicked.

Use this to trigger data being loaded when the tree is clicked.

#### `selected`

Pass the currently selected object in - it will be compared using `===`.

## TableViewer

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
 * onRowSelection - run when rows are selected

## ViewToolbar

A toolbar used for viewing the contents of a folder.

There are basic rules that apply to what buttons are displayed:

 * when nothing is selected (selected.length==0)
   * title = parent.name
   * add
   * edit
   * paste
 * when a single thing is selected (selected.length==1)
   * title = selected[0].name
   * open
   * edit
   * delete
   * cut
   * copy
 * when multiple things are selected (selected.length>1)
   * title = 'Multiple items'
   * delete
   * cut
   * copy

 * title - the toolbar title
 * selected - an array of objects that are selected
 * additems - an array of objects describing what is in the add menu
   * data - passed to the onadd function
   * title - text to display
   * icon - React element to display as the icon
 * disable - object with properties to control which buttons not to show
   * add
   * open
   * edit
   * delete
   * cut
   * copy
   * paste
 * children - React element to include after the left hand buttons
 * rightchildren - React element to include after the right hand buttons
 * onadd(data) - run when an item from the add menu is clicked
 * onbutton(buttonName, selected) - run when a button is clicked, passed the currently selected array

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