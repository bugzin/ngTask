'use strict';

/* Controllers */

function LoginCtrl($scope, $window) {

	$scope.login = function() { 
    	
  }

	function handleClientLoad() {
		if (gapi && gapi.client) {
	      gapi.client.setApiKey(config.apiKey);
	      window.setTimeout(checkAuth, 100);
        gapi.client.load('tasks', 'v1', function(res) {});  
	  	}else {
	  		setTimeout(handleClientLoad, 100);
	  	}	
    }

    function checkAuth() {
      gapi.auth.authorize({ client_id: config.clientId, scope: config.scopes, immediate: true }, handleAuthResult);
    }

    function handleAuthResult(authResult) {
      var authTimeout;

      if (authResult && !authResult.error) {
        $scope.loggedIn = true;

        $window.location.href = '/#/';

        // Schedule a check when the authentication token expires
        if (authResult.expires_in) {
          authTimeout = (authResult.expires_in - 5 * 60) * 1000;
          setTimeout(checkAuth, authTimeout);
        }

      } else {
        if (authResult && authResult.error) {
          console.error('Unable to sign in:', authResult.error);
        }

        app.views.auth.$el.show();
      }
    }

    handleClientLoad();
}

function MainCtrl($scope, $dialog, taskData, gapis) {
  
  // gapi.client.tasks["tasklists"].list({userId: "@me"}).execute(function(res){
  //   $scope.tasklists = res.items;
  //   $scope.$apply();
  //   $scope.loadTaskList(res.items[0].id);
  //   taskData.setListId(res.items[0].id);
  // });

  gapis('tasklists', 'list', {userId: "@me"}, function(res){
    $scope.tasklists = res.items;
    $scope.$apply();
    $scope.loadTaskList(res.items[0].id);
    taskData.setListId(res.items[0].id);

  });

  $scope.loadTaskList = function(id) {
    // gapi.client.tasks["tasks"].list({tasklist: id}).execute(function(res){
    //   $scope.tasks = res.items;
    //   $scope.$apply();
    // });
    gapis('tasks', 'list', {tasklist:id}, function(res) {
      $scope.tasks = res.items;
      $scope.$apply();
    });
  }

  var opts = {
    backdrop: false,
    keyboard: true,
    backdropClick: true,
    templateUrl:  'partials/dialog.html', // OR: templateUrl: 'path/to/view.html',
    controller: 'TestDialogCtrl'
  };


  $scope.loadTask = function(data) {
    taskData.set(data);

    var d = $dialog.dialog(opts);
    d.open().then(function(result){
      if(result)
      {
        alert('dialog closed with result: ' + result);
      }
    });
  }
}

function TestDialogCtrl($scope, dialog, taskData, gapis) {
  $scope.task = taskData.get();

  $scope.close = function(result) {
    dialog.close();
  }

  $scope.save = function() {
    var data = {'resource' : $scope.task};
    data.tasklist = taskData.getListId();
    data.task = $scope.task.id;
    gapis('tasks', 'update', data, function(res){
      dialog.close();
    });
  }
}