(function () {
  'use strict';

  angular
    .module('vacancies.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('vacancies', {
        abstract: true,
        url: '/vacancies',
        template: '<ui-view/>'
      })
      .state('vacancies.list', {
        url: '',
        templateUrl: '/modules/vacancies/client/views/list-vacancies.client.view.html',
        controller: 'VacanciesListController',
        controllerAs: 'vm'
      })
      .state('vacancies.create', {
        url: '/create',
        templateUrl: '/modules/vacancies/client/views/admin/form-vacancy.client.view.html',
        controller: 'VacanciesController',
        controllerAs: 'vm',
        data: {
          roles: ['user']
        },
        resolve: {
          vacancyResolve: newVacancy
        }
      })
      .state('vacancies.edit', {
        url: '/:vacancyId/edit',
        templateUrl: '/modules/vacancies/client/views/admin/form-vacancy.client.view.html',
        controller: 'VacanciesController',
        controllerAs: 'vm',
        data: {
          roles: ['user'],
          pageTitle: '{{ vacancyResolve.title }}'
        },
        resolve: {
          vacancyResolve: getVacancy
        }
      })
      .state('vacancies.view', {
        url: '/:vacancyId',
        templateUrl: '/modules/vacancies/client/views/view-vacancy.client.view.html',
        controller: 'VacanciesController',
        controllerAs: 'vm',
        resolve: {
          vacancyResolve: getVacancy
        },
        data: {
          pageTitle: '{{ vacancyResolve.title }}'
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
