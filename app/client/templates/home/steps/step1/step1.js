import {
  updateCommission,
  applyCommission,
  checkOddsConsistency
} from '/client/collections/checks_local_methods.js';

global._dep = new Deps.Dependency();

/*****************************************************************************/
/* Step1: Event Handlers */
/*****************************************************************************/
Template.Step1.events({
  'click #js-add-outcome': () => ChecksCollection.update(
    {_id: Session.get('activeCheck')},
    {$push: {oddsChecked: emptyOdds, oddsAverages: emptyOdds, oddsCompeting: emptyOdds}}),
  'click #js-remove-outcome': () => ChecksCollection.update(
    {_id: Session.get('activeCheck')},
    {$pop: {oddsChecked: 1, oddsAverages: 1, oddsCompeting: 1}}),
  'click #reset': function (event, template) {
    reset();
    $('#container-data-processing-step1').hide();
    template.processingTitle.set(null);
  },
  'focus #commission': function (event) {
    event.target.select()
  },
  'change #commission': function (event, template) {
    var value = event.currentTarget.value;
    value = value.replace('%', '');
    if (value.substr(0, 2) !== '0.')
      value = value.replace(/^[0]+/g, "")
    if (event.keyCode == 8)
      value = value.slice(0, -1);
    let valueFloat = parseFloat(value);
    isNaN(valueFloat) ? updateCommission('oddsChecked', 0) : updateCommission('oddsChecked', valueFloat);
    if (value === '')
      value = '0%';
    else
      value += '%';
    template.$('#commission').val(value);
    setCaretToPos(template.$('#commission')[0], value.length - 1);
  },
  'click .dropdown-menu li a': function (event, template) {
    var action = $(event.currentTarget).text();

    if (action == 'Apply Commission') {
      applyCommission('oddsChecked');
    }
    else {
      let commission = ({
          Matchbook: 1.5,
          Betfair: 5,
          Smarkets: 2,
          BETDAQ: 5,
          Betsson: 4,
        })[action] || 0;

      updateCommission('oddsChecked', parseFloat(commission));
      $('#commission').val(commission += '%')
    }
  }
});


/*****************************************************************************/
/* Step1: Helpers */
/*****************************************************************************/
Template.Step1.helpers({
  showProcessingTitle: () => Template.instance().processingTitle.get(),
  showProcessingBody: () => Template.instance().processingBody.get(),
  isResetButtonDisabled: () => ChecksCollection.findOne({
    _id: Session.get('activeCheck'),
    'oddsChecked.asOriginalInput': {$gt: ''}
  }) ? '' : 'disabled',
  isRemoveButtonDisabled: () => ChecksCollection.findOne({
    _id: Session.get('activeCheck'),
    oddsChecked: {$size: 2}
  }) ? 'disabled' : '',
  isNextButtonEnabled: function () {
    instance = Template.instance();
    _dep.depend();
    let checks = ChecksCollection.findOne(Session.get('activeCheck'));
    if (checks.oddsChecked.every((odd) => odd.isValidFormat)) {
      if (checkOddsConsistency(checks)) {
        let overround = checks.oddsChecked.reduce((memo, num) => memo + num.asExact, 0);
        if (overround >= 1 && overround < 1.1) {
          $('#commission-group').fadeIn(1000, "linear");
          shownNotifications.map((notificationId) => Notifications.remove({_id: notificationId}));
          // step1_data_processing(checks, percentage);
          
          let vigorish = (overround - 1) / overround;
          Session.set('CurrentVigorish', vigorish);
          let vigorish_percentual = showAsPercentage(vigorish);
          let overround_percentual = showAsPercentage(overround - 1);
          let return_of_investment_percentual = showAsPercentage(1 - vigorish);
          let vigorish_color = 'DarkRed';
          let affiliate_text = `The bookmaker's theoretical hold (aka vigorish) is ${vigorish_percentual}. This means that in the long run, for every such bet you would only get ${return_of_investment_percentual} of your stake back.`;
          vigorish *= 100;

          if (vigorish > 4)
            affiliate_text = "These odds are quite bad and you might be using a bad sportsbook. If you're not doing it already," +
              ' create an account with <a target="_blank" style="color: blue" href="https://wlpinnaclesports.adsrv.eacdn.com/C.ashx?btag=a_12455b_9203c_&affid=13477&siteid=12455&adid=9203">a real bookmaker like Pinnacle</a> and' +
              ' read <a target="_blank" style="color: blue" href="http://gamblers-united.com/best-online-sportsbook-bodog-vegas-sportsbook-review-sports-betting/">here</a>' +
              ' or <a target="_blank" style="color: blue" href="http://gamblers-united.com/best-bookmakers/">here</a> why it is the best. If you are from a country not allowed on Pinnacle (for example USA), the best option I can think of is <a target="_blank" style="color: blue" href="http://partners.commission.bz/processing/clickthrgh.asp?btag=a_40247b_4">BetOnline</a>.';
          if (vigorish > 5)
            affiliate_text = "The best punters in the world wouldn't make a profit with such odds and you're probably not one of them if you even consider such a bad offer." +
              ' Create an account with <a target="_blank" style="color: blue" href="https://wlpinnaclesports.adsrv.eacdn.com/C.ashx?btag=a_12455b_9203c_&affid=13477&siteid=12455&adid=9203">a real bookmaker like Pinnacle</a> and' +
              ' read <a target="_blank" style="color: blue" href="http://gamblers-united.com/best-online-sportsbook-bodog-vegas-sportsbook-review-sports-betting/">here</a>' +
              ' or <a target="_blank" style="color: blue" href="http://gamblers-united.com/best-bookmakers/">here</a> why it is the best. If you are from a country not allowed on Pinnacle (for example USA), the best option I can think of is <a target="_blank" style="color: blue" href="http://partners.commission.bz/processing/clickthrgh.asp?btag=a_40247b_4">BetOnline</a>.';
          instance.processingTitle.set(`Vigorish: ${vigorish_percentual}; Overround: ${overround_percentual}`);
          instance.processingBody.set(affiliate_text);
          if (vigorish <= 5) vigorish_color = 'Chocolate';
          if (vigorish <= 4) vigorish_color = 'Goldenrod';
          if (vigorish <= 3) vigorish_color = '#6cb247';
          if (vigorish <= 2) vigorish_color = '#3eb200';
          if (vigorish <= 1) vigorish_color = 'Lime';
          $('#container-data-processing-step1').show();
          $('#container-data-processing-step1').highcharts({
            chart: {
              type: 'pie',
              options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
              }
            },
            title: {
              text: '',
              useHTML: true
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                  enabled: true,
                  format: '{point.name}'
                }
              }
            },
            series: [{
              type: 'pie',
              name: 'Share of your stake',
              data: [
                ['You', 100 - vigorish],
                {
                  name: 'Bookmaker',
                  y: vigorish,
                  sliced: true,
                  selected: true,
                  color: vigorish_color
                }
              ]
            }]
          });

          for (let i = 0; i<checks.oddsChecked.length; i++)
          {
            let exact = checks.oddsChecked[i].asExact;
            let location = 'oddsChecked.' + i + '.asTruthier';
            var objectForSet = {};
            objectForSet[location] = exact / overround;
            ChecksCollection.update(
              {_id: Session.get('activeCheck')},
              {$set: objectForSet});
          }
          
          return '';
        }
      }
    }
    return 'disabled';
  },
  reactiveTableSettings: function () {
    return {
      collection: ChecksCollection.findOne(Session.get('activeCheck')).oddsChecked,
      showFilter: false,
      sortable: false,
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
/* Step1: Lifecycle Hooks */
/*****************************************************************************/
Template.Step1.onCreated(function () {
  let instance = this;
  
  instance.processingTitle = new ReactiveVar(null);
  instance.processingBody = new ReactiveVar(null);
});

Template.Step1.onRendered(function () {
  this.$('input:first').focus();
  _dep.changed();
});

Template.Step1.onDestroyed(function () {
});
