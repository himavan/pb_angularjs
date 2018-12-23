angular.module('phonebookApp')
.controller('viewController', viewController);


function viewController($scope,updateFactory,$location) {
    if (updateFactory.updateContact !== null) {
      $scope.item = updateFactory.updateContact;
    } else {
      $location.path('/phonebook')
    }

    $scope.selectedItems = $scope.item.group;

    $scope.edit = function (_item) {
        updateFactory.updateContact = _item;
        $location.path('/update');
    };
    
}