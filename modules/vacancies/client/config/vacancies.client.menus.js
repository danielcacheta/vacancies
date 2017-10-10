(function () {
  'use strict';

  angular
    .module('vacancies')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Vacancies',
      state: 'vacancies',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'vacancies', {
      title: 'List Vacancies',
      state: 'vacancies.list',
      roles: ['*']
    });
  }
}());
