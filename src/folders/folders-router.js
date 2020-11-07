const express = require('express');
const FoldersService = require('./folders-service');

const folderRouter = express.Router();
const jsonParser = express.json();


folderRouter
  .route('/')
//relevant
  .get((req, res, next) => {

    //connect to the service to get the data
    FoldersService.getAllFolders(req.app.get('db'))
      .then((folder) => {
        res.json(folder);
      })
      .catch(next);
  })
//relevant
  .post(jsonParser, (req, res, next) => {

    //take the input from the user
    const { folder_name } = req.body;
    const newFolder = { folder_name };

    //validate the input
    for (const field of ['folder_name']) {
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
    FoldersService.addFolders(
      req.app.get('db'),
      newFolder
    )
      .then((folder) => {
        res.status(201)
          .location(`/${folder.id}`)
          .json(folder);
      })
      .catch(next);
  });


folderRouter
  .route('/:id')
  .get((req, res, next) => {
    const { id } = req.params;

    //connect to the service to get the data
    FoldersService.getFoldersById(
      req.app.get('db'), id)
      .then((folder) => {
        if (!folder) {
          //if there is an error show it
          return res.status(404).json({
            error: {
              message: 'Folder not found!',
            },
          });
        }
        res.json(folder);
      })
      .catch(next);
  })

//relevant
  .delete((req, res, next) => {
    const { id } = req.params;

    FoldersService.deleteNote(
      req.app.get('db'), id)
      .then(() => {

        //delete was successful
        return res.status(204)
          .send('folder deleted')
          .end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { id } = req.params;
    const updatedFolder = req.body;
    console.log(updatedFolder);

    //update was successful
    FoldersService.updateFolders(req.app.get('db'), 
      id, 
      updatedFolder)

      .then(() => {
        res.status(204)
          .end();
      })
      .catch(next);
  });


module.exports = folderRouter;