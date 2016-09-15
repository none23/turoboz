var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var all_tours = [];
var upcoming_tours = {};
var data_file = "_data/tours.json";
var upcoming_file = "_data/upcoming.json";
var compl = 0;


// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.json';

// Load client secrets from a local file.
// {{{
fs.readFile('_client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Sheets API.
  authorize(JSON.parse(content), getStrs);
});
// }}}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * {{{
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}
// }}}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * {{{
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}
// }}}

/**
 * Store token to disk be used in later program executions.
 * {{{
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}
// }}}


// Strs {{{
function getStrs(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1xrCjmIHigIbd-NjRhgIF0l5LDO9o5FHmAwdeJpDTtGY',
    range: 'strs',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length === 0) {
      console.log('No data found.');
    } else {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var tourObj = {};

        var tourId = row[0];
        var tourTitle = row[1];
        var tourSubtitle = row[2];
        var tourIntro = row[3];
        var tourSummary = row[4];
        var tourImgpath = row[5];
        var tourLength = row[6];
        var tourHidden = row[7];

        tourObj.tour = tourId;
        tourObj.id = '/tours/' + tourId;
        tourObj.title = tourTitle;
        tourObj.subtitle = tourSubtitle;
        tourObj.intro = tourIntro;
        tourObj.summary = tourSummary;
        tourObj.imgpath = tourImgpath;
        tourObj.tourlength = tourLength;
        tourObj.isHidden = tourHidden;
        tourObj.dates = {};
        tourObj.tags = {};
        tourObj.prices = {};
        tourObj.includes = {};
        tourObj.additionalFees = {};
        tourObj.willLearn = {};
        tourObj.details = {};
        tourObj.blueprint = {};

        all_tours.push(tourObj);
      }
      console.log('first');
      getDates(auth);
      getTags(auth);
      getPrices(auth);
      getIncludes(auth);
      getAdditionalFees(auth);
      getWillLearn(auth);
      getDetails(auth);
      getBlueprint(auth);
      setTimeout(saveJSON, 1000);
    }
  });
}
// }}}
// Tags {{{
function getTags(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1xrCjmIHigIbd-NjRhgIF0l5LDO9o5FHmAwdeJpDTtGY',
    range: 'tags',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length === 0) {
      console.log('No data found.');
    } else {
      console.log('tag');
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var items = [];
        for (var k = 1; k < row.length; k++) {
            items.push(row[k]);
        }
        all_tours[i].tags = items;
      }
      console.log('/tag');
      compl += 1;
    }
  });
}
// }}}
// Dates {{{
function getDates(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1xrCjmIHigIbd-NjRhgIF0l5LDO9o5FHmAwdeJpDTtGY',
    range: 'dates',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length === 0) {
      console.log('No data found.');
    } else {
      console.log('dat');
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var rowId = row[0];
        var unixTimeNow = Math.floor(Date.now() / 1000);
        var excelTimeNow = Math.floor(unixTimeNow / 86400 + 25569);
        var items = [];
        for (var k = 1; k < row.length; k++) {
          if(row[k] >= excelTimeNow){
            items.push(row[k]);
          } else {
            console.log(row[k]);
            console.log(excelTimeNow);
          }
        }
        all_tours[i].dates = items;
        if (items[0]) {
          upcoming_tours[all_tours[i].tour] = items[0];
          //upcoming_tours[i] = items[0];
        }
      }
      //console.log(all_tours);
      console.log('/dat');
      compl += 1;
    }
  });
}
// }}}
// Prices {{{
function getPrices(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1xrCjmIHigIbd-NjRhgIF0l5LDO9o5FHmAwdeJpDTtGY',
    range: 'prices',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length === 0) {
      console.log('No data found.');
    } else {
      console.log('pri');
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var items = [];
        if (row.length > 1) {
          for (var k = 1; k < row.length; k++) {
            items.push(row[k]);
          }
        }
        all_tours[i].prices = items;
      }
      console.log('/pri');
      compl += 1;
    }
  });
}
// }}}
// Includes {{{
function getIncludes(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1xrCjmIHigIbd-NjRhgIF0l5LDO9o5FHmAwdeJpDTtGY',
    range: 'includes',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length === 0) {
      console.log('No data found.');
    } else {
      console.log('inc');
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var items = [];
        if (row.length > 1) {
          for (var k = 1; k < row.length; k++) {
            items.push(row[k]);
          }
        }
        all_tours[i].includes = items;
      }
      console.log('/inc');
      compl += 1;
    }
  });
}
// }}}
// Additional Fees {{{
function getAdditionalFees(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1xrCjmIHigIbd-NjRhgIF0l5LDO9o5FHmAwdeJpDTtGY',
    range: 'additionalFees',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length === 0) {
      console.log('No data found.');
    } else {
      console.log('add');
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var items = [];
        if (row.length > 1) {
          for (var k = 1; k < row.length; k++) {
            items.push(row[k]);
          }
        }
        all_tours[i].additionalFees = items;
      }
      console.log('/add');
      compl += 1;
    }
  });
}
// }}}
// Will Learn {{{
function getWillLearn(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1xrCjmIHigIbd-NjRhgIF0l5LDO9o5FHmAwdeJpDTtGY',
    range: 'willLearn',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length === 0) {
      console.log('No data found.');
    } else {
      console.log('wil');
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var items = [];
        if (row.length > 1) {
          for (var k = 1; k < row.length; k++) {
            items.push(row[k]);
          }
        }
        all_tours[i].willLearn = items;
      }
      console.log('/wil');
      compl += 1;
    }
  });
}
// }}}
// Details {{{
function getDetails(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1xrCjmIHigIbd-NjRhgIF0l5LDO9o5FHmAwdeJpDTtGY',
    range: 'details',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length === 0) {
      console.log('No data found.');
    } else {
      console.log('det');
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var items = [];
        if (row.length > 1) {
          for (var k = 1; k < row.length; k++) {
            items.push(row[k]);
          }
        }
        all_tours[i].details = items;
      }
      console.log('/det');
      compl += 1;
    }
  });
}
// }}}
// Blueprint {{{
function getBlueprint(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1xrCjmIHigIbd-NjRhgIF0l5LDO9o5FHmAwdeJpDTtGY',
    range: 'blueprint',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length === 0) {
      console.log('No data found.');
    } else {
      console.log('blu');
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var items = [];
        if (row.length > 1) {
          for (var k = 1; k < row.length; k++) {
            items.push(row[k]);
          }
        }
        all_tours[i].blueprint = items;
      }
      console.log('/blu');
      compl += 1;
    }
  });
}
// }}}


// Save data to file {{{
function saveJSON() {
    if (compl == 8) {
        var finalObj = {};
        for (var i = 0; i < all_tours.length; ++i ){
            finalObj[all_tours[i].tour] = all_tours[i];
            toursFiles(all_tours[i].tour, all_tours[i].isHidden, all_tours[i].title, all_tours[i].subtitle, all_tours[i].intro, all_tours[i].summary, all_tours[i].imgpath, all_tours[i].tourlength, all_tours[i].tags, all_tours[i].dates, all_tours[i].prices, all_tours[i].includes, all_tours[i].additionalFees, all_tours[i].willLearn, all_tours[i].details, all_tours[i].blueprint);
        }
        var upcoming_four = Object.keys(upcoming_tours).sort(function(a,b){ 
            return upcoming_tours[a] - upcoming_tours[b];
        });
        var upcomingJSON = JSON.stringify(upcoming_four);
        var finalJSON = JSON.stringify(finalObj);
        console.log("printing!");
        fs.writeFile(data_file, finalJSON, 'utf8', function (err){
            if (err) {
                return console.log(err);
            }
        });
        fs.writeFile(upcoming_file, upcomingJSON, 'utf8', function (err){
            if (err) {
                return console.log(err);
            }
        });
    } else {
        console.log("not printing yet");
        setTimeout(saveJSON, 1000);
    }
}
// }}}
// Create index files for each tour {{{
function concatArray (arr, arr_title) {
    var result_str = arr_title + ':\n';
    if (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            var item_str = '  - \'' + arr[i] + '\'\n';
            result_str += item_str;
        }
        return result_str;
    } else {
        return;
    }
}
function toursFiles (id, isHidden, title, subtitle, intro, summary, imgpath, tourlength, tags, dates, prices, includes, additionalFees, willLearn, details, blueprint) {
    if (isHidden == 1 ) {  } else {
        var strsContent = "---\nid: " + id + "\nlayout: tour\npermalink: /tours/" + id + "/\ntitle: '" + title + "'\nsubtitle: '" + subtitle + "'\nintro: '" + intro + "'\nsummary: '" + summary + "'\nimgpath: " + imgpath + "\ntourlength: " + tourlength + "\n";
        var tagsContent            = concatArray(tags,            'tags');
        var datesContent           = concatArray(dates,           'dates');
        var pricesContent          = concatArray(prices,          'prices');
        var includesContent        = concatArray(includes,        'includes');
        var additionalFeesContent  = concatArray(additionalFees,  'additionalFees');
        var willLearnContent       = concatArray(willLearn,       'willLearn');
        var detailsContent         = concatArray(details,         'details');
        var blueprintContent       = concatArray(blueprint,       'blueprint');

        var content = strsContent + tagsContent + datesContent + pricesContent + includesContent + additionalFeesContent + willLearnContent + detailsContent + blueprintContent + '---';
        var cleancontent = content.replace('undefined', '').replace('undefined', '').replace('undefined', '').replace('undefined', '').replace('undefined', '').replace('undefined', '').replace('undefined', '');

        var filename = "_tours/" + id + ".html";
        fs.writeFile(filename, cleancontent, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }
}
// }}}
