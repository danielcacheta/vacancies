'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Vacancy = mongoose.model('Vacancy'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  vacancy;

/**
 * Vacancy routes tests
 */
describe('Vacancy Admin CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      roles: ['user', 'admin'],
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new vacancy
    user.save()
      .then(function () {
        vacancy = {
          title: 'Vacancy Title',
          content: 'Vacancy Content'
        };

        done();
      })
      .catch(done);
  });

  it('should be able to save a vacancy if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new vacancy
        agent.post('/api/vacancies')
          .send(vacancy)
          .expect(200)
          .end(function (vacancySaveErr, vacancySaveRes) {
            // Handle vacancy save error
            if (vacancySaveErr) {
              return done(vacancySaveErr);
            }

            // Get a list of vacancies
            agent.get('/api/vacancies')
              .end(function (vacanciesGetErr, vacanciesGetRes) {
                // Handle vacancy save error
                if (vacanciesGetErr) {
                  return done(vacanciesGetErr);
                }

                // Get vacancies list
                var vacancies = vacanciesGetRes.body;

                // Set assertions
                (vacancies[0].user._id).should.equal(userId);
                (vacancies[0].title).should.match('Vacancy Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update a vacancy if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new vacancy
        agent.post('/api/vacancies')
          .send(vacancy)
          .expect(200)
          .end(function (vacancySaveErr, vacancySaveRes) {
            // Handle vacancy save error
            if (vacancySaveErr) {
              return done(vacancySaveErr);
            }

            // Update vacancy title
            vacancy.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing vacancy
            agent.put('/api/vacancies/' + vacancySaveRes.body._id)
              .send(vacancy)
              .expect(200)
              .end(function (vacancyUpdateErr, vacancyUpdateRes) {
                // Handle vacancy update error
                if (vacancyUpdateErr) {
                  return done(vacancyUpdateErr);
                }

                // Set assertions
                (vacancyUpdateRes.body._id).should.equal(vacancySaveRes.body._id);
                (vacancyUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save a vacancy if no title is provided', function (done) {
    // Invalidate title field
    vacancy.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new vacancy
        agent.post('/api/vacancies')
          .send(vacancy)
          .expect(422)
          .end(function (vacancySaveErr, vacancySaveRes) {
            // Set message assertion
            (vacancySaveRes.body.message).should.match('Title cannot be blank');

            // Handle vacancy save error
            done(vacancySaveErr);
          });
      });
  });

  it('should be able to delete a vacancy if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new vacancy
        agent.post('/api/vacancies')
          .send(vacancy)
          .expect(200)
          .end(function (vacancySaveErr, vacancySaveRes) {
            // Handle vacancy save error
            if (vacancySaveErr) {
              return done(vacancySaveErr);
            }

            // Delete an existing vacancy
            agent.delete('/api/vacancies/' + vacancySaveRes.body._id)
              .send(vacancy)
              .expect(200)
              .end(function (vacancyDeleteErr, vacancyDeleteRes) {
                // Handle vacancy error error
                if (vacancyDeleteErr) {
                  return done(vacancyDeleteErr);
                }

                // Set assertions
                (vacancyDeleteRes.body._id).should.equal(vacancySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single vacancy if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new vacancy model instance
    vacancy.user = user;
    var vacancyObj = new Vacancy(vacancy);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new vacancy
        agent.post('/api/vacancies')
          .send(vacancy)
          .expect(200)
          .end(function (vacancySaveErr, vacancySaveRes) {
            // Handle vacancy save error
            if (vacancySaveErr) {
              return done(vacancySaveErr);
            }

            // Get the vacancy
            agent.get('/api/vacancies/' + vacancySaveRes.body._id)
              .expect(200)
              .end(function (vacancyInfoErr, vacancyInfoRes) {
                // Handle vacancy error
                if (vacancyInfoErr) {
                  return done(vacancyInfoErr);
                }

                // Set assertions
                (vacancyInfoRes.body._id).should.equal(vacancySaveRes.body._id);
                (vacancyInfoRes.body.title).should.equal(vacancy.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (vacancyInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    Vacancy.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
