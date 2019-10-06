'use strict';

/**
 * @ngdoc function
 * @name commentsApp.controller:postCtrl
 * @description
 * # postCtrl
 * Controller of the commentsApp
 */
angular.module('commentsApp')
  .controller('postCtrl', function ($scope, commentsService, userStore, post, comments) {
    $scope.user = userStore.user;
    $scope.post = post[0];
    $scope.comments = comments;

    $scope.logout = () => {
        userStore.logout();
    }

    $scope.editComment = (index, type) => {
      $scope.type = type;
      $scope.comments.map(comment => {
        comment.isEditing = false;
      })
      $scope.comments[index].isEditing = true;
      if ($scope.type == "edit")
        $scope.comments[index].editText = $scope.comments[index].text;
      else
        $scope.comments[index].editText = ''
    }

    $scope.getStyle = index => {
      const multiplier = $scope.comments[index].slug.split('/').length
      return {
        "margin-left": (20 * multiplier) + "px"
      }
    }

    $scope.addComment = () => {
      const data = {
        text: $scope.comment.text,
        post_id: $scope.post.id,
      }
      commentsService.addComment(data).then(comment => {
        if (comment.status) {
          $scope.comments.push(comment.comment);
          $scope.comment = {}
        } else {
          $scope.errorMessage = comment.message;
        }
      })
    }

    $scope.submitEdit = index => {
      if ($scope.type == "edit") {
        const data = Object.assign({}, $scope.comments[index]);
        data.text = data.editText;
        commentsService.editComment(data);
        $scope.comments[index].isEditing = false;
        $scope.comments[index].text = $scope.comments[index].editText;
      } else {
        const data = Object.assign({}, $scope.comments[index]);
        data.text = data.editText;
        data.parent_id = data.id;
        commentsService.addComment(data).then(comment => {
          if (comment.status) {
            $scope.comments.splice(index + 1, 0, comment.comment);
          } else {
            $scope.errorMessage = comment.message;
          }
        })
        $scope.comments[index].isEditing = false;
      }
    }

  });
