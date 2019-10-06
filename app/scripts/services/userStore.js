'use strict';

/**
 * @ngdoc service
 * @name commentsApp.userStore
 * @description
 * # post
 * Service in the commentsApp.
 */

class userStore {
  constructor($http, $q, $window, $timeout, $state) {
    this.user = {}
    this.$http = $http;
    this.$q = $q;
    this.$window = $window;
    this.$timeout = $timeout;
    this.$state = $state;
  }
  clear() {
    this.user = {}
  }
  getUserInfo() {
    let deferred = this.$q.defer();
    if (!this.user.username) {
      this.$http.get(`${baseUrl}users/user`).then(response => {
        if (response.data.status) {
          this.user = response.data.user;
          deferred.resolve(this.userStore.user);
        } else {
          deferred.resolve(false);
        }
      }).catch(err => {
        deferred.resolve(false);
      })
    } else {
      deferred.resolve(this.user);
    }
    return deferred.promise;
  }
  logout() {
    this.clear()
    this.$window.localStorage.removeItem("Authorization");
    this.$timeout(() => {
        this.$state.go('login');
    });
  }
}

userStore.$inject = ['$http', '$q', '$window', '$timeout', '$state']
angular.module('commentsApp').service('userStore', userStore)
