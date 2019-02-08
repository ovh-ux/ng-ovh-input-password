export default () => ({
  restrict: 'A',
  link(scope, element, attrs) {
    scope.$watch(attrs.ovhNgInputPasswordToggle, (newVal) => {
      element.attr('type', newVal === true ? 'text' : 'password');
    });
  },
});
