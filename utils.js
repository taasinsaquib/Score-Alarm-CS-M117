exports.generateXML = (msg) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${msg}</Say>
</Response>`;
}

// Changes every time ngrok is run
exports.BASE_URL = 'https://pacific-scrubland-76368.herokuapp.com';
