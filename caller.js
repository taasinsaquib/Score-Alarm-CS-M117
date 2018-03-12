const accountSid = 'ACa40a4e5471f5220af6abdcd9f63ea5d7';
const authToken = '0cba251ab67c497068956624b89d2465';
const Twilio = require('twilio');
const client = new Twilio(accountSid, authToken);
const utils = require('./utils');

// Format of number string:
// +{Country Code}{Number}
// Example: +14088321289
exports.make_call = function(number, message, cb) {
  cb = cb || function(a){};
  var xmlUrl = `${utils.BASE_URL}/message?msg=${encodeURIComponent(message)}`;
  console.log('XML URL ==> ' + xmlUrl);
  client.api.calls
    .create({
      url: xmlUrl,
      method: 'GET',
      to: number,
      from: '+14082146770',
    })
    .then(call => cb(call));
};

exports.make_sms = function(number, message, cb) {
  cb = cb || function(a){};
  client.messages
    .create({
      messagingServiceSid: 'MGc10a7e860a82bc3f0935929595521075',
      to: number,
      body: message
    })
    .then(message => cb(message));
};
