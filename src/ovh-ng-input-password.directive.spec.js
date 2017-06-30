describe("Directive: ovhNgInputNumberPassword", function () {

    "use strict";

    var $compile;
    var $scope;
    var elem;
    var controller;

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
            element: "<ovh-ng-input-password name=\"password\" data-ng-model=\"password\" data-strength=\"getStrength(value)\" data-rules=\"validators\"></ovh-ng-input-password>",
            scope: {
                validators: [
                ]
            }
        }
    };

    function compileDirective (template, locals) {
        var tmpl = templates[template];
        angular.extend($scope, angular.copy(tmpl.scope) || angular.copy(templates.default.scope), locals);
        var element = $(tmpl.element).appendTo(elem);
        element = $compile(element)($scope);
        $scope.$digest();
        controller = element.controller("ovhNgInputPassword");
        return jQuery(element[0]);
    }

    // ---

    describe("Initialization", function () {
        it("should load the directive as element", function () {
            var compiledElem = compileDirective("default");
            expect(compiledElem.find("div.input-password").length).toEqual(1);
        });
    });

    describe("Field validation", function () {
        it("should validate with a regexp validator", function () {
            var typedPassword = "azerty";
            compileDirective("default", {
                validators: [
                    {
                        id: "one",
                        caption: "First rule",
                        validator: /^azerty$/
                    }
                ]
            });
            controller.typedPassword = typedPassword;
            controller.typing();
            expect(controller.ngModel).toEqual(typedPassword);
        });

        it("should validate with a function validator", function () {
            var typedPassword = "azerty";
            compileDirective("default", {
                validators: [
                    {
                        id: "one",
                        caption: "First rule",
                        validator: function () {
                            return true;
                        }
                    }
                ]
            });
            controller.typedPassword = typedPassword;
            controller.typing();
            expect(controller.ngModel).toEqual(typedPassword);
        });
    });

    describe("Field unvalidation", function () {
        var typedPassword = "azerty";
        it("should unvalidate with a regexp validator", function () {
            compileDirective("default", {
                validators: [
                    {
                        id: "one",
                        caption: "First rule",
                        validator: /^bidule$/
                    }
                ]
            });
            controller.typedPassword = typedPassword;
            controller.typing();
            expect(controller.ngModel).toBeUndefined();
        });

        it("should validate with a function validator", function () {
            compileDirective("default", {
                validators: [
                    {
                        id: "one",
                        caption: "First rule",
                        validator: function () {
                            return false;
                        }
                    }
                ]
            });
            controller.typedPassword = "azerty";
            controller.typing();
            expect(controller.ngModel).toBeUndefined();
        });
    });
});
