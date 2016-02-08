(function(angular){
    'use strict';

    var POPOVER_SHOW = 'popoverToggleShow';
    var POPOVER_HIDE = 'popoverToggleHide';

    var triggerHide;
    var openEl;

    var module = angular.module('popoverToggle', ['ui.bootstrap']);

    module.config(['$uibTooltipProvider', function($uibTooltipProvider) {
        var triggers = {};
        triggers[POPOVER_SHOW] = POPOVER_HIDE;

        $uibTooltipProvider.setTriggers(triggers);
    }]);

    module.directive('popoverClose', [function () {
        return {
            restrict: 'A',
            link: link
        };

        function link($scope, $element, $attrs) {
            $element.on('click', function (e) {
                if (angular.element(e.target).closest('.popover').length === 0
                    && !angular.element(e.target).attr('popover')
                    && angular.element(e.target).closest('[popover]').length === 0) {

                    if (triggerHide) {
                        triggerHide();
                    }
                }
            });
        }
    }]);

    module.directive('popoverToggle', ['$timeout', '$parse', function($timeout, $parse) {
        return {
            restrict: 'A',
            link: link
        };

        function link($scope, $element, $attrs) {
            $attrs.popoverTrigger = POPOVER_SHOW;

            $scope.$watch($attrs.popoverToggle, function(newValue) {
                if (openEl !== $element && triggerHide) {
                    triggerHide();
                }
                $timeout(function(){
                    if(newValue) {
                        openEl = $element;
                        $element.triggerHandler(POPOVER_SHOW);

                        triggerHide = function () {
                            $element.triggerHandler(POPOVER_HIDE);
                            $timeout(function () {
                                $parse($attrs.popoverToggle).assign($scope, false);
                            });
                        }
                    } else {
                        $element.triggerHandler(POPOVER_HIDE);
                    }
                });
            });
        }
    }]);

})(angular);
