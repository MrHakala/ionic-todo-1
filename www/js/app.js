angular.module('todo', ['ionic', 'firebase'])
// Projects factory handles saving and loading projects from local storage,
// also lets us save and load the last project index
.factory('Projects', function(){
	return {
		all: function(){
			var projectString = window.localStorage['projects'];
			if (projectString){
				return angular.fromJson(projectString);
			}
			return [];
		},
		save: function(projects){
			window.localStorage['projects'] = angular.toJson(projects);
		},
		newProject: function(projectTitle){
			return {
				title: projectTitle,
				tasks: []
			};
		},
		getLastActiveIndex: function(){
			return parseInt(window.localStorage['lastActiveProject']) || 0;
		},
		setLastActiveIndex: function(index){
			window.localStorage['lastActiveProject'] = index;
		}
	}
})

// Todo Controller
.controller('TodoController', function($scope, $timeout, $ionicModal, Projects){
	
	// utility function for creating a new project with given projectTitle
	var createProject = function(projectTitle){
		var newProject = Projects.newProject(projectTitle);
		$scope.projects.push(newProject);
		Projects.save($scope.projects);
		$scope.selectProject(newProject, $scope.projects.length - 1);
	};
	
	// Load projects
	$scope.projects = Projects.all();
	
	// Grab last active or first project
	$scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];
	
	// Create new project
	$scope.newProject = function(){
		var projectTitle = prompt('Project name');
		if(projectTitle){
			createProject(projectTitle);
		}
	};
	
	// Select the current project
	$scope.selectProject = function(project, index){
		$scope.activeProject = project;
		Projects.setLastActiveIndex(index);
		$scope.sideMenuController.close();
	};
	
	// Create and load the modal
	$ionicModal.fromTemplateUrl('new-task.html', function(modal){
		$scope.taskModal = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});
	
	// Called when the form is submitted
	$scope.createTask = function(task){
		if(!$scope.activeProject || !task){
			return;
		}
		$scope.activeProject.tasks.push({
			title: task.title
		});
		$scope.taskModal.hide();
		
		// save all the projects
		Projects.save($scope.projects);
		
		task.title = '';
	};
	
	// Open task modal
	$scope.newTask = function(){
		$scope.taskModal.show();
	};
	
	// Close task modal
	$scope.closeNewTask = function(){
		$scope.taskModal.hide();
	};
	
	$scope.toggleProjects = function(){
		$scope.sideMenuController.toggleLeft();
	};
	
	$timeout(function(){
		if($scope.projects.length == 0){
			while(true){
				var projectTitle = prompt('Your first project title: ');
				
				if(projectTitle){
					createProject(projectTitle);
					break;
				}
			}
		}
	});
});
