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
  adminCredentials,
  user,
  adminUser,
  vacancy;

/**
 * Vacancy routes tests
 */
describe('Vacancy CRUD tests', function () {

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

    // Create admin credentials
    adminCredentials = {
      usernameOrEmail: 'admin-username',
      password: 'M3@n.jsI$Aw3$0m3',
      roles: ['admin']
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Create a new admin user
    adminUser = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'admin-test@test.com',
      username: adminCredentials.usernameOrEmail,
      password: adminCredentials.password,
      roles: adminCredentials.roles,
      provider: 'local'
    });

    // Save a user to the test db and create new vacancy
    Promise.all([
      user.save(),
      adminUser.save()
    ])
      .then(function () {
        vacancy = {
          title: 'Vacancy Title',
          content: 'Vacancy Content'
        };
        done();
      })
      .catch(done);
  });

  it('should be able to save a vacancy if logged in with the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(adminCredentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/vacancies')
          .send(vacancy)
          .expect(200)
          .end(function (vacancySaveErr, vacancySaveRes) {
            // Handle vacancy save error
            if (vacancySaveErr) {
              return done(vacancySaveErr);
            }
            done();
          });

      });
  });

  it('should be able to save a vacancy if logged in with the "user" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/vacancies')
          .send(vacancy)
          .expect(200)
          .end(function (vacancySaveErr, vacancySaveRes) {
            // Handle vacancy save error
            if (vacancySaveErr) {
              return done(vacancySaveErr);
            }
            done();
          });

      });
  });

  it('should not be able to save a vacancy if not logged in', function (done) {
    agent.post('/api/vacancies')
      .send(vacancy)
      .expect(403)
      .end(function (vacancySaveErr, vacancySaveRes) {
        // Call the assertion callback
        done(vacancySaveErr);
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

  it('should be able to update a vacancy if signed in with the "admin" role', function (done) {
    // Set vacancy user
    vacancy.user = adminUser;

    // Create new vacancy model instance
    var vacancyObj = new Vacancy(vacancy);

    // Save the vacancy
    vacancyObj.save(function () {
      agent.post('/api/auth/signin')
        .send(adminCredentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }
          // Updating vacancy
          agent.put('/api/vacancies/' + vacancyObj._id)
            .send(vacancy)
            .expect(200)
            .end(function (vacancySaveErr, vacancySaveRes) {
              if (vacancySaveErr) {
                return done(vacancySaveErr);
              }
              done();
            });
        });
    });
  });

  it('should be able to update a vacancy if signed in with the "user" role', function (done) {
    // Set vacancy user
    vacancy.user = user;

    // Create new vacancy model instance
    var vacancyObj = new Vacancy(vacancy);

    // Save the vacancy
    vacancyObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }
          // Updating vacancy
          agent.put('/api/vacancies/' + vacancyObj._id)
            .send(vacancy)
            .expect(200)
            .end(function (vacancySaveErr, vacancySaveRes) {
              if (vacancySaveErr) {
                return done(vacancySaveErr);
              }
              done();
            });
        });
    });
  });

  it('should be able to update a vacancy created by someone else if signed in with the "admin" role', function (done) {
    // Set vacancy user
    vacancy.user = user;

    // Create new vacancy model instance
    var vacancyObj = new Vacancy(vacancy);

    // Save the vacancy
    vacancyObj.save(function () {
      agent.post('/api/auth/signin')
        .send(adminCredentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }
          // Updating vacancy
          agent.put('/api/vacancies/' + vacancyObj._id)
            .send(vacancy)
            .expect(200)
            .end(function (vacancySaveErr, vacancySaveRes) {
              if (vacancySaveErr) {
                return done(vacancySaveErr);
              }
              done();
            });
        });
    });
  });

  it('should not be able to update a vacancy from someone else if signed in with the "user" role', function (done) {
    // Set vacancy user
    vacancy.user = adminUser;

    // Create new vacancy model instance
    var vacancyObj = new Vacancy(vacancy);

    // Save the vacancy
    vacancyObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }
          // Try updating vacancy
          agent.put('/api/vacancies/' + vacancyObj._id)
            .send(vacancy)
            .expect(403)
            .end(function (vacancySaveErr, vacancySaveRes) {
              // Set message assertion
              (vacancySaveRes.body.message).should.match('User is not authorized');

              // Handle vacancy error error
              done(vacancySaveErr);
            });
        });
    });
  });

  it('should be able to get a list of vacancies if not signed in', function (done) {
    // Create new vacancy model instance
    var vacancyObj = new Vacancy(vacancy);

    // Save the vacancy
    vacancyObj.save(function () {
      // Request vacancies
      agent.get('/api/vacancies')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single vacancy if not signed in', function (done) {
    // Create new vacancy model instance
    var vacancyObj = new Vacancy(vacancy);

    // Save the vacancy
    vacancyObj.save(function () {
      agent.get('/api/vacancies/' + vacancyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', vacancy.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single vacancy with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/vacancies/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Vacancy is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single vacancy which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent vacancy
    agent.get('/api/vacancies/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No vacancy with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete a vacancy if signed in with the "admin" role', function (done) {
    // Set vacancy user
    vacancy.user = adminUser;

    // Create new vacancy model instance
    var vacancyObj = new Vacancy(vacancy);

    // Save the vacancy
    vacancyObj.save(function () {
      agent.post('/api/auth/signin')
        .send(adminCredentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }
          // Deleting vacancy
          agent.delete('/api/vacancies/' + vacancyObj._id)
            .expect(200)
            .end(function (vacancyDeleteErr, vacancyDeleteRes) {
              if (vacancyDeleteErr) {
                return done(vacancyDeleteErr);
              }
              done();
            });
        });
    });

  });

  it('should be able to delete a vacancy created by someone else if signed in with the "admin" role', function (done) {
    // Set vacancy user
    vacancy.user = user;

    // Create new vacancy model instance
    var vacancyObj = new Vacancy(vacancy);

    // Save the vacancy
    vacancyObj.save(function () {
      agent.post('/api/auth/signin')
        .send(adminCredentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }
          // Deleting vacancy
          agent.delete('/api/vacancies/' + vacancyObj._id)
            .expect(200)
            .end(function (vacancyDeleteErr, vacancyDeleteRes) {
              if (vacancyDeleteErr) {
                return done(vacancyDeleteErr);
              }
              done();
            });
        });
    });
  });

  it('should not be able to delete a vacancy from someone else if signed in with the "user" role', function (done) {
    // Set vacancy user
    vacancy.user = adminUser;

    // Create new vacancy model instance
    var vacancyObj = new Vacancy(vacancy);

    // Save the vacancy
    vacancyObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }
          // Try deleting vacancy
          agent.delete('/api/vacancies/' + vacancyObj._id)
            .expect(403)
            .end(function (vacancyDeleteErr, vacancyDeleteRes) {
              // Set message assertion
              (vacancyDeleteRes.body.message).should.match('User is not authorized');

              // Handle vacancy error error
              done(vacancyDeleteErr);
            });
        });
    });
  });

  it('should not be able to delete a vacancy if not signed in', function (done) {
    // Set vacancy user
    vacancy.user = user;

    // Create new vacancy model instance
    var vacancyObj = new Vacancy(vacancy);

    // Save the vacancy
    vacancyObj.save(function () {
      // Try deleting vacancy
      agent.delete('/api/vacancies/' + vacancyObj._id)
        .expect(403)
        .end(function (vacancyDeleteErr, vacancyDeleteRes) {
          // Set message assertion
          (vacancyDeleteRes.body.message).should.match('User is not authorized');

          // Handle vacancy error error
          done(vacancyDeleteErr);
        });

    });
  });

  it('should be able to get a single vacancy that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new vacancy
          agent.post('/api/vacancies')
            .send(vacancy)
            .expect(200)
            .end(function (vacancySaveErr, vacancySaveRes) {
              // Handle vacancy save error
              if (vacancySaveErr) {
                return done(vacancySaveErr);
              }

              // Set assertions on new vacancy
              (vacancySaveRes.body.title).should.equal(vacancy.title);
              should.exist(vacancySaveRes.body.user);
              should.equal(vacancySaveRes.body.user._id, orphanId);

              // force the vacancy to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
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
                        should.equal(vacancyInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single vacancy if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new vacancy model instance
    var vacancyObj = new Vacancy(vacancy);

    // Save the vacancy
    vacancyObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/vacancies/' + vacancyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', vacancy.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single vacancy, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'vacancyowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Vacancy
    var _vacancyOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _vacancyOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Vacancy
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new vacancy
          agent.post('/api/vacancies')
            .send(vacancy)
            .expect(200)
            .end(function (vacancySaveErr, vacancySaveRes) {
              // Handle vacancy save error
              if (vacancySaveErr) {
                return done(vacancySaveErr);
              }

              // Set assertions on new vacancy
              (vacancySaveRes.body.title).should.equal(vacancy.title);
              should.exist(vacancySaveRes.body.user);
              should.equal(vacancySaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (vacancyInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
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
