angular.module('phonebookApp')
    .controller('newController', newController);


function newController($scope, updateFactory, $q, filterFilter, $http, $location, $mdToast,$mdDialog,appConfig) {

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
        if( $scope.item.image == ""){
            $scope.item.image = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHRpdGxlPkFzc2V0IDU8L3RpdGxlPjxnIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiPjxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHBhdGggZD0iTTEwMCw0NnY4YTUuNTUsNS41NSwwLDAsMC0uMzQsMUM5Ni43Miw3Ni4yMyw4NSw5MC4yOSw2NSw5Ny41Myw2MS41LDk4LjgsNTcuNjksOTkuMiw1NCwxMDBINDZhNS41NSw1LjU1LDAsMCwwLTEtLjM0QzIzLjc3LDk2LjcyLDkuNzEsODUsMi40Nyw2NSwxLjIsNjEuNS44LDU3LjY5LDAsNTRWNDZhNS41NSw1LjU1LDAsMCwwLC4zNC0xQzMuMjgsMjMuNzcsMTUsOS43MSwzNSwyLjQ3LDM4LjUsMS4yLDQyLjMxLjgsNDYsMGg4YTUuNTUsNS41NSwwLDAsMCwxLC4zNEM3Ni4yMywzLjI4LDkwLjI5LDE1LDk3LjUzLDM1LDk4LjgsMzguNSw5OS4yLDQyLjMxLDEwMCw0NlpNODUuMzEsNzcuMzVjMTIuMzItMTQuNzUsMTMuOTMtNDItNC01OS40NC0xNy40Ni0xNy00Ni4xNS0xNi43Ny02My4xOS40OEMuNDksMzYuMjksMi43OCw2My4zMiwxNC43MSw3Ny4zMkE0MC44NSw0MC44NSwwLDAsMSwzOCw1Ny4zQzMxLjg4LDUzLDI3Ljg3LDQ3LjQ1LDI3LDQwLjA4czEuNjktMTMuNzYsNi45My0xOWEyMi40NiwyMi40NiwwLDAsMSwzMS43Mi0uNDYsMjIuNDIsMjIuNDIsMCwwLDEsNy41MSwxNS42OGMuMzksOS0zLjg1LDE1Ljc2LTExLjEzLDIxQTQwLjg2LDQwLjg2LDAsMCwxLDg1LjMxLDc3LjM1Wk00Ni4xMiw5NC42NGMxNS4xNSwwLDI1LjI5LTMuOCwzMy43Ni0xMS4xNCwxLjI5LTEuMTEsMS41OC0yLC43OC0zLjU2Qzc0LjI1LDY3LjUyLDY0LjEyLDYwLjgzLDUwLjE0LDYwLjc4UzI1LjgzLDY3LjM5LDE5LjM3LDc5LjljLS43OSwxLjUyLS42LDIuNDQuNzEsMy41N0MyOC42NSw5MC44NywzOC41OCw5NC41NCw0Ni4xMiw5NC42NFptMjEuNzQtNTdjMC0xMC4zMy03LjQ5LTE4LTE3LjcyLTE4cy0xOCw3LjQ5LTE4LDE3LjcyLDcuNDksMTgsMTcuNzIsMThTNjcuODMsNDcuODcsNjcuODYsMzcuNjRaIi8+PC9nPjwvZz48L3N2Zz4=";
        }
            $http({
                method: 'POST',
                url: `${appConfig.apiUrl}contacts/`,
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
                      .textContent(`${error.data}`)
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