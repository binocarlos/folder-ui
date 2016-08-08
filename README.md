folder-ui
=========

ui components for a folder editor

## install

Install the module to your project:

```
$ npm install folder-ui --save
```

## FolderEditor

2 column editor with tree / folder view

the user can add/edit and delete items to the current folder

The properties for the FolderEditor are split between the TreeViewer, FolderViewer and ItemEditor.

## TreeViewer

Renders a tree menu for navigating around folders.

 * title - the title of the tree (optional)
 * data - an array of top level objects each with a `children` property
 * get_icon - a function that returns a React element to be used as the icon

#### `data`

The data property is an array of top level objects each with the following fields:

 * name - a string to display
 * children - an array of child items

```javscript
{
  name:'My Folder',
  children:[{
    name:'Sub folder a',
    children:[]
  }]
}
```

You can have any other properties in a data node - you might need to map your source data to include the `id`, `name` and `children` fields.

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

## FolderViewer

## ItemEditor

## license

MIT