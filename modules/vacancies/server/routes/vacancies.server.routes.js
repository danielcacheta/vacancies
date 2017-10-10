'use strict';

/**
 * Module dependencies
 */
var vacanciesPolicy = require('../policies/vacancies.server.policy'),
  vacancies = require('../controllers/vacancies.server.controller');

module.exports = function (app) {
  // Vacancies collection routes
  app.route('/api/vacancies').all(vacanciesPolicy.isAllowed)
    .get(vacancies.list)
    .post(vacancies.create);

  // Single vacancy routes
  app.route('/api/vacancies/:vacancyId').all(vacanciesPolicy.isAllowed)
    .get(vacancies.read)
    .put(vacancies.update)
    .delete(vacancies.delete);

  // Finish by binding the vacancy middleware
  app.param('vacancyId', vacancies.vacancyByID);
};
