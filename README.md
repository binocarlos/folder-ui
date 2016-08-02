folder-ui
=========

ui components for a folder editor

## install

Install the module to your project:

```
$ npm install folder-ui --save
```

## Components

#### FolderEditor

2 column editor with tree / folder view

the user can add/edit and delete items to the current folder

The properties for the FolderEditor are split between the TreeViewer, FolderViewer and ItemEditor.

#### TreeViewer

Renders a tree menu for navigating around folders.

 * data - an object with a `children` property
 * expand_state - an object that describes the expanded status of each item
 * update_expand_state - a function that is run to update the treestate

The data property is an object - the required fields for each item:

 * id - the id of the item
 * name - the string to display for it's title
 * children - an array of child items

```javscript
{
  id:'123',
  name:'My Folder',
  children:[{
    id:'456',
    name:'Sub folder a',
    children:[]
  }]
}
```

#### FolderViewer

#### ItemEditor

## license

MIT