angular.module('phonebookApp').controller('HomeCtrl', HomeCtrl);

function HomeCtrl($scope, $http, $location, $window, AuthFactory, jwtHelper) {

    if ($window.sessionStorage.token) {
        $location.path('/phonebook');  
    }

    $scope.user = {
        email: '',
        password: ''
      };

    $scope.usernew = {
        name:'',
        email: '',
        password: ''
    };

    $scope.msg = '';

    $scope.changePanel = function () {
        $scope.msg = '';
        $scope.msgColor = '';
    }

    $scope.login = function(){
        if ($scope.user.email && $scope.user.password) {
            var user = {
               email: $scope.user.email,
               password: $scope.user.password
            };

            $http.post('http://127.0.0.1:3000/api/auth',JSON.stringify(user)).then(function (response) {
               
                $scope.msg='';
                if (response.status === 200) {
                    $window.sessionStorage.token = response.data;
                    AuthFactory.isLoggedIn = true;
                    $location.path('/phonebook');
                }
                else{
                  
                }
            }).catch(function(error){
                if (error.data===null) {
                    $scope.msg = 'Server not reachable'
                    $scope.msgColor = 'red';
                }
                else{
                    $scope.msg = error.data;
                    $scope.msgColor = 'red';
                }
            })
        }
    }

    $scope.logup = function(){
        if ($scope.usernew.name && $scope.usernew.email && $scope.usernew.password) {
            var user = {
                name: $scope.usernew.name,
                email: $scope.usernew.email,
                password: $scope.usernew.password
            };

            $http.post('http://127.0.0.1:3000/api/users/',JSON.stringify(user)).then(function (response) {
               
                $scope.msg='';
                if (response.status === 200) {
                    $scope.msg = "Registered Successfully";
                    $scope.msgColor = 'green';
                }
                else{
                    console.log( response.data);
                }
            }).catch(function(error){
                console.log(error);
                $scope.msg = error.data;
                $scope.msgColor = 'red';
            })
        }
    }

    
}