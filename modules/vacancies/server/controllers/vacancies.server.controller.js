'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Vacancy = mongoose.model('Vacancy'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a vacancy
 */
exports.create = function (req, res) {
  var vacancy = new Vacancy(req.body);
  vacancy.user = req.user;

  vacancy.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(vacancy);
    }
  });
};

/**
 * Show the current vacancy
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var vacancy = req.vacancy ? req.vacancy.toJSON() : {};

  // Add a custom field to the Vacancy, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Vacancy model.
  vacancy.isCurrentUserOwner = !!(req.user && vacancy.user && vacancy.user._id.toString() === req.user._id.toString());

  res.json(vacancy);
};

/**
 * Update a vacancy
 */
exports.update = function (req, res) {
  var vacancy = req.vacancy;

  var isAdmUser = req.user.roles.indexOf('admin') > -1;
  if ((req.user.id !== req.vacancy.user.id) && !isAdmUser)
    return res.status(403).send({
      message: 'User is not authorized'
    });

  vacancy.title = req.body.title;
  vacancy.content = req.body.content;
  vacancy.fulfilled = req.body.fulfilled;
  vacancy.frequency = req.body.frequency;

  vacancy.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(vacancy);
    }
  });
};

/**
 * Delete a vacancy
 */
exports.delete = function (req, res) {
  var vacancy = req.vacancy;

  var isAdmUser = req.user.roles.indexOf('admin') > -1;
  if ((req.user.id !== req.vacancy.user.id) && !isAdmUser)
    return res.status(403).send({
      message: 'User is not authorized'
    });

  vacancy.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(vacancy);
    }
  });
};

/**
 * List of Vacancies
 */
exports.list = function (req, res) {
  let isLogged = req.user;
  let isAdmin = false;
  if (isLogged)
    isAdmin = req.user.roles.indexOf('admin') !== -1;

  let restrictions = {};
  if (!isAdmin && !isLogged)
    restrictions = { fulfilled: false };
  else
    if (!isAdmin)
      restrictions = {
        $or: [
          { fulfilled: false },
          { user: req.user }
        ]
      };
  Vacancy.find(restrictions).sort('-created').populate('user', 'displayName').exec(function (err, vacancies) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(vacancies);
    }
  });
};

/**
 * Vacancy middleware
 */
exports.vacancyByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Vacancy is invalid'
    });
  }

  Vacancy.findById(id).populate('user', 'displayName').exec(function (err, vacancy) {
    if (err) {
      return next(err);
    } else if (!vacancy) {
      return res.status(404).send({
        message: 'No vacancy with that identifier has been found'
      });
    }
    req.vacancy = vacancy;
    next();
  });
};
