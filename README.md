## Making calls with Twilio

Phone number string format: `'+{Country Code}{Number}'`

Callback response is a Twilio CallInstance object that has various call information. Callback is optional.

```javascript
var caller = require('./caller.js');

caller.make_call('+140883231289', 'This is a test call!', response => {
  console.log(response);
});
```

The number you provide will be called and the message will be said aloud.

### Running Twilio with Node.js locally

The server should be running before calling `make_call` because the server provides the XML that Twilio uses to create custom messages. But Twilio won't be able to reach localhost, so use `ngrok` to expose the server to the public internet:

```
./ngrok http 3000
```

Then copy the 'Forwarding' https address into the `BASE_URL` string in utils.js so that Twilio connects to the right server. The address changes every time ngrok is run, so you have to do this every time. Kind of annoying but it should work.


## Running the iOS Frontend

1. Make sure all image assets are imported into your local project. 
2. Don't commit anything in the frontend-iOS/frontend-ios.xcodeproj/ folder as this leads to nasty merge conflicts.
3. Run pod install if needed (no pods yet)
