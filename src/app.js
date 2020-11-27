require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {
  NODE_ENV
} = require('./config');
const errorHandler = require('./middleware/error-handler');
const notesRouter = require('./notes/notes-router');
const folderRouter = require('./folders/folders-router');

const app = express();

const morganOption = (NODE_ENV === 'production') ?
  'tiny' :
  'common';

app.use(morgan(morganOption, {
  skip: () => NODE_ENV === 'test',
}));

app.use(cors());
app.use(helmet());

app.use(express.static('public'));

app.use('/api/notes', notesRouter);
app.use('/api/folders', folderRouter);
app.use(errorHandler);

module.exports = app;
