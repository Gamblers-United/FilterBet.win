/*****************************************************************************/
/* Step4: Event Handlers */
/*****************************************************************************/
Template.Step4.events({
});

/*****************************************************************************/
/* Step4: Helpers */
/*****************************************************************************/
Template.Step4.helpers({
  reactiveTableSettings: function () {
    return {
      collection: ChecksCollection.findOne(Session.get('activeCheck')).oddsChecked,
      showFilter: false,
      showNavigation: 'auto',
      fields: [
        {key: 'asOriginalInput', label: 'Odds'},
        {key: 'asPercentage', label: 'Implied Probability'},
        {key: 'asTruthier', label: 'Truthier Probability', fn: (value) => value ? showAsPercentage(value) : ''},
        // {key: 'asFlbAdjusted', label: 'FLB-adjusted Probability', fn: (value) => value ? showAsPercentage(value) : ''}
      ]
    }
  }
});

/*****************************************************************************/
/* Step4: Lifecycle Hooks */
/*****************************************************************************/
Template.Step4.onCreated(function () {
});

Template.Step4.onRendered(function () {
  this.$('input:first').focus();
});

Template.Step4.onDestroyed(function () {
});
