(function () {
  'use strict';

  angular
    .module('vacancies.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.vacancies', {
        abstract: true,
        url: '/vacancies',
        template: '<ui-view/>'
      })
      .state('admin.vacancies.list', {
        url: '',
        templateUrl: '/modules/vacancies/client/views/admin/list-vacancies.client.view.html',
        controller: 'VacanciesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.vacancies.create', {
        url: '/create',
        templateUrl: '/modules/vacancies/client/views/admin/form-vacancy.client.view.html',
        controller: 'VacanciesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          vacancyResolve: newVacancy
        }
      })
      .state('admin.vacancies.edit', {
        url: '/:vacancyId/edit',
        templateUrl: '/modules/vacancies/client/views/admin/form-vacancy.client.view.html',
        controller: 'VacanciesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ vacancyResolve.title }}'
        },
        resolve: {
          vacancyResolve: getVacancy
        }
      });
  }

  getVacancy.$inject = ['$stateParams', 'VacanciesService'];

  function getVacancy($stateParams, VacanciesService) {
    return VacanciesService.get({
      vacancyId: $stateParams.vacancyId
    }).$promise;
  }

  newVacancy.$inject = ['VacanciesService'];

  function newVacancy(VacanciesService) {
    return new VacanciesService();
  }
}());
