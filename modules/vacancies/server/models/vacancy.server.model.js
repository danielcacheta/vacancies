'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Vacancy Schema
 */
var VacancySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'O título da vaga é obrigatório'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  fulfilled: {
    type: Boolean,
    default: false
  },
  frequency: {
    type: String, enum: ['Segunda à sexta', 'Segunda à sábado', '3x por semana', '2x por semana', '1x por semana', 'Quinzenal', '1x por mês', 'Uma única vez'],
    required: 'A frequência de contratação é obrigatória'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

VacancySchema.statics.seed = seed;

mongoose.model('Vacancy', VacancySchema);

/**
* Seeds the User collection with document (Vacancy)
* and provided options.
*/
function seed(doc, options) {
  var Vacancy = mongoose.model('Vacancy');

  return new Promise(function (resolve, reject) {

    skipDocument()
      .then(findAdminUser)
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function findAdminUser(skip) {
      var User = mongoose.model('User');

      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve(true);
        }

        User
          .findOne({
            roles: { $in: ['admin'] }
          })
          .exec(function (err, admin) {
            if (err) {
              return reject(err);
            }

            doc.user = admin;

            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        Vacancy
          .findOne({
            title: doc.title
          })
          .exec(function (err, existing) {
            if (err) {
              return reject(err);
            }

            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }

            // Remove Vacancy (overwrite)

            existing.remove(function (err) {
              if (err) {
                return reject(err);
              }

              return resolve(false);
            });
          });
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: Vacancy\t' + doc.title + ' skipped')
          });
        }

        var vacancy = new Vacancy(doc);

        vacancy.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Vacancy\t' + vacancy.title + ' added'
          });
        });
      });
    }
  });
}
