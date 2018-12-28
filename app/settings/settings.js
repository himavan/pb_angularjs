angular.module('phonebookApp')
    .controller('settingsController', settingsController);

function settingsController($scope, updateFactory, $http, $mdDialog, $mdToast,appConfig) {
    $scope.item = null
    $scope.groups = [];
    $scope.newConfirm = '';
    $scope.pwdItem = {
        newPwd : '',
        oldPwd : ''
    }

    $http({
        method: 'GET',
        url: `${appConfig.apiUrl}users/me`
    }).then(function (response) {
        if (response.status === 200) {
            $scope.item = response.data;
            updateFactory.updateUser = $scope.item;
        }
    }).catch(function (error) {
        console.log(error)
    });

    $http({
        method: 'GET',
        url: `${appConfig.apiUrl}groups/`
    }).then(function (response) {
        if (response.status === 200) {
            $scope.groups = response.data;
        }
    }).catch(function (error) {
        console.log(error)
    });

    $scope.editImage = function (ev) {
        $mdDialog.show({
            controller: UserImageController,
            templateUrl: '/app/phonebook/image-view.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen,
        })
    };

    $scope.removeGroup = function(chip) {
        $http({
            method: 'DELETE',
            url: `${appConfig.apiUrl}groups/${chip}`,
        }).then(function (response) {
            if (response.status === 200) {
                $scope.groups = response.data.group
            }
        }).catch(function (error) {
            
            console.log(error)
        });
    }

    $scope.addGroup = function(chip) {
        $http({
            method: 'POST',
            url: `${appConfig.apiUrl}groups/`,
            data: {group:$scope.groups}
        }).then(function (response) {
            if (response.status === 200) {
                $scope.groups = response.data.group
            }
        }).catch(function (error) {
            
            console.log(error)
        });
    }

    $scope.updatePwd =function (pwdItem, newConfirm) {

        if (newConfirm === pwdItem.newPwd) {

            $http({
                method: 'PUT',
                url: `${appConfig.apiUrl}users/password`,
                data: $scope.pwdItem
            }).then(function (response) {
                if (response.status === 200) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Succesfully Details Updated')
                            .hideDelay(3000)
                    );
                }
            }).catch(function (error) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(error.data)
                        .hideDelay(3000)
                );
                console.log(error)
            });
            
        } else {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('New Password and Confirm Password not matching')
                    .hideDelay(3000)
            );
        }
    }

    $scope.update = function () {

        $http({
            method: 'PUT',
            url: `${appConfig.apiUrl}users/`,
            data: $scope.item
        }).then(function (response) {
            if (response.status === 200) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Succesfully Details Updated')
                        .hideDelay(3000)
                );
            }
        }).catch(function (error) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(error.data)
                    .hideDelay(3000)
            );
            console.log(error)
        });
    }
}

function UserImageController($scope, $mdDialog, updateFactory) {
    $scope.Image = '';
    $scope.CroppedImage = '';
    $scope.handleFileSelect = function (evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.Image = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    }

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.add = function () {
        updateFactory.updateUser.image = $scope.CroppedImage;
        $mdDialog.hide();
    }
}
