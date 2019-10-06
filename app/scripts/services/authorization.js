class authenticationService{
	constructor($window){
        this.$window = $window;
    }
    isAuthorised(data){
        if(!data || !data.authorisation) return true;
        let token = this.$window.localStorage.getItem('Authorization');
        if(!token) return false
        return true
    }
}

authenticationService.$inject = ['$window']
angular.module('commentsApp').service('authenticationService', authenticationService)