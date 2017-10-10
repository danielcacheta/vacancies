(function () {
  'use strict';

  angular
    .module('vacancies')
    .controller('VacanciesListController', VacanciesListController);

  VacanciesListController.$inject = ['VacanciesService'];

  function VacanciesListController(VacanciesService) {
    var vm = this;

    vm.vacancies = VacanciesService.query();
  }
}());
