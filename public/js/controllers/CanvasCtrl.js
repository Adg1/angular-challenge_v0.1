
angular.module('CanvasCtrl', ['ngFileUpload']).controller('CanvasController', function($scope,  $timeout,Upload) {

  $scope.setImage = "Select Image";
  var canvas = new fabric.Canvas('canvas');
  canvas.setWidth(400);
  canvas.setHeight(400);
  $scope.canvasStates = {
    index: -1,
    states: []
  }
  var img;
  var text;
  canvas.on("object:selected", function(options, event) {
    //var object = options.target; //This is the object selected
    if (options.e) {
      var scope = angular.element(document.getElementById('canvas')).scope();
      // You can do anything you want and then call...
      scope.$apply();
    }
  });

  canvas.on("object:modified", function(event) {
    //var object = options.target; //This is the object selected
    var obj = event.target;
    if (obj) {
      var currentState = canvas.getObjects().map(function (object) {
        return {
          type: object.get('type'),
          state: {
            left: object.left,
            top: object.top,
            width: object.width,
            height: object.height,
            angle: object.angle,
            scaleX: object.scaleX,
            scaleY: object.scaleY,
            text: object.text
          }
        };
      });
      if ($scope.canvasStates.index + 1 !== $scope.canvasStates.states.length) {
        $scope.canvasStates.states.splice($scope.canvasStates.index+1,$scope.canvasStates.states.length - $scope.canvasStates.index - 1);
      }
      $scope.canvasStates.states.push(currentState);
      $scope.canvasStates.index +=1
      if (obj.get('type')=== 'image' || obj.get('type')=== 'text' || event.e ) {

        $timeout(function() {
          var scope = angular.element(document.getElementById('canvas')).scope();
          // You can do anything you want and then call...
          scope.$apply();
       });
      }

    }

  });

  canvas.on('object:moving', function(e) {
    var obj = e.target;
    // if object is too big ignore
    if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
      return;
    }
    obj.setCoords();
    // top-left  corner
    if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
      obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
      obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
    }
    // bot-right corner
    if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
      obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
      obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
    }
  });

  canvas.on('object:scaling', function(e) {
    var maxScaleX = 2.66;
    var maxScaleY = 2.66;
    var obj = e.target;
    if (obj.scaleX > maxScaleX) {
      obj.scaleX = maxScaleX;
      obj.left = obj.lastGoodLeft;
      obj.top = obj.lastGoodTop;
    }
    if (obj.scaleY > maxScaleY) {
      obj.scaleY = maxScaleY;
      obj.left = obj.lastGoodLeft;
      obj.top = obj.lastGoodTop;
    }
    obj.lastGoodTop = obj.top;
    obj.lastGoodLeft = obj.left;
  });

  $scope.addText = function() {
    if ($scope.text) {
      if (text) {
        canvas.remove(text);
      }
      text = new fabric.Text($scope.text, {
        left: 150, //Take the block's position
        top: 150,
        width: 150,
        height: 150,
        fill: 'black'
      });
      canvas.add(text);
      canvas.trigger('object:modified', {target: text});
    }

  };
  $scope.saveCanvas = function() {
    if (typeof canvas !== 'undefined') {
      var currentCanvas = canvas.getObjects();
    }
  };
  $scope.undoCanvas = function() {
    if (typeof canvas !== 'undefined') {
      $scope.canvasStates.index -=1;
      for (var i = 0; i < $scope.canvasStates.states[$scope.canvasStates.index].length; i++) {
        if ($scope.canvasStates.states[$scope.canvasStates.index][i].type === 'image') {
          img.set($scope.canvasStates.states[$scope.canvasStates.index][i].state);
        }
        else if ($scope.canvasStates.states[$scope.canvasStates.index][i].type === 'text') {
          text.set($scope.canvasStates.states[$scope.canvasStates.index][i].state);
        }
      }
      canvas.renderAll();
    }
  };
  $scope.redoCanvas = function() {
    if (typeof canvas !== 'undefined') {
      $scope.canvasStates.index +=1;
      for (var i = 0; i < $scope.canvasStates.states[$scope.canvasStates.index].length; i++) {
        if ($scope.canvasStates.states[$scope.canvasStates.index][i].type === 'image') {
          img.set($scope.canvasStates.states[$scope.canvasStates.index][i].state);
        }
        if ($scope.canvasStates.states[$scope.canvasStates.index][i].type === 'text') {
          text.set($scope.canvasStates.states[$scope.canvasStates.index][i].state);
        }
      }
      canvas.renderAll();
    }
  };

  $scope.canvasShapes = function() {
    if (typeof canvas !== 'undefined') {
      return canvas.getObjects();
    }
    return [];
  };


  $scope.upload = function(file) {

    if (file) {
      if (img) {
        canvas.remove(img);
      }
      fabric.Image.fromURL(file.$ngfBlobUrl, function(myImg) {
        img = myImg.set({
          left: 150,
          top: 150,
          width: 150,
          height: 150
        });
        canvas.add(img);
        canvas.moveTo(img, 0);
        canvas.trigger('object:modified', {target: img});
      });
    }
  };

});
