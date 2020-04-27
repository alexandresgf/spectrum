/**
 * Spectrum UI (User Interface)
 * 
 * This is the main script of Spectrum User Interface and it join all other
 * scripts in the right order using the modular include of nodeJS.
 * 
 * @author Alexandre Ferreira
 */
'use strict';

/**
 * Route configuration
 * 
 * Configuring routes and defining what template use and the controller that
 * will support the data.
 */
angular.module('spectrumUI', ['ngRoute', 'spectrumUI.HomeController'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/', {templateUrl: 'views/home.html', controller: 'MainMenuController'});
            $routeProvider.when('/shelf', {templateUrl: 'views/shelf.html'});
            $routeProvider.when('/friends', {templateUrl: 'views/friendlist.html'});
        }]);