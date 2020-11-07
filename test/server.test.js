const knex = require('knex');
const app = require('../src/app');

describe('Notes API:', function() {
  let db;
  let note = [{
    'title': 'French Crepes',
    'content': 'here is some content',

  },
  {
    'title': 'Danish Aebleskiver',
    'content': 'more content'
  },
  {
    'title': 'Italian Crespelle',
    'content': 'even more content'
  },
  {
    'title': 'Indonesian Serabi',
    'content': 'plus content'
  },
  {
    'title': 'Moroccan Msemen',
    'contetn': 'more content than before'
  }
  ];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  before('cleanup', () => db.raw('TRUNCATE TABLE notes RESTART IDENTITY;'));

  afterEach('cleanup', () => db.raw('TRUNCATE TABLE notes RESTART IDENTITY;'));

  after('disconnect from the database', () => db.destroy());

  describe('GET all notes', () => {

    beforeEach('insert some notes', () => {
      return db('notes').insert(note);
    });

    //relevant
    it('should respond to GET `/api/notes` with an array of notes and status 200', function() {
      return supertest(app)
        .get('/api/notes')
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(note.length);
          res.body.forEach((item) => {
            expect(item).to.be.a('object');
            expect(item).to.include.keys('id', 'title', 'completed');
          });
        });
    });

  });


  describe('GET notes by id', () => {

    beforeEach('insert some notes', () => {
      return db('notes').insert(note);
    });

    it('should return correct notes when given an id', () => {
      let doc;
      return db('notes')
        .first()
        .then(_doc => {
          doc = _doc;
          return supertest(app)
            .get(`/api/notes/${doc.id}`)
            .expect(200);
        })
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys('id', 'title', 'content');
          expect(res.body.id).to.equal(doc.id);
          expect(res.body.title).to.equal(doc.title);
          expect(res.body.content).to.equal(doc.content);
        });
    });

    it('should respond with a 404 when given an invalid id', () => {
      return supertest(app)
        .get('/api/notes/aaaaaaaaaaaa')
        .expect(404);
    });

  });


  describe('POST (create) new note', function() {

    //relevant
    it('should create and return a new note when provided valid data', function() {
      const newItem = {
        'title': 'Irish Boxty'
      };

      return supertest(app)
        .post('/api/notes')
        .send(newItem)
        .expect(201)
        .expect(res => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'title', 'content');
          expect(res.body.title).to.equal(newItem.title);
          expect(res.body.content).to.equal(newItem.content);
          expect(res.headers.location).to.equal(`/api/notes/${res.body.id}`);
        });
    });

    it('should respond with 400 status when given bad data', function() {
      const badItem = {
        foobar: 'broken item'
      };
      return supertest(app)
        .post('/api/notes')
        .send(badItem)
        .expect(400);
    });

  });


  describe('PATCH (update)  notes by id', () => {

    beforeEach('insert some notes', () => {
      return db('notes').insert(note);
    });

    //relevant
    it('should update item when given valid data and an id', function() {
      const item = {
        'title': 'American Pancakes'
      };

      let doc;
      return db('notes')
        .first()
        .then(_doc => {
          doc = _doc;
          return supertest(app)
            .patch(`/api/notes/${doc.id}`)
            .send(item)
            .expect(200);
        })
        .then(res => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'title', 'completed');
          expect(res.body.title).to.equal(item.title);
          expect(res.body.content).to.equal(item.content);
        });
    });

    it('should respond with 400 status when given bad data', function() {
      const badItem = {
        foobar: 'broken item'
      };

      return db('notes')
        .first()
        .then(doc => {
          return supertest(app)
            .patch(`/api/notes/${doc.id}`)
            .send(badItem)
            .expect(400);
        });
    });

    it('should respond with a 404 for an invalid id', () => {
      const item = {
        'title': 'Buy New Dishes'
      };
      return supertest(app)
        .patch('/api/notes/aaaaaaaaaaaaaaaaaaaaaaaa')
        .send(item)
        .expect(404);
    });

  });


  describe('DELETE a notes by id', () => {

    beforeEach('insert some notes', () => {
      return db('notes').insert(note);
    });

    //relevant
    it('should delete an item by id', () => {
      return db('notes')
        .first()
        .then(doc => {
          return supertest(app)
            .delete(`/api/notes/${doc.id}`)
            .expect(204);
        });
    });

    it('should respond with a 404 for an invalid id', function() {
      return supertest(app)
        .delete('/api/notes/aaaaaaaaaaaaaaaaaaaaaaaa')
        .expect(404);
    });
  });
});