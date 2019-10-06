'use strict';

/**
 * @ngdoc service
 * @name commentsApp.commentsService
 * @description
 * # comments
 * Service in the commentsApp.
 */
  class commentsService {
    constructor($http) {
      this.$http = $http
    }

    addComment(data) {
      return this.$http.post(baseUrl + 'comments/comment', data).then(response => {
          return response.data;
      })
    }

    getComments(post_id) {
      return this.$http.get(baseUrl + 'comments/comment?post_id=' + post_id).then(response => {
        if (response.data.status) {
          return response.data.comments;
        } else {
          return [];
        }
      })
    }

    editComment(data) {
      return this.$http.put(baseUrl + 'comments/comment', data).then(response => {
          return response.data;
      })
    }
  }
  
  commentsService.$inject = ['$http']
  angular.module('commentsApp').service('commentsService', commentsService)
