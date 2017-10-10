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
          mainstate = $state.get('admin.vacancies');
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
          liststate = $state.get('admin.vacancies.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/vacancies/client/views/admin/list-vacancies.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          VacanciesAdminController,
          mockVacancy;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.vacancies.create');
          $templateCache.put('/modules/vacancies/client/views/admin/form-vacancy.client.view.html', '');

          // Create mock vacancy
          mockVacancy = new VacanciesService();

          // Initialize Controller
          VacanciesAdminController = $controller('VacanciesAdminController as vm', {
            $scope: $scope,
            vacancyResolve: mockVacancy
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.vacancyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/vacancies/create');
        }));

        it('should attach an vacancy to the controller scope', function () {
          expect($scope.vm.vacancy._id).toBe(mockVacancy._id);
          expect($scope.vm.vacancy._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/vacancies/client/views/admin/form-vacancy.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          VacanciesAdminController,
          mockVacancy;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.vacancies.edit');
          $templateCache.put('/modules/vacancies/client/views/admin/form-vacancy.client.view.html', '');

          // Create mock vacancy
          mockVacancy = new VacanciesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Vacancy about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          VacanciesAdminController = $controller('VacanciesAdminController as vm', {
            $scope: $scope,
            vacancyResolve: mockVacancy
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:vacancyId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.vacancyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            vacancyId: 1
          })).toEqual('/admin/vacancies/1/edit');
        }));

        it('should attach an vacancy to the controller scope', function () {
          expect($scope.vm.vacancy._id).toBe(mockVacancy._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/vacancies/client/views/admin/form-vacancy.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
