(function () {
  'use strict';

  angular
    .module('vacancies.services')
    .factory('VacanciesService', VacanciesService);

  VacanciesService.$inject = ['$resource', '$log'];

  function VacanciesService($resource, $log) {
    var Vacancy = $resource('/api/vacancies/:vacancyId', {
      vacancyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Vacancy.prototype, {
      createOrUpdate: function () {
        var vacancy = this;
        return createOrUpdate(vacancy);
      }
    });

    return Vacancy;

    function createOrUpdate(vacancy) {
      if (vacancy._id) {
        return vacancy.$update(onSuccess, onError);
      } else {
        return vacancy.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(vacancy) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
