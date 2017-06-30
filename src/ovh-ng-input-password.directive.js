/**
 * @ngdoc directive
 * @name ovh-ng-input-password.directive:ovh-ng-input-password
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
                <ovh-ng-input-password name="password"
                                data-ng-model="password"
                                data-strength="getStrength(value)"
                                data-rules="rules">
                </ovh-ng-input-password>
            </form>
        </div>
   </file>
   <file name="script.js">
        angular.module("ngView", ["ovh-ng-input-password"]).controller("mainCtrl", function(scope) {
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
angular.module("ovh-ng-input-password").directive("ovhNgInputPassword", function () {
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
        templateUrl: "ovh-ng-input-password.html",
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
                } else if (self.hasStrength) {
                    self.passwordStrength = { value: (100 * (self.strength({ value: self.typedPassword || "" }) / 1.5)) + (100 / 3) };
                    self.passwordStrength.type = self.passwordStrength.value < 200 / 3 ? "warning" : "success";
                } else {
                    self.passwordStrength = { value: 100, type: "success" };
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
                } else if (force) {
                    this.classes["ng-invalid"] = !this.valid;
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
