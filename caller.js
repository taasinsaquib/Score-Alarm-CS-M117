const accountSid = 'ACa40a4e5471f5220af6abdcd9f63ea5d7';
const authToken = '0cba251ab67c497068956624b89d2465';
const Twilio = require('twilio');
const client = new Twilio(accountSid, authToken);

// Format of number string:
// +{Country Code}{Number}
// Example: +14088321289
exports.make_call = function(number, cb) {
  cb = cb || function(a){};
  client.api.calls
    .create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: number,
      from: '+14082146770',
    })
    .then(call => cb(call));
}
