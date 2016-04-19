import * as bookmaker from '/lib/gu_sports_betting/gu_odds.js';

export function updateOdds(location, odds) {
  var objectForSet = {};
  objectForSet[location + '.asOriginalInput'] = odds;
  var isValidOddsFormat = false;
  var exact = -1;

  if (odds.length > 0) {
    if (parseFloat(odds) >= 100 && odds.charAt(0) != '+')
      notificationUSonce();
    // if odds is MoneyLine
    if (odds.charAt(0) == '+' || odds.charAt(0) == '-') {
      if (odds.length > 1) {
        objectForSet[location + '.asMoneyline'] = odds;
        objectForSet[location + '.originalInputFormat'] = 'Moneyline';
        exact = bookmaker.US2exact(odds);
        objectForSet[location + '.asExact'] = exact;
        let odds2dec = bookmaker.US2dec(odds);
        objectForSet[location + '.asDecimal'] = odds2dec;
        objectForSet[location + '.asPercentage'] = bookmaker.dec2prob(odds2dec);
        objectForSet[location + '.asFractional'] = bookmaker.dec2frac(odds2dec);
        objectForSet[location + '.asHongKong'] = bookmaker.dec2HK(odds2dec);
        objectForSet[location + '.asIndonesian'] = bookmaker.dec2Indo(odds2dec);
        objectForSet[location + '.asMalay'] = bookmaker.dec2Malay(odds2dec);
      }
    }
    // if odds is Fractional
    else if (odds.search('/') != -1) {
      if (odds.length > 2) {
        objectForSet[location + '.asFractional'] = odds;
        objectForSet[location + '.originalInputFormat'] = 'Fractional';
        exact = bookmaker.frac2exact(odds);
        objectForSet[location + '.asExact'] = exact;
        let odds2dec = bookmaker.frac2dec(odds);
        objectForSet[location + '.asDecimal'] = odds2dec;
        objectForSet[location + '.asPercentage'] = bookmaker.dec2prob(odds2dec);
        objectForSet[location + '.asMoneyline'] = bookmaker.dec2US(odds2dec);
        objectForSet[location + '.asHongKong'] = bookmaker.dec2HK(odds2dec);
        objectForSet[location + '.asIndonesian'] = bookmaker.dec2Indo(odds2dec);
        objectForSet[location + '.asMalay'] = bookmaker.dec2Malay(odds2dec);
      }
    }
    // if odds is Decimal (or the user has not finished typing)
    else {
      objectForSet[location + '.asDecimal'] = odds;
      objectForSet[location + '.originalInputFormat'] = 'Decimal';
      exact = bookmaker.dec2exact(odds);
      objectForSet[location + '.asExact'] = exact;
      objectForSet[location + '.asPercentage'] = bookmaker.dec2prob(odds);
      objectForSet[location + '.asMoneyline'] = bookmaker.dec2US(odds);
      objectForSet[location + '.asFractional'] = bookmaker.dec2frac(odds);
      objectForSet[location + '.asHongKong'] = bookmaker.dec2HK(odds);
      objectForSet[location + '.asIndonesian'] = bookmaker.dec2Indo(odds);
      objectForSet[location + '.asMalay'] = bookmaker.dec2Malay(odds);
    }
  }
  else
    isValidOddsFormat = '';

  if (exact > 0 && exact < 1) {
    isValidOddsFormat = true;
    Session.set('showReactiveTable', true);
  }

  objectForSet[location + '.isValidFormat'] = isValidOddsFormat;
  ChecksCollection.update(
    {_id: Session.get('activeCheck')},
    {$set: objectForSet});

}

export function updateCommission(target, commission) {
  if (target === 'oddsChecked')
    ChecksCollection.update(
      {_id: Session.get('activeCheck')},
      {$set: {commissionOddsChecked: commission / 100}});
  else if (target === 'oddsCompeting')
    ChecksCollection.update(
      {_id: Session.get('activeCheck')},
      {$set: {commissionOddsCompeting: commission / 100}});
}

export function applyCommission(target) {
  var odds = ChecksCollection.findOne(Session.get('activeCheck'));
  if (checkOddsConsistency(odds)) {
    var commission = target == 'oddsChecked' ? odds.commissionOddsChecked : odds.commissionOddsCompeting;
    var targetReference = target == 'oddsChecked' ? odds.oddsChecked : odds.oddsCompeting;
    if (commission > 0 && commission < 100) {
      var format = Session.get('PreferredOddsFormat');
      if (format == 'Decimal') {
        _.each(targetReference, function (odd, index) {
          let currentDecimalOdds = parseFloat(odd.asOriginalInput);
          let newDecimalOdds = (currentDecimalOdds - 1) * (1 - commission) + 1;
          updateOdds(target + '.' + index, newDecimalOdds.toPrecision(10).replace(/\.?0+$/, ""));
        })
      };
      if (format == 'Fractional') {
        _.each(targetReference, function (odd, index) {
          let exactOdds = odd.asExact;
          let newExactOdds = 1 / ((1 / exactOdds - 1) * (1 - commission) + 1);
          updateOdds(target + '.' + index, bookmaker.exact2frac(newExactOdds));
        })
      };
      if (format == 'Moneyline') {
        _.each(targetReference, function (odd, index) {
          let exactOdds = odd.asExact;
          let newExactOdds = 1 / ((1 / exactOdds - 1) * (1 - commission) + 1);
          updateOdds(target + '.' + index, bookmaker.exact2US(newExactOdds));
        })
      }
    }
    else
      shownNotifications.push(Notifications.warn('Invalid value', "The commission has to be higher than 0% and lower than 100%.", {timeout: 8000}));
  }
  else
    shownNotifications.push(Notifications.error('Nope.', "Please write all the odds in the same format. Choose between decimal, fractional and moneyline.", {timeout: 11000}));
}

export function checkOddsConsistency(checks) {
  if (checks.oddsChecked.every((odd) => odd.originalInputFormat == 'Moneyline'))
    Session.set('PreferredOddsFormat', 'Moneyline');
  else if (checks.oddsChecked.every((odd) => odd.originalInputFormat == 'Fractional'))
    Session.set('PreferredOddsFormat', 'Fractional');
  else if (checks.oddsChecked.every((odd) => odd.originalInputFormat == 'Decimal'))
    Session.set('PreferredOddsFormat', 'Decimal');
  else {
    Session.set('PreferredOddsFormat', '');
    return false;
  }
  return true;
}

export function notifyOddsIssues() {
  let checks = ChecksCollection.findOne(Session.get('activeCheck'));

  if ((checks.oddsChecked.filter((odd) => odd.originalInputFormat == 'Fractional').length != 0)
    &&
    (checks.oddsChecked.filter((odd) => odd.originalInputFormat == 'Decimal').length != 0))
    notificationUKonce();

  if (checkOddsConsistency(checks)) {
    var percentage = checks.oddsChecked.reduce((memo, num) => memo + num.asExact, 0);
    if (percentage < 1)
      notificationErrorThrottled('Nope.', "Please check your input. The overround is below 0%, which makes no sense. If you'd be offered such odds, the only sensible thing would be to bet all outcomes and collect the free money.");
    else if (percentage >= 1.1) {
      let overround = (percentage * 100 - 100).toFixed(2) + '%';
      notificationErrorThrottled(`Overround of ${overround} ?`, "You've made a mistake in your input or you're being scammed. Please check. Do not bet at these odds, regardless of your perceived advantage!");
    }
  }
}