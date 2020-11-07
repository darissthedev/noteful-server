const express = require('express');
const NotesService = require('./notes-service');

const notesRouter = express.Router();
const jsonParser = express.json();


notesRouter
  .route('/')
//relevant
  .get((req, res, next) => {

    //connect to the service to get the data
    NotesService.getAllNotes(req.app.get('db'))
      .then(notes => {
        res.json(notes);
      })
      .catch(next);
  })
//relevant
  .post(jsonParser, (req, res, next) => {

    //take the input from the user
    const { note_title, note_content, folder_id, date_modified } = req.body;
    const newNote = { note_title, note_content, folder_id, date_modified };

    //validate the input
    for (const field of ['note_title', 'note_content']) {
      if (!req.body[field]) {
        //if there is an error show it
        return res.status(400).json({
          error: {
            message: `${field} is required`,
          },
        });
      }
    }

    //save the input in the db
    NotesService.insertNotes(
      req.app.get('db'),
      newNote
    )
      .then((newNote) => {
        res.status(201)
          .location(`/${newNote.id}`)
          .json(newNote);
      })
      .catch(next);
  });


notesRouter
  .route('/:id')
  .get((req, res, next) => {
    const { id } = req.params;

    //connect to the service to get the data
    NotesService.getNotesById(
      req.app.get('db'), id)
      .then(notes => {
        if (!notes) {
          //if there is an error show it
          return res.status(404).json({
            error: {
              message: 'Note not found!',
            },
          });
        }
        res.json(notes);
      })
      .catch(next);
  })

//relevant
  .delete((req, res, next) => {
    const { id } = req.params;

    NotesService.deleteNote(
      req.app.get('db'), id)
      .then(() => {

        //delete was successful
        return res.status(204)
          .send('note deleted')
          .end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { id } = req.params;
    const updatedNote = req.body;
    console.log(updatedNote, id);

    //update was successful
    NotesService.updateNotes(req.app.get('db'), 
      id, 
      updatedNote)

      .then(() => {
        res.status(204)
          .end();
      })
      .catch(next);
  });


module.exports = notesRouter;