export const FOLDERUI_TREE_SELECT_NODE = 'FOLDERUI_TREE_SELECT_NODE'

export function tree_select_node(data) {
  return {
    type: FOLDERUI_TREE_SELECT_NODE,
    data
  }
}

export const FOLDERUI_TABLE_SELECT_NODES = 'FOLDERUI_TABLE_SELECT_NODES'

export function table_select_nodes(data) {
  return {
    type: FOLDERUI_TABLE_SELECT_NODES,
    data
  }
}

export const FOLDERUI_EDIT_ITEM = 'FOLDERUI_EDIT_ITEM'

export function edit_item(item) {
  return {
    type: FOLDERUI_EDIT_ITEM,
    item
  }
}

export const FOLDERUI_EDIT_ITEM_UPDATE = 'FOLDERUI_EDIT_ITEM_UPDATE'

export function edit_item_update(data, meta) {
  return {
    type: FOLDERUI_EDIT_ITEM_UPDATE,
    data,
    meta
  }
}

export const FOLDERUI_EDIT_ITEM_REVERT = 'FOLDERUI_EDIT_ITEM_REVERT'

export function edit_item_revert(item) {
  return {
    type: FOLDERUI_EDIT_ITEM_REVERT,
    item
  }
}

export const FOLDERUI_EDIT_ITEM_CANCEL = 'FOLDERUI_EDIT_ITEM_CANCEL'

export function edit_item_cancel(item) {
  return {
    type: FOLDERUI_EDIT_ITEM_CANCEL,
    item
  }
}

export const FOLDERUI_EDIT_ITEM_SAVE = 'FOLDERUI_EDIT_ITEM_SAVE'

export function edit_item_save(item) {
  return {
    type: FOLDERUI_EDIT_ITEM_SAVE,
    item
  }
}