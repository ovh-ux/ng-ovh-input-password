import forEach from 'lodash/forEach';
import isFunction from 'lodash/isFunction';
import isRegExp from 'lodash/isRegExp';
import kebabCase from 'lodash/kebabCase';

export default class {
  /* @ngInject */
  constructor(
    $scope,
  ) {
    this.$scope = $scope;
  }

  $onInit() {
    this.passwordVisible = false;
    this.typedPassword = this.ngModel || '';
    this.displayRules = {};
    this.valid = false;
    this.classes = {};
    this.metRules = 0;

    this.hasStrength = !!this.strength;

    this.typing();
    this.computeStrength();
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  static getId(rule) {
    return rule.id || kebabCase(rule.caption);
  }

  computeStrength() {
    this.passwordStrength = {
      value: 100,
      type: 'success',
    };

    if (!this.valid) {
      this.passwordStrength = {
        value: (100 * this.metRules) / this.rules.length,
        type: 'danger',
      };

      if (this.hasStrength) {
        this.passwordStrength.value = this.passwordStrength.value / 3;
      }
    } else if (this.hasStrength) {
      const passwordStrengthValue = (100 * (this.strength({ value: this.typedPassword || '' }) / 1.5)) + (100 / 3);
      this.passwordStrength = {
        value: passwordStrengthValue,
        type: passwordStrengthValue < 200 / 3 ? 'warning' : 'success',
      };
    }
  }

  typing(force) {
    this.valid = true;
    this.classes = {};
    this.metRules = 0;

    // Compute rules
    forEach(this.rules, (rule) => {
      let result;
      if (isRegExp(rule.validator)) {
        result = !!rule.validator.test(this.typedPassword);
      } else if (isFunction(rule.validator)) {
        result = !!rule.validator(this.typedPassword);
      } else {
        result = !!rule.validator;
      }
      this.metRules += result ? 1 : 0;
      this.valid = this.valid && result;
      this.ngModelCtrl.$setValidity(this.constructor.getId(rule), result);
      if (result && force) {
        this.classes[this.constructor.getId(rule)] = result;
      }
      if ((
        !result
        && (
          this.displayRules[this.constructor.getId(rule)] !== undefined
          || force
          || (rule.immediateWarning && this.typedPassword.length)
        )
      ) || result) {
        this.displayRules[this.constructor.getId(rule)] = result;
      }
    });

    // Comput classes and ngModel
    if (this.valid) {
      this.ngModel = this.typedPassword;
      if (force) {
        this.classes['ng-valid'] = this.valid;
      }
    } else if (force) {
      this.classes['ng-invalid'] = !this.valid;
    }

    this.computeStrength();
  }

  getRuleValue(rule) {
    return this.displayRules[this.constructor.getId(rule)];
  }

  getsFocus() {
    this.visible = true;
    this.displayRules = {};
    if (this.typedPassword && this.typedPassword.length) {
      this.typing(true);
    } else {
      this.typing();
    }
  }

  losesFocus() {
    this.visible = false;
    this.typing(true);
  }
}
