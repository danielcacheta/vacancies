(function () {
  'use strict';

  // Configuring the Vacancies Admin module
  angular
    .module('vacancies.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Vacancies',
      state: 'admin.vacancies.list'
    });
  }
}());
