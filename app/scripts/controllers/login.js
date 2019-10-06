'use strict';

/**
 * @ngdoc function
 * @name commentsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the commentsApp
 */
angular.module('commentsApp')
  .controller('loginCtrl', function ($scope, loginService) {
    $scope.login = () => {
      $scope.errorMessage = false;
      loginService.login($scope.user).then(response => {
        $scope.errorMessage = response.message;
      })
    }
  });
