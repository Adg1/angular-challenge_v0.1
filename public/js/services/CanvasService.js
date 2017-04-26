// public/js/services/NerdService.js
angular.module('CanvasService', []).factory('Canvas', ['$http', function($http) {

    return {
        // call to get all nerds
        get : function() {
            return $http.get('/api/canvas');
        },


                // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new canvas
        create : function(canvasData) {
            return $http.post('/api/canvas', canvasData);
        },

        // call to DELETE a nerd
        delete : function(id) {
            return $http.delete('/api/canvas/' + id);
        }
    }

}]);
