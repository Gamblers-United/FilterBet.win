/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.Home.events({
  'click #help': (event, template) => template.$('.help-block').slideToggle('slow'),
  'click #more': (event, template) => template.$('.more-block').slideToggle('slow'),
  'click #next': () => Session.set('currentStep', Session.get('currentStep') + 1),
  'click #back': () => Session.set('currentStep', Session.get('currentStep') - 1),
  'click #restart': () => { reset(); Session.set('currentStep', 1) },
  'click #slack': () => Modal.show('JoinSlack')
});

/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.Home.helpers({
  bet: () => ChecksCollection.findOne({_id: Session.get('activeCheck')}),
  currentStep: () => "Step" + Session.get('currentStep')
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.Home.onCreated(function () {
  Session.set('showReactiveTable', null);
});

Template.Home.onRendered(function () {
});

Template.Home.onDestroyed(function () {
});
