import {
  checkOddsConsistency
} from '/client/collections/checks_local_methods.js';


/*****************************************************************************/
/* Step2: Event Handlers */
/*****************************************************************************/
Template.Step2.events({
});

/*****************************************************************************/
/* Step2: Helpers */
/*****************************************************************************/
Template.Step2.helpers({
  showProcessingTitle: () => Template.instance().processingTitle.get(),
  showProcessingBody: () => Template.instance().processingBody.get(),
  reactiveTableSettings: function () {
    let check = ChecksCollection.findOne(Session.get('activeCheck'));
    let collection = _.zip(check.oddsChecked, check.oddsAverages);
    return {
      collection: collection,
      showFilter: false,
      showNavigation: 'auto',
      fields: [
        {key: '0.asOriginalInput', label: 'Odds'},
        {key: '0.asPercentage', label: 'Implied Probability'},
        {key: '0.asTruthier', label: 'Truthier Probability', fn: (value) => value ? showAsPercentage(value) : ''},
        // {key: 'asFlbAdjusted', label: 'FLB-adjusted Probability', fn: (value) => value ? showAsPercentage(value) : ''}
        {key: '1.asTruthier', label: 'Average Truthier Probability', fn: (value) => value ? showAsPercentage(value) : ''},
      ]
    }
  },
  isSubmitButtonEnabled: function() {
    instance = Template.instance();
    _dep.depend();

    let checks = ChecksCollection.findOne(Session.get('activeCheck'));
    if (checks.oddsAverages.every((odd) => odd.isValidFormat)) {
      if (checkOddsConsistency(checks)) {
        let overround = checks.oddsAverages.reduce((memo, num) => memo + num.asExact, 0);
        if (overround >= 1 && overround < 2) {

          for (let i = 0; i<checks.oddsAverages.length; i++)
          {
            let exact = checks.oddsAverages[i].asExact;
            let location = 'oddsAverages.' + i + '.asTruthier';
            var objectForSet = {};
            objectForSet[location] = exact / overround;
            ChecksCollection.update(
              {_id: Session.get('activeCheck')},
              {$set: objectForSet});
          }

          let urs = checks.oddsChecked[0].asTruthier;
          let avg = checks.oddsAverages[0].asTruthier;
          let difference = avg - urs;
          let difference_percentual = showAsPercentage(difference);
          let vigorish = Session.get('CurrentVigorish');
          let vigorish_percentual = showAsPercentage(vigorish);
          instance.processingTitle.set(`Difference between truthier percentages: ${difference_percentual}; Vigorish: ${vigorish_percentual}`);
          if (difference < 0)
            instance.processingBody.set('Bad bet is bad. You should be able to find other bookmakers that offer much better odds for this event. Never place bets such as this.');
          else if (difference < 0.01)
            instance.processingBody.set("The difference between the truthier odds that you're getting and the average doesn't give you a solid fail-safe net. Place this bet only if the vigorish is under 2%!");
          else {
            let message = "The difference between the truthier odds that you're getting and the average is good enough.";
            if (vigorish >= 0.04)
              message += " It still can't be recommended to place this bet though because the vigorish is too high."
            else
              message += " The vigorish is also acceptable therefore you may place this bet. Good luck!"
            instance.processingBody.set(message);
            if (vigorish < 0.04)
              return '';
          }
        }
      }
    }
    return 'disabled';
  }
});

/*****************************************************************************/
/* Step2: Lifecycle Hooks */
/*****************************************************************************/
Template.Step2.onCreated(function () {
  let instance = this;

  instance.processingTitle = new ReactiveVar(null);
  instance.processingBody = new ReactiveVar(null);
});

Template.Step2.onRendered(function () {
  this.$('input:first').focus();
  _dep.changed();
});

Template.Step2.onDestroyed(function () {
});
