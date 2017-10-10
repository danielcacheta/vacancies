'use strict';

describe('Vacancies E2E Tests:', function () {
  describe('Test vacancies page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/vacancies');
      expect(element.all(by.repeater('vacancy in vacancies')).count()).toEqual(0);
    });
  });
});
