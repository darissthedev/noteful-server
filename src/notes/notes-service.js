const NotesService = {
  //relevant
  getAllNotes(db) {
    return db
      .select('*')
      .from('notes');
  },
  getNotesById(db, note_id) {
    return db
      .select('*')
      .from('notes')
      .where('notes.id', note_id)
      .first();
  },
  //relevant
  insertNotes(db, newNote) {
    return db
      .insert(newNote)
      .into('notes')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  //relevant
  updateNotes(db, note_id, newNote) {
    return db('notes')
      .update(newNote)
      .where({
        id: note_id
      })
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  //relevant
  deleteNotes(db, note_id) {
    return db('notes')
      .delete()
      .where({
        'id': note_id
      });
  }
};

module.exports = NotesService;