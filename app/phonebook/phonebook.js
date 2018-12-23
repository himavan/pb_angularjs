angular.module('phonebookApp')
    .factory('updateFactory', updateFactory)
    .controller('PBController', PBController);

function PBController($scope, $http, $mdToast, updateFactory, $location, $rootScope) {
    $http({
        method: 'GET',
        url: 'http://127.0.0.1:3000/api/groups/',

    }).then(function (response) {
        if (response.status === 200) {
            $scope.groups = response.data;
            updateFactory.groups = $scope.groups;
        }
    }).catch(function (error) {
        console.log(error)
    });

    $rootScope.groups = $scope.groups;

    // $scope.groups =  $rootScope.groups;
    $scope.selectedIndex = 0;

    $http({
        method: 'GET',
        url: 'http://127.0.0.1:3000/api/contacts/',

    }).then(function (response) {
        if (response.status === 200) {
            $scope.contacts = response.data;
            if ($scope.contacts.length == 0) {
                $scope.panelMsg = "No contacts to display"
            }
            // if($scope.contacts.length ==  0 ){
            //     $scope.panelFavMsg = "No favourite contacts to display"
            // }
        }
    }).catch(function (error) {
        console.log(error)
    });


    var originatorEv;

    $scope.openMenu = function ($mdMenu, ev) {
        originatorEv = ev;
        $mdMenu.open(ev);
    };


    // $scope.favourite = true;
    $scope.toggleFavourite = function (item) {

        $http({
            method: 'PUT',
            url: `http://127.0.0.1:3000/api/contacts/${item._id}/fav/`,

        }).then(function (response) {
            if (response.status === 200) {

                if (item.isFavourite) {
                    $scope.contacts.find(x => x._id === item._id).isFavourite = false;
                }
                else {
                    $scope.contacts.find(x => x._id === item._id).isFavourite = true;
                }
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(`${item.name} ${item.isFavourite ? 'Add to' : 'Removed from'} favourites`)
                        .hideDelay(3000)
                );
            }
        }).catch(function (error) {
            console.log(error)
        });
    };

    $scope.edit = function ($event, _item) {
        updateFactory.updateContact = _item;
        $location.path('/update');
    };

    $scope.view = function (_item) {
        updateFactory.updateContact = _item;
        $location.path('/view');
    };

    $scope.new = function () {
        $location.path('/new');
    };
}

function updateFactory() {
    var updateContact = null;
    var updateUser = null;
    var newUser = null
    var groups = null;


    return { 
        updateContact: updateContact, 
        groups: groups, 
        updateUser: updateUser, 
        newUser: newUser 
    };
};


