(function () {
  'use strict';

  angular
    .module('vacancies')
    .controller('VacanciesController', VacanciesController);

  VacanciesController.$inject = ['$scope', '$state', '$window', 'vacancyResolve', 'Authentication', 'Notification'];

  function VacanciesController($scope, $state, $window, vacancy, Authentication, Notification) {
    var vm = this;

    vm.vacancy = vacancy;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Vacancy
    function remove() {
      if ($window.confirm('Deseja realmente excluir esta vaga?')) {
        vm.vacancy.$remove(function () {
          $state.go('vacancies.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Vaga excluída com sucesso!' });
        });
      }
    }

    // Save Vacancy
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.vacancyForm');
        return false;
      }

      // Create a new vacancy, or update the current instance
      vm.vacancy.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('vacancies.list');
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Vacancy saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Vacancy save error!' });
      }
    }
  }
}());
