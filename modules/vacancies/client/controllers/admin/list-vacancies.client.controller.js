(function () {
  'use strict';

  angular
    .module('vacancies.admin')
    .controller('VacanciesAdminListController', VacanciesAdminListController);

  VacanciesAdminListController.$inject = ['VacanciesService'];

  function VacanciesAdminListController(VacanciesService) {
    var vm = this;

    vm.vacancies = VacanciesService.query();
  }
}());
