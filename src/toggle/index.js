import angular from 'angular';
import 'angular-translate';

import directive from './directive';

const moduleName = 'ngOvhInputPasswordToggle';

angular
  .module(moduleName, [
    'pascalprecht.translate',
  ])
  .directive('ovhNgInputPasswordToggle', directive);

export default moduleName;
