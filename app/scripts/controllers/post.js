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
      if(!$scope.comment || !$scope.comment.text) {
        $scope.errorMessage = "Please enter text."
        return
      }
      $scope.errorMessage = false;
      const data = {
        text: $scope.comment.text,
        post_id: $scope.post.id,
      }
      commentsService.addComment(data).then(comment => {
        if (comment.status) {
          $scope.comments.unshift(comment.comment);
          $scope.comment = {}
        } else {
          $scope.errorMessage = comment.message;
        }
      })
    }

    $scope.submitEdit = index => {
      if ($scope.type == "edit") {
        if(!$scope.comments[index] || !$scope.comments[index].editText) {
          $scope.comments[index].errorMessage = "Please enter text.";
          return
        }
        const data = Object.assign({}, $scope.comments[index]);
        data.text = data.editText;
        commentsService.editComment(data);
        $scope.comments[index].isEditing = false;
        $scope.comments[index].text = $scope.comments[index].editText;
      } else {
        if(!$scope.comments[index] || !$scope.comments[index].editText) {
          $scope.comments[index].errorMessage = "Please enter text.";
          return
        }
        $scope.comments[index].errorMessage = false;
        const data = Object.assign({}, $scope.comments[index]);
        data.text = data.editText;
        data.parent_id = data.id;
        commentsService.addComment(data).then(comment => {
          if (comment.status) {
            let i = index;
            if($scope.comments[index].parent_id != null){
              while(i < $scope.comments.length && $scope.comments[i].parent_id != null && $scope.comments[index].parent_id <= $scope.comments[i].parent_id){
                i++;
              }
            }else{
              i++;
              while(i < $scope.comments.length && $scope.comments[i].parent_id != null ){
                i++;
              }
            }
            if(i >= $scope.comments.length) i = $scope.comments.length - 1;
            else if($scope.comments[i].parent_id == null || $scope.comments[index].parent_id > $scope.comments[i].parent_id) i--;
            $scope.comments.splice(i + 1, 0, comment.comment);
            $scope.comments[index].isEditing = false;
          } else {
            $scope.comments[index].errorMessage = comment.message;
          }
        })
      }
    }

  });
