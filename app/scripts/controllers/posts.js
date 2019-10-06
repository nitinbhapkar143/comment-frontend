'use strict';

/**
 * @ngdoc function
 * @name commentsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the commentsApp
 */
angular.module('commentsApp')
  .controller('postsCtrl', function ($scope, postService, userStore, posts, $state) {
    $scope.user = userStore.user;
    $scope.posts = posts;

    $scope.logout = () => {
      userStore.logout();
    }

    $scope.addPost = () => {
      $scope.errorMessage = false;
      postService.addPost($scope.post).then(post => {
        if (post.status) {
          $scope.posts.reverse();
          $scope.posts.push(post.post);
          $scope.posts.reverse();
          $scope.post = {}
        } else {
          $scope.errorMessage = post.message;
        }
      })
    }

    $scope.editPost = index => {
      $scope.posts.map(post => {
        post.isEditing = false;
      })

      $scope.posts[index].isEditing = true;
      $scope.posts[index].editText = $scope.posts[index].text;
    }

    $scope.submitEdit = index => {
      $scope.errorMessage = false;
      const data = Object.assign({}, $scope.posts[index]);
      data.text = data.editText;
      postService.editPost(data).then(post => {
        $scope.posts[index].isEditing = false;
        $scope.posts[index].text = $scope.posts[index].editText;
        $scope.errorMessage = post.message;
      })
    }

    $scope.viewPost = index => {
      $state.go("post", {
        post_id: $scope.posts[index].id
      })
    }
  });
