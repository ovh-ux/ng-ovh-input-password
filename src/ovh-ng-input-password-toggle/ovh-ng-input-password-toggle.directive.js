angular.module("ovh-ng-input-password").directive("ovhNgInputPasswordToggle", function () {
    "use strict";
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            scope.$watch(attrs.ovhNgInputPasswordToggle, function (newVal) {
                element.attr("type", newVal === true ? "text" : "password");
            });
        }
    };
});
