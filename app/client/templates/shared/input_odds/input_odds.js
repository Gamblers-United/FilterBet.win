import {updateOdds, notifyOddsIssues} from '/client/collections/checks_local_methods.js';

/*****************************************************************************/
/* InputOdds: Event Handlers */
/*****************************************************************************/
Template.InputOdds.events({
  'keyup input.form-control': function (event, template) {
    var value = event.target.value;
    var key = template.data.arrayKey;
    var index = template.data.arrayIndex;

    updateOdds(key + '.' + index, value);
  },
  'keydown input.form-control': function (event, template) {
    Meteor.clearTimeout(template.typingTimeout.get());
    template.typingTimeout.set(Meteor.setTimeout(notifyOddsIssues, 1000));
  }
});

/*****************************************************************************/
/* InputOdds: Helpers */
/*****************************************************************************/
Template.InputOdds.helpers({
  label: function () {
    var key = this.arrayKey;
    var index = parseInt(this.arrayIndex);

    if (key == 'oddsChecked') {
      if (index == 0)
        return 'The odds that are being offered for your pick:';
      else if (index == 1)
        return 'The odds offered for the second possible outcome:';
      else if (index == 2)
        return 'The odds for the 3rd outcome (you need this at 1x2):';
      else
        return "Odds for the " + (index + 1) + "th outcome:";
    }
    if (key == 'oddsAverages') {
      if (index == 0)
        return 'Average odds for your pick:';
      else if (index == 1)
        return 'Average odds for the second outcome:';
      else if (index == 2)
        return 'Average odds for the third outcome:';
      else
        return "Average odds for the " + (index + 1) + "th outcome:";
    }
    return '';
  },
  placeholder: function () {
    var key = this.arrayKey;
    var index = parseInt(this.arrayIndex);

    if (key == 'oddsChecked') {
      if (index == 0)
        return 'Any odds style works! Equivalent examples: 4/1   5   +400';
    }
    if (key == 'oddsAverages') {
      if (index == 0)
        return 'Get these from an odds comparison service like betbrain.com or oddsportal.com!';
    }
    return ''
  }
});

/*****************************************************************************/
/* InputOdds: Lifecycle Hooks */
/*****************************************************************************/
Template.InputOdds.onCreated(function () {
  this.typingTimeout = new ReactiveVar(null);
});

Template.InputOdds.onRendered(function () {
});

Template.InputOdds.onDestroyed(function () {
});
