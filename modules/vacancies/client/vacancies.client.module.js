(function (app) {
  'use strict';

  app.registerModule('vacancies', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('vacancies.admin', ['core.admin']);
  app.registerModule('vacancies.admin.routes', ['core.admin.routes']);
  app.registerModule('vacancies.services');
  app.registerModule('vacancies.routes', ['ui.router', 'core.routes', 'vacancies.services']);
}(ApplicationConfiguration));
