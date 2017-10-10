(function () {
  'use strict';

  describe('Vacancies Route Tests', function () {
    // Initialize global variables
    var $scope,
      VacanciesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _VacanciesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      VacanciesService = _VacanciesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('vacancies');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/vacancies');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('vacancies.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/vacancies/client/views/list-vacancies.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          VacanciesController,
          mockVacancy;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('vacancies.view');
          $templateCache.put('/modules/vacancies/client/views/view-vacancy.client.view.html', '');

          // create mock vacancy
          mockVacancy = new VacanciesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'A Vacancy',
            content: 'Vacancy Content'
          });

          // Initialize Controller
          VacanciesController = $controller('VacanciesController as vm', {
            $scope: $scope,
            vacancyResolve: mockVacancy
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:vacancyId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.vacancyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            vacancyId: 1
          })).toEqual('/vacancies/1');
        }));

        it('should attach an vacancy to the controller scope', function () {
          expect($scope.vm.vacancy._id).toBe(mockVacancy._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/vacancies/client/views/view-vacancy.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/vacancies/client/views/list-vacancies.client.view.html', '');

          $state.go('vacancies.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('vacancies/');
          $rootScope.$digest();

          expect($location.path()).toBe('/vacancies');
          expect($state.current.templateUrl).toBe('/modules/vacancies/client/views/list-vacancies.client.view.html');
        }));
      });
    });
  });
}());
