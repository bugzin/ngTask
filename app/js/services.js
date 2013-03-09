'use strict';

// /* Services */

angular.module('myApp.services', ['ngResource']).

factory('taskData', function(){
	var task;
	var taskListId;

	return {
		set: function (data) {
			task = data;
		},

		get: function() {
			return task;
		},

		setListId: function(id) {
			taskListId = id;
		},

		getListId: function() {
			return taskListId;
		}
	}
})

.factory('gapis', function(){
	return function(url, method, data, callback) {
		gapi.client.tasks[url][method](data).execute(function(res){
			callback(res);
	    });
	}
})
  
