/**
 * @ngdoc overview
 * @name inputPassword
 * @description
 * # inputPassword
 *
 * Main module of the application.
 *
 *  See README.md for instructions about installation.
 */
angular.module("inputPassword", ["pascalprecht.translate"]);
angular.module("inputPassword").directive("inputPasswordToggle", function () {
    "use strict";
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            scope.$watch(attrs.inputPasswordToggle, function (newVal) {
                element.attr("type", newVal === true ? "text" : "password");
            });
        }
    };
});
/**
 * @ngdoc directive
 * @name inputPassword.directive:input-password
 * @restrict E
 *
 * @description
 * <p>Password component. Features:</p>
 * <ul>
 *     <li><strong>Validation rules</strong>. You can specify rules to validate password</li>
 *     <li><strong>Compliant with form validation</strong>. if inserted in a form, it will manage the validation of the form</li>
 *     <li><strong>Strength</strong>. You can specify a function to compute strength</li>
 * </ul>
 * @example
   <example module="ngView">
   <file name="index.html">
        <div ng-controller="mainCtrl">
            <form name="myForm">
                <input-password name="password"
                                data-ng-model="password"
                                data-strength="getStrength(value)"
                                data-rules="rules">
                </input-password>
            </form>
        </div>
   </file>
   <file name="script.js">
        angular.module("ngView", ["inputPassword"]).controller("mainCtrl", function(scope) {
            scope.rules = [
                {
                    id: "length",
                    caption: "Must contain 8 to 20 characters",
                    validator: function (str) {
                        return str && str.length > 7 && str.length < 21;
                    }
                },
                {
                    id: "specialChar",
                    caption: "Can contain following characters #{}()[]-|@=*+/!:;",
                    validator: /^[\w~"#'\{\}\(\\)[\]\-\|\\^@=\*\+\/!:;.,?<>%*µÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ]+$/,
                    immediateWarning: true
                },
            ];
            scope.getStrength = function(val) {
                return (val.length-8) / 12;
            }
        });
   </file>
   </example>
 * @param {string} ngModel the password.
 * @param {string} name name of the field (see form validation).
 * @param {array}  rules <p>array of rules.</p>
 * <ul>
 *   <li><strong>id</strong>(optional): identifier of the rules (see form validation)</li>
 *   <li><strong>caption</strong>: displayed message</li>
 *   <li><strong>validator</strong>: function or RegExp. will return true if the rule is respected</li>
 *   <li><strong>immediateWarning</strong>: boolean. will warn at the very first typing if the rule is not respected</li>
 * </ul>
 * @param {function} [strength=null] function(value) to define the strength of the password. it will return a float [0;1]
 * @param {string}   [placeholder=null] placeholder for the component
 */
angular.module("inputPassword").directive("inputPassword", function () {
    "use strict";
    return {
        controllerAs: "$ctrl",
        bindToController: true,
        restrict: "E",
        scope: {
            ngModel: "=",
            rules: "=",
            placeholder: "@",
            name: "@",
            strength: "&"
        },
        link: function (scope, element, attrs, ctrl) {
            // inject ngModel controller into component controller to have $setValidity available
            scope.$ctrl.ngModelCtrl = ctrl;
            scope.$ctrl.init();
            scope.$ctrl.hasStrength = !!attrs.strength;
        },
        require: "ngModel",
        templateUrl: "input-password.html",
        controller: function () {

            var self = this;
            this.passwordVisible = false;
            this.typedPassword = this.ngModel || "";
            this.displayRules = {};
            this.valid = false;
            this.classes = {};
            this.metRules = 0;

            this.togglePassword = function () {
                this.passwordVisible = !this.passwordVisible;
            };

            function getId (rule) {
                return rule.id || _.kebabCase(rule.caption);
            }

            function computeStrength () {
                if (!self.valid) {
                    if (self.hasStrength) {
                        self.passwordStrength = { value: 100 * self.metRules / (self.rules.length * 3), type: "danger" };
                    } else {
                        self.passwordStrength = { value: 100 * self.metRules / self.rules.length, type: "danger" };
                    }
                } else {
                    if (self.hasStrength) {
                        self.passwordStrength = { value: 100 * self.strength({ value: self.typedPassword || "" }) / 1.5 + 100 / 3 };
                        self.passwordStrength.type = self.passwordStrength.value < 200 / 3 ? "warning" : "success";
                    } else {
                        self.passwordStrength = { value: 100, type: "success" };
                    }
                }
            }

            this.typing = function (force) {
                this.valid = true;
                this.classes = {};
                this.metRules = 0;

                // Compute rules
                _.forEach(this.rules, function (rule) {
                    var result;
                    if (_.isRegExp(rule.validator)) {
                        result = !!rule.validator.test(self.typedPassword);
                    } else if (_.isFunction(rule.validator)) {
                        result = !!rule.validator(self.typedPassword);
                    } else {
                        result = !!rule.validator;
                    }
                    self.metRules += result ? 1 : 0;
                    self.valid = self.valid && result;
                    self.ngModelCtrl.$setValidity(getId(rule), result);
                    if (result && force) {
                        self.classes[getId(rule)] = result;
                    }
                    if ((!result && (self.displayRules[getId(rule)] !== undefined || force || (rule.immediateWarning && self.typedPassword.length))) || result) {
                        self.displayRules[getId(rule)] = result;
                    }
                });

                // Comput classes and ngModel
                if (this.valid) {
                    this.ngModel = this.typedPassword;
                    if (force) {
                        this.classes["ng-valid"] = this.valid;
                    }
                } else {
                    if (force) {
                        this.classes["ng-invalid"] = !this.valid;
                    }
                }

                computeStrength();
            };

            this.getRuleValue = function (rule) {
                return this.displayRules[getId(rule)];
            };

            this.getsFocus = function () {
                this.visible = true;
                this.displayRules = {};
                if (this.typedPassword && this.typedPassword.length) {
                    self.typing(true);
                } else {
                    self.typing();
                }
            };

            this.losesFocus = function () {
                this.visible = false;
                self.typing(true);
            };

            this.init = function () {
                this.typing();
                computeStrength();
            };

        }
    };
});
angular.module('inputPassword').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('input-password.html',
    "<div class=input-password data-ng-class=$ctrl.classes><button type=button class=input-password data-ng-click=$ctrl.togglePassword();$event.stopPropagation();><svg class=vision data-ng-class=\"{'eye': !$ctrl.passwordVisible, 'eye-slash': $ctrl.passwordVisible}\"><path class=input-password-see d=M11.18,1.82A11.69,11.69,0,0,1,20.79,7.4,1.39,1.39,0,0,1,20.8,9a11.26,11.26,0,0,1-8.2,5.41C7.76,15.06,4.08,13,1.36,9.09a1.45,1.45,0,0,1,0-1.76,11.77,11.77,0,0,1,8.35-5.4C10.15,1.86,10.61,1.86,11.18,1.82ZM6.65,4.4A10.28,10.28,0,0,0,2.59,8.07a.37.37,0,0,0,0,.34,20,20,0,0,0,1.66,1.94A9.4,9.4,0,0,0,13,12.95a10.32,10.32,0,0,0,6.51-4.59.43.43,0,0,0,0-.37,10.25,10.25,0,0,0-2.09-2.34c-.59-.48-1.24-.88-1.87-1.32l-.09.08a4.89,4.89,0,0,1-1.49,6.43,5,5,0,0,1-5.81,0A4.9,4.9,0,0,1,6.28,8.29,5,5,0,0,1,6.65,4.4Zm.94,2.27a1.81,1.81,0,0,0,.31.55.51.51,0,0,0,.82-.44A2.24,2.24,0,0,1,10.1,4.71a4.21,4.21,0,0,1,1-.21.56.56,0,0,0,.51-.55.54.54,0,0,0-.59-.5A3.51,3.51,0,0,0,7.59,6.67Z /><path class=input-password-hide d=M20.79,7.4A14.57,14.57,0,0,0,19.73,6a3.7,3.7,0,0,1,.09.77,3.78,3.78,0,0,1-.29,1.41.28.28,0,0,1,0,.18l-.16.22a5.54,5.54,0,0,1-1.44,1.69A9.61,9.61,0,0,1,13,12.95a10.11,10.11,0,0,1-2.14.2L9.55,14.46a12.28,12.28,0,0,0,3,0A11.26,11.26,0,0,0,20.8,9,1.39,1.39,0,0,0,20.79,7.4Z /><path class=input-password-hide d=M17.44.77,6.33,11.87a11.21,11.21,0,0,1-1.82-1.33A4.76,4.76,0,0,1,2.24,6.76a3.69,3.69,0,0,1,.08-.71,14.11,14.11,0,0,0-1,1.28,1.45,1.45,0,0,0,0,1.76,13.55,13.55,0,0,0,3.92,3.84l-2.2,2.2,1.41,1.41L18.85,2.18Z /></svg></button> <input input-password-toggle=$ctrl.passwordVisible placeholder={{$ctrl.placeholder}} type=password class=\"form-control input-password\" data-ng-class=$ctrl.classes data-ng-model=$ctrl.typedPassword data-ng-change=$ctrl.typing() data-ng-focus=$ctrl.getsFocus() data-ng-blur=$ctrl.losesFocus() data-uib-popover-template=\"'input-password.popover.html'\" data-popover-class=input-password-popover data-popover-placement=right-top data-popover-append-to-body=true data-popover-trigger=focus></div><div class=input-password-small-device><div class=arrow_box data-ng-show=$ctrl.visible><div data-ng-include=\"'input-password.popover.html'\"></div></div></div>"
  );


  $templateCache.put('input-password.popover.html',
    "<div class=input-password-validation><ul><li data-ng-repeat=\"rule in $ctrl.rules track by rule.caption\"><span class=\"circle pull-left\" data-ng-if=\"$ctrl.getRuleValue(rule) === undefined\"></span> <i class=\"ovh-font ovh-font-filled-check pull-left circle\" data-ng-if=\"$ctrl.getRuleValue(rule) === true\"></i> <i class=\"ovh-font ovh-font-filled-error pull-left circle\" data-ng-if=\"$ctrl.getRuleValue(rule) === false\"></i> <span class=caption data-ng-class=\"{met: $ctrl.getRuleValue(rule) === true, unmet: $ctrl.getRuleValue(rule) === false}\" data-ng-bind=rule.caption></span></li></ul><div data-ng-if=$ctrl.passwordStrength.value><div><span class=input-password-label data-translate=input_password_strength></span> <span class=\"pull-right strength {{$ctrl.passwordStrength.type}}\">{{ ('input_password_' + $ctrl.passwordStrength.type) | translate }}</span></div><uib-progressbar value=$ctrl.passwordStrength.value type={{$ctrl.passwordStrength.type}}></uib-progressbar></div></div>"
  );

}]);
