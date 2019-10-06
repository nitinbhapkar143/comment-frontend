'use strict';

/**
 * @ngdoc service
 * @name commentsApp.post
 * @description
 * # post
 * Service in the commentsApp.
 */

class postService {
  constructor($http) {
    this.$http = $http;
  }
  addPost(data) {
    return this.$http.post(baseUrl + 'posts/post', data).then(response => {
        return response.data;
    })
  }
  getPosts() {
    return this.$http.get(baseUrl + 'posts/post').then(response => {
      if (response.data.status) {
        return response.data.posts;
      } else {
        return [];
      }
    })
  }
  getPost(post_id) {
    return this.$http.get(baseUrl + 'posts/post?post_id='+post_id).then(response => {
      if (response.data.status) {
        return response.data.posts;
      } else {
        return [];
      }
    })
  }
  editPost(data) {
    return this.$http.put(baseUrl + 'posts/post', data).then(response => {
        return response.data;
    })
  }
}


postService.$inject = ['$http']
angular.module('commentsApp').service('postService', postService)
