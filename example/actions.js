export const TREE_SELECT_NODE = 'TREE_SELECT_NODE'

export function tree_select_node(data) {
  return {
    type: TREE_SELECT_NODE,
    data
  }
}