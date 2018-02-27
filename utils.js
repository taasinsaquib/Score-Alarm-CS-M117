exports.generateXML = (msg) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${msg}</Say>
</Response>`;
}

// Changes every time ngrok is run
exports.BASE_URL = 'https://a9b96f3f.ngrok.io';
