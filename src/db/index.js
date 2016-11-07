import Paste from './paste'

/*

  a factory for database interfaces that injects proxy handlers
  
*/

const dbFactory = (db) => {

  const pasteDBHandler = Paste(db)

  const pasteHandler = db.pasteItems ? 
    db.pasteItems(pasteDBHandler) :
    pasteDBHandler

  return Object.assign({}, db, {
    pasteItems:pasteHandler
  })

}

export default dbFactory