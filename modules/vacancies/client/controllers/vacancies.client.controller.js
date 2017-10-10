(function () {
  'use strict';

  angular
    .module('vacancies')
    .controller('VacanciesController', VacanciesController);

  VacanciesController.$inject = ['$scope', 'vacancyResolve', 'Authentication'];

  function VacanciesController($scope, vacancy, Authentication) {
    var vm = this;

    vm.vacancy = vacancy;
    vm.authentication = Authentication;

  }
}());
