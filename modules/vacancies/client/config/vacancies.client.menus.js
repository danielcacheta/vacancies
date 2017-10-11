(function () {
  'use strict';

  angular
    .module('vacancies')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Vagas',
      state: 'vacancies',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'vacancies', {
      title: 'Listar Vagas',
      state: 'vacancies.list',
      roles: ['*']
    });

    menuService.addSubMenuItem('topbar', 'vacancies', {
      title: 'Cadastrar Vaga',
      state: 'vacancies.create',
      roles: ['user', 'admin']
    });
  }
}());
