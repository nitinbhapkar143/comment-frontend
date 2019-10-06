angular.module('commentsApp')
  .factory('interceptor', ['$q', '$window', function ($q, $window) {
    return {
      request: config => {
        config.headers = config.headers || {};
        let token = $window.localStorage.getItem('Authorization')
        config.headers.Authorization = token
        return config || $q.when(config);
      },
      responseError: response => {
        return response || $q.when(response);
      }
    };
  }])
