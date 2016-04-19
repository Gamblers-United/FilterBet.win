export function dec2US(myDec) {
  var myUS;
  myDec = parseFloat(myDec);
  if (myDec <= 1 || isNaN(myDec)) {
    myUS = NaN;
  } else if (myDec < 2) {
    myUS = -100 / (myDec - 1);
  } else {
    myUS = (myDec - 1) * 100;
  }
  return (myUS > 0 ? "+" : "") + Math.round(myUS * 100) / 100;
}

export function exact2US(exact) {
  var myUS;
  if (exact >= 0.5)
    myUS = -(100 * exact) / (1 - exact);
  else
    myUS = (100 - 100 * exact) / exact;
  return (myUS > 0 ? "+" : "") + Math.round(myUS * 100) / 100;
}


export function US2dec(myUS) {
  var myDec;
  myUS = parseFloat(myUS);
  if (Math.abs(myUS) < 100 || isNaN(myUS)) {
    myDec = NaN;
  } else if (myUS > 0) {
    myDec = 1 + myUS / 100;
  } else {
    myDec = 1 - 100 / myUS;
  }
  return myDec.toFixed(4);
}

export function US2exact(myUS) {
  myUS = parseFloat(myUS);
  if (myUS >= 100) {
    return 100 / ( myUS + 100 )
  }
  if (myUS < 100) {
    return ( Math.abs(myUS) ) / ( Math.abs(myUS) + 100 )
  }
  return NaN;
}

export function dec2frac(dec) {
  dec = parseFloat(dec - 1);
  var myBestFrac = Math.round(dec) + "/" + 1;
  var myBestFracVal = Math.round(dec);
  var myBestErr = Math.abs(myBestFracVal - dec);
  for (let i = 2; i <= 200; i++) {
    var myFracVal = Math.round(dec * i) / i;
    var myErr = Math.abs(myFracVal - dec);
    if (myErr < myBestErr) {
      myBestFrac = Math.round(dec * i) + "/" + i;
      myBestFracVal = myFracVal;
      if (myErr == 0) break;
      myBestErr = myErr;
    }
  }
  return (myBestFrac);
}

export function frac2dec(frac) {
  var myArr = frac.split(/\//);
  myArr[1] = myArr[1] == undefined ? 1 : myArr[1];
  return ((myArr[0] / myArr[1] + 1).toFixed(4));
}

export function frac2exact(frac) {
  let myArr = frac.split(/\//);
  let numerator = parseFloat(myArr[0]);
  let denominator = parseFloat(myArr[1]);
  return denominator / (numerator + denominator);
}

export function exact2frac(x, d) {
  var y = calculatePercentToFraction(x, d);
  var v = _formatFraction(y[0], y[1]);
  return v[0] + '/' + v[1];
}


function calculatePercentToFraction(x, d) {
  if (!(d > 0)) {
    d = 1;
  }
  var y = (d - (d * x)) / x;
  return [y, d];
}

function _formatFraction(y, d) {
  if (y < 1 && y > 0) {
    d = 1 / y;
    y = 1;
  }
  if (y < 0) {
    d = -y;
    y = 1;
  }
  return [y, d];
}

export function prob2dec(prob) {
  return (1 / fmtNumber(prob)).toFixed(4);
}

export function dec2prob(dec) {
  return fmtPercent(1 / dec);
}

export function dec2exact(dec) {
  return 1 / dec;
}

export function HK2dec(myHK) {
  var myDec;
  myHK = parseFloat(myHK);
  if (myHK <= 0 || isNaN(myHK)) {
    myDec = NaN;
  } else {
    myDec = (myHK + 1);
  }
  return myDec.toFixed(4);
}

export function dec2HK(myDec) {
  var myHK;
  myDec = parseFloat(myDec);
  if (myDec <= 1 || isNaN(myDec)) {
    myHK = NaN;
  } else {
    myHK = (myDec - 1);
  }
  return myHK.toFixed(4);
}

export function Indo2dec(myIndo) {
  var myDec;
  myIndo = parseFloat(myIndo);
  if (isNaN(myIndo) || Math.abs(myIndo) < 1) {
    myDec = NaN;
  } else if (myIndo >= 1) {
    myDec = (myIndo + 1);
  } else {
    myDec = 1 - 1 / myIndo;
  }
  return myDec.toFixed(4);
}

export function dec2Indo(myDec) {
  var myIndo;
  myDec = parseFloat(myDec);
  if (myDec <= 1 || isNaN(myDec)) {
    myIndo = NaN;
  } else if (myDec >= 2) {
    myIndo = (myDec - 1);
  } else {
    myIndo = 1 / (1 - myDec);
  }
  return myIndo.toFixed(4);
}

export function Malay2dec(myMalay) {
  var myDec;
  myMalay = parseFloat(myMalay);
  if (isNaN(myMalay) || myMalay > 1 || myMalay == 0) {
    myDec = NaN;
  } else if (myMalay > 0) {
    myDec = (myMalay + 1);
  } else {
    myDec = 1 - 1 / myMalay;
  }
  return myDec.toFixed(4);
}

export function dec2Malay(myDec) {
  var myMalay;
  myDec = parseFloat(myDec);
  if (myDec <= 1 || isNaN(myDec)) {
    myMalay = NaN;
  } else if (myDec <= 2) {
    myMalay = (myDec - 1);
  } else {
    myMalay = 1 / (1 - myDec);
  }
  return myMalay.toFixed(4);
}

export function fmtNumber(myString) {
  myString = "" + myString;
  myString = myString.replace(/\$/g, "");
  myNum = myString.replace(/\,/g, "");
  if (myString.match(/\%$/g, "")) {
    myNum = myString.replace(/\%$/g, "")
    mynum = parseFloat(myNum) / 100;
  }
  return (1 * myNum);
}

export function fmtPercent(myNum) {
  if (("" + myNum).match(/\%$/g, "")) {
    myNum = myNum.replace(/\%$/g, "");
    myNum /= 100;
  }
  return (((myNum * 100).toFixed(2)) + "%");
}
