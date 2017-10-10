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
}());
