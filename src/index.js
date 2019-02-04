import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'angular-ui-bootstrap';

// import directive from './directive';
import component from './component';
import templatePopover from './template.popover.html';

import toggle from './toggle';

import 'ovh-manager-webfont/dist/css/ovh-font.css';
import './index.less';

const moduleName = 'ngOvhInputPassword';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    toggle,
    'ui.bootstrap',
  ])
  .component('ovhNgInputPassword', component)
  // .directive('ovhNgInputPassword', directive)
  .run(/* @ngInject */($templateCache) => {
    $templateCache.put('ng-ovh-input-password.popover.html', templatePopover);
  })
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
