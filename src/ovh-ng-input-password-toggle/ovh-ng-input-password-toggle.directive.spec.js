describe("Directive: ovhNgInputPasswordToggle", function () {
    "use strict";

    var $compile;
    var $scope;
    var elem;

    beforeEach(module("ovh-ng-input-password"));
    beforeEach(module("templates"));

    beforeEach(inject(function (_$rootScope_, _$compile_) {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;

        elem = $("<div>").prependTo("body");
        $scope.$digest();
    }));

    afterEach(function () {
        $scope.$destroy();
        elem.remove();
    });

    /* ----------  TEMPLATES DECLARATION  ----------*/

    var templates = {
        "default": {
            element: "<input data-ovh-ng-input-password-toggle=\"{{toggle}}\" type=\"password\"></input>",
            scope: {
            }
        }
    };

    function compileDirective (template, locals) {
        var tmpl = templates[template];
        angular.extend($scope, angular.copy(tmpl.scope) || angular.copy(templates.default.scope), locals);
        var element = $(tmpl.element).appendTo(elem);
        element = $compile(element)($scope);
        $scope.$digest();
        return jQuery(element[0]);
    }

    describe("Initialization", function () {
        it("should load the directive as element", function () {
            var compiledElem = compileDirective("default");
            expect(compiledElem.attr("type")).toEqual("password");
        });
    });

    describe("Toggle type", function () {
        it("should toggle to text", function () {
            var compiledElem = compileDirective("default", {
                toggle: true
            });
            expect(compiledElem.attr("type")).toEqual("text");
        });
    });

});
