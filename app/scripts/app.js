'use strict';

/**
 * @ngdoc overview
 * @name commentsApp
 * @description
 * # commentsApp
 *
 * Main module of the application.
 */
const baseUrl = `http://localhost:4000/`
angular
  .module('commentsApp', [
    'ui.router'
  ])
  .config(function ($httpProvider, $stateProvider, $urlRouterProvider) {
    $httpProvider.interceptors.push('interceptor');

    const login = {
      title: 'Login',
      name: 'login',
      url: '/login',
      controller: 'loginCtrl',
      data: {
        authorisation: false
      },
      templateUrl: 'views/login.html'
    };

    const posts = {
      title: 'Posts',
      name: 'posts',
      url: '/posts',
      controller: 'postsCtrl',
      data: {
        authorisation: true
      },
      templateUrl: 'views/posts.html',
      resolve: {
        getUserInfo: ['userStore', userStore => {
          return userStore.getUserInfo().then(response => {
            return response;
          })
        }],
        posts: ['postService', postService => {
          return postService.getPosts().then(response => {
            return response;
          })
        }],
      }
    };

    const post = {
      title: 'Post',
      name: 'post',
      url: '/post/:post_id',
      controller: 'postCtrl',
      data: {
        authorisation: true
      },
      templateUrl: 'views/post.html',
      resolve: {
        getUserInfo: ['userStore', userStore => {
          return userStore.getUserInfo().then(response => {
            return response;
          })
        }],
        post: ['postService', '$stateParams', '$state', (postService, $stateParams, $state) => {
          const post_id = $stateParams.post_id;
          if (!post_id) return $state.go("posts")
          return postService.getPost(post_id).then(response => {
            if(!response.length) return $state.go("posts")
            return response;
          })
        }],
        comments: ['commentsService', '$stateParams', '$state', (commentsService, $stateParams, $state) => {
          const post_id = $stateParams.post_id;
          if (!post_id) return $state.go("posts")
          return commentsService.getComments(post_id).then(response => {
            return response;
          })
        }],
      }
    };

    $stateProvider.state(login);
    $stateProvider.state(post);
    $stateProvider.state(posts);
    $urlRouterProvider.otherwise('/posts');
  }).run(['$rootScope', 'authenticationService', '$state', '$window', '$timeout', 'userStore',
    function ($rootScope, authenticationService, $state, $window, $timeout, userStore) {

      $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
        if (!toState.data || !toState.data.authorisation) {
          userStore.clear();
          $window.localStorage.removeItem("Authorization")
        } else if (toState.data && !authenticationService.isAuthorised(toState.data)) {
          $window.localStorage.removeItem("Authorization");
          userStore.clear();
          $timeout(function () {
            $state.go('login');
          });
        }
      });
    }
  ]).filter('getTitleCase', function () {
    return function (str) {
      if (str) {
        let temp = []
        str = str.replace(/_/g, ' ')
        str = str.replace(/-/g, ' ')
        if (str.includes(" ")) {
          temp = str.split(" ")
        } else {
          temp[0] = str
        }
        let final_str = ''
        temp.map((substr, key) => {
          substr = substr.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          });
          final_str += substr + " "
        })
        return final_str.trim()
      }
    }
  })
