'use strict';

/**
 * @ngdoc service
 * @name commentsApp.loginService
 * @description
 * # login
 * Service in the commentsApp.
 */

class loginService {
  constructor($http, $state, $window, userStore) {
    this.$http = $http
    this.$state = $state;
    this.$window = $window;
    this.userStore = userStore;
  }
  login(data) {
    return this.$http.post(baseUrl + 'users/user', data).then(response => {
      if(response.data.status){
        this.$window.localStorage.setItem("Authorization", response.data.token);
        this.userStore.user = response.data.user;
        this.$state.go('posts');
      }else{
        return response.data;
      }
    }).catch(error => {

    });
  }
}

loginService.$inject = ['$http','$state', '$window', 'userStore']
angular.module('commentsApp').service('loginService', loginService)
