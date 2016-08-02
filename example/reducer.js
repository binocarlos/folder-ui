import { EXPAND_STATE_UPDATE } from './actions'

export default function treereducer(state = {}, action = {}) {
  switch (action.type) {
    case EXPAND_STATE_UPDATE:
      return Object.assign({}, state, {
        expandstate:action.data
      })
    default:
      return state
  }
}