Template.registerHelper('equals', function (a, b) {
  return a === b;
});

Template.registerHelper('showReactiveTable', () => Session.get('showReactiveTable'));
