export const TREE_SELECT_NODE = 'TREE_SELECT_NODE'

export function tree_select_node(data) {
  return {
    type: TREE_SELECT_NODE,
    data
  }
}

export const TABLE_SELECT_NODES = 'TABLE_SELECT_NODES'

export function table_select_nodes(data) {
  return {
    type: TABLE_SELECT_NODES,
    data
  }
}