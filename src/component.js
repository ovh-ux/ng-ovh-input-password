import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    ngModel: '=',
    rules: '=',
    placeholder: '@',
    name: '@',
    strength: '&',
  },
  require: {
    ngModelCtrl: 'ngModel',
  },
  controller,
  template,
};
