angular.module('phonebookApp')
  .controller('updateController', updateController)
  .controller('ImageController',ImageController);


function updateController($scope, updateFactory, $q, filterFilter, $location, $mdDialog, $http,$mdToast,appConfig) {

  $scope.typeOptions = ["home", "work", "mobile", "other"];

  if (updateFactory.updateContact !== null) {
    $scope.item = updateFactory.updateContact;
  } else {
    $location.path('/phonebook')
  }

  $scope.back = function () {
    history.back();
  };

  $scope.deleteNumber = function (subItem) {
    $http({
      method: 'DELETE',
      url: `${appConfig.apiUrl}contacts/${updateFactory.updateContact._id}/number`,
      data: subItem
    }).then(function (response) {
      console.log(response)
      if (response.status === 200) {
        updateFactory.updateContact.phone = response.data;
      }
    }).catch(function (error) {
      $scope.msg = error.data;
      console.log(error)
    });
  }

  $scope.update = function (item) {
    $http({
      method: 'PUT',
      url: `${appConfig.apiUrl}contacts/update/${item._id}`,
      data: item
    }).then(function (response) {
      if (response.status === 200) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Contact Updated Succesfully!')
            .hideDelay(3000)
        );
        setTimeout(function () {
          $location.path('/phonebook')
        }, 3000);
      }
    }).catch(function (error) {
      $scope.msg = error.data;
      console.log(error)
    });
  }

  $scope.logger = function (chip) {
    if (updateFactory.groups.includes(chip)) {
    }
    else {
      $scope.selectedItems.pop();
    }
  };

  $scope.selectedItem = null;
  $scope.searchText = null;
  $scope.selectedItems = $scope.item.group;
  $scope.transformChip = transformChip;

  $scope.querySearchDeferred = querySearchDeferred;

  function transformChip(chip) {
    if (angular.isObject(chip)) {
      return chip;
    }
  }

  function querySearchDeferred(query) {
    var deferred = $q.defer();
    setTimeout(function () {
      var groupArray = updateFactory.groups;
      if (query) {
        deferred.resolve(filterFilter(groupArray, query));
      } else {
        deferred.reject(['None']);
      }
    }, 100);

    return deferred.promise;
  }

  $scope.addnumber = function (ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '/app/phonebook/new-number.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: $scope.customFullscreen,
    })
  };

  $scope.editImage = function (ev) {
    $mdDialog.show({
      controller: ImageController,
      templateUrl: '/app/phonebook/image-view.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: $scope.customFullscreen,
    })
  };
}

function DialogController($scope, $mdDialog, updateFactory, $http,appConfig) {
  $scope.typeOptions = ["home", "work", "mobile", "other"];
  $scope.msg = '';
  $scope.newItem = {
    type: '',
    code: '',
    number: ''
  }

  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.add = function () {

    $http({
      method: 'POST',
      url: `${appConfig.apiUrl}contacts/${updateFactory.updateContact._id}`,
      data: $scope.newItem
    }).then(function (response) {
      if (response.status === 200) {
        updateFactory.updateContact.phone.push($scope.newItem);
        $mdDialog.hide();
      }
    }).catch(function (error) {
      $scope.msg = response.data;
      console.log(error)
    });
  };
}

function ImageController($scope, $mdDialog, updateFactory) {
    $scope.Image='';
    $scope.CroppedImage='';
    $scope.handleFileSelect=function (evt) {
      var file=evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.Image=evt.target.result;
        });
      };
      reader.readAsDataURL(file); 
    }

    $scope.cancel = function () {
      $mdDialog.cancel();
    };
  
    $scope.add = function () {
      updateFactory.updateContact.image = $scope.CroppedImage;
      $mdDialog.hide();
    }
}

