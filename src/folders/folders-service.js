const FoldersService = {
  //relevant
  getAllFolders(db) {
    return db
      .select('*')
      .from('folders');
  },
  getFoldersById(db, folder_id) {
    return db
      .select('*')
      .from('folders')
      .where('folders.id', folder_id)
      .first();
  },
  //relevant
  addFolders(db, newFolder) {
    return db
      .insert(newFolder)
      .into('folders')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  //relevant
  updateFolders(db, folder_id, newFolder) {
    return db('folders')
      .update(newFolder)
      .where({
        id: folder_id
      })
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  //relevant
  deleteFolders(db, folder_id) {
    return db('folders')
      .delete()
      .where({
        'id': folder_id
      });
  }
};
  
module.exports = FoldersService;