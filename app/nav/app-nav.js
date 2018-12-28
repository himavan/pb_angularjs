angular.module('phonebookApp').directive('appNav',nav)
.controller('AppCtrl', AppCtrl).factory('updateFactory', updateFactory);

function updateFactory() {
    var updateContact = null;
    var updateUser = {name:'',image:''};
    var newUser = null
    var groups = null;


    return { 
        updateContact: updateContact, 
        groups: groups, 
        updateUser: updateUser, 
        newUser: newUser 
    };
};



function nav() {
    return {
        restrict: 'E',
        templateUrl:'/app/nav/app-nav.html',
        controller:'AppCtrl'
    };
}


function AppCtrl($scope, $timeout, $mdSidenav,AuthFactory,$location,$window,updateFactory) {
    
    $scope.title = "Phone Book App"
    $scope.name = 'User'
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.close = buildDelayedToggler('left');

    $scope.isLoggedIn = function() {
        if($window.sessionStorage.token){
            $scope.name = updateFactory.updateUser.name;
            $scope.image = updateFactory.updateUser.image;
            
            return true
        }
        else{
            return false;
        }
    };
    
    $scope.isVisible = function() {
        if ( $location.path().split("/")[1] =='phonebook') {
            return true;
        } else {
            return false;
        }
    }

    $scope.back = function() {
        history.back();
    };

    $scope.logout = function() {
        AuthFactory.isLoggedIn = false;
        delete $window.sessionStorage.token;
        $location.path('/');
    }

    // $scope.isActiveTab = function (url) {
    //     var currentpath = $location.path().split('/')[1];
    //     return(url === currentPath ? 'active' : '');
    // }

    function debounce(func, wait, context) {
        var timer;

        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function () {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }

    function buildDelayedToggler(navID) {
        return debounce(function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navID).toggle();
        }, 20);
    }
}
