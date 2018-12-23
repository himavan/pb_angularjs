angular.module('phonebookApp')
    .controller('newController', newController);


function newController($scope, updateFactory, $q, filterFilter, $http, $location, $mdToast,$mdDialog) {

    if (updateFactory.groups !== null) {
      } else {
        $location.path('/phonebook')
      }
    
    $scope.item = {
        name:'',
        email:'',
        address:'',
        image:'',
        group:[],
        phone:[{
            type:'',
            code:'',
            number:''
        }]
    }

    $scope.add = function () {
        var newPhone = {
            type:'',
            code:'',
            number:''
        }
        $scope.item.phone.push(newPhone);
    }

    $scope.delete = function () {
        $scope.item.phone.pop();
    }

    $scope.cancel = function() {
        history.back();
    };

    $scope.create = function () {
        
            $http({
                method: 'POST',
                url: `http://127.0.0.1:3000/api/contacts/`,
                data: $scope.item
            }).then(function (response) {
                if (response.status === 200) {
                    $mdToast.show(
                        $mdToast.simple()
                          .textContent('Contact Created Succesfully!')
                          .hideDelay(3000)
                      );
                    setTimeout(function(){ 
                        $location.path('/phonebook')
                     }, 3000);
                }
            }).catch(function (error) {
                $mdToast.show(
                    $mdToast.simple()
                      .textContent('Error Occured!')
                      .hideDelay(3000)
                  );
                console.log(error)
            });

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

    $scope.editImage = function (ev) {
        $mdDialog.show({
          controller: NewImageController,
          templateUrl: '/app/phonebook/image-view.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: $scope.customFullscreen,
          locals: {
            item: $scope.item
          }
        })
      };

}

function NewImageController($scope, $mdDialog, item) {
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
      item.image = $scope.CroppedImage;
      $mdDialog.hide();
    }
}