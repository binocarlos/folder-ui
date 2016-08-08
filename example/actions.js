export const UPDATE_TREE_META = 'UPDATE_TREE_META'

export function update_tree_meta(meta) {
  return {
    type: UPDATE_TREE_META,
    meta
  }
}