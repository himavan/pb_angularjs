angular.module('phonebookApp').factory('AuthFactory', AuthFactory);

function AuthFactory($window, jwtHelper) {
    var auth = {
        isLoggedIn:false,
        name:'',
        email:'',
        _id:''
    };

    // if($window.sessionStorage.token){
    //     auth.isLoggedIn = true;
    //     var decodedToken = jwtHelper.decodeToken( $window.sessionStorage.token)
    //     auth.name = decodedToken.name;
    //     auth.email = decodedToken.email;
    //     auth._id = decodedToken._id
    // }
    
    return {
        auth:auth
    };

}