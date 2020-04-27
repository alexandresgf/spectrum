/**
 * Home Controller
 * 
 * This file will describe every controller that make references to the Home.
 * 
 * @author  Alexandre Ferreira
 * @since   v0.1.0a
 */

'use strict';

angular.module('spectrumUI.HomeController', [])
        .controller('MainMenuController', ['$scope', function($scope) {
            var menu = document.querySelectorAll('a.list-group-item');
            var idx = 0;

            function next() {
            	menu[idx].setAttribute('class', 'list-group-item');
            	idx++;

            	if (idx === menu.length)
            		idx = 0;

            	menu[idx].setAttribute('class', 'list-group-item active');
            }

            function pressed(value) {
                if (value === Spectrum.Gamepad.DIR_DOWN)
                    next();
            }

            $scope.init = function init() {
            	'use strict';

	            var controller = new Spectrum.Gamepad(true);
	            controller.registerMethod(Spectrum.Gamepad.STATE_PRESSED, pressed);
            };

            $scope.init();
        }]);