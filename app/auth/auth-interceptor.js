angular.module('phonebookApp').factory('AuthInterceptor',AuthInterceptor);

function AuthInterceptor($location, $q, $window, AuthFactory) {
    return {
        request: request,
        response:response,
        responseError: responseError
    };

    function request(config) {
        config.headers = config.headers || {};
        if($window.sessionStorage.token){
            config.headers['x-auth-token'] =  $window.sessionStorage.token;
            config.headers['Content-Type'] =  'application/json';
        }
        return config;
    }

    function response(response) {
        if(response.status == 200 && $window.sessionStorage.token && !AuthFactory.isLoggenIn){
            AuthFactory.isLoggenIn = true;
        }
        if(response.status === 401) {
            Auth.isLoggenIn = false;
        }
        return response || $q.when(response);
    }

    function responseError(rejection) {
        if(rejection.status === 401 || rejection.status === 403){
            delete $window.sessionStorage.token;
            AuthFactory.isLoggenIn = false;
            $location.path('/');
        }
        return $q.reject(rejection);
    }
}