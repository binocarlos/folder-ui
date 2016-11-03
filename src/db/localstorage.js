/*

  a version of the memoryDB that saves to localstorage
  
*/

import localStorage from 'local-storage'
import MemoryDB from './memory'
import { dumpTreeData } from '../tools'

export default function localstoragedb(opts = {}){

  if(!opts.name) throw new Error('localstoragedb requires a name')

  const loadData = () => {
    const jsonString = localStorage.get(opts.name) || ''
    return jsonString.charAt(0) == '{' ?
      dumpTreeData(JSON.parse(jsonString)) :
      opts.data || []
  }

  const saveData = (data) => {
    localStorage.set(opts.name, JSON.stringify(data))
  }

  opts.data = loadData()

  opts.commit = (data, done) => {
    saveData(data)
    done()
  }

  return MemoryDB(opts)
}