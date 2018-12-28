angular.module('phonebookApp', ['ngMaterial', 'ngMessages', 'ngRoute','angular-jwt','ngImgCrop'])
    .config(configRoute)
    .config(themeConfig)
    .constant('appConfig', {
        appName: 'Phonebook App',
        appVersion: 2.0,
        apiUrl: 'https://pb-angularjs.herokuapp.com/api/'
    })
    .run(run) ;

function themeConfig($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple')
        .accentPalette('orange');
}

function configRoute($httpProvider, $routeProvider,) {

    $httpProvider.interceptors.push('AuthInterceptor');

    $routeProvider.when('/',{
        templateUrl:'/app/home.html',
        controller:'HomeCtrl',
        access:{
            restricted:false
        }
        
    })
    .when('/phonebook',{
        templateUrl:'/app/phonebook/phonebook.html',
        controller:'PBController',
        access:{
            restricted:true
        }
    })
    .when('/profile',{
        templateUrl:'/app/settings/settings.html',
        controller:'settingsController',
        access:{
            restricted:true
        }
    })
    .when('/support',{
        templateUrl:'/app/support.html',
        controller:'',
        access:{
            restricted:true
        }
    })
    .when('/update',{
        templateUrl:'/app/phonebook/contact-update.html',
        controller:'updateController',
        access:{
            restricted:true
        }
    })
    .when('/view',{
        templateUrl:'/app/phonebook/contact-view.html',
        controller:'viewController',
        access:{
            restricted:true
        }
    })
    .when('/new',{
        templateUrl:'/app/phonebook/contact-new.html',
        controller:'newController',
        access:{
            restricted:true
        }
    })
    .otherwise({
        redirectTo:'/'
    });
}

function run($rootScope, $location, $window, AuthFactory) {
    $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
    
        if (nextRoute.access !== undefined && nextRoute.access.restricted && !$window.sessionStorage.token && !AuthFactory.isLoggedIn) {
            event.preventDefault();
            $location.path('/');
        }
        else{
            // $location.path('/phonebook');
        }
    })
}