## Making calls with Twilio

Phone number string format: `'+{Country Code}{Number}'`

Callback response is a Twilio CallInstance object that has various call information. Callback is optional.

```javascript
var caller = require('./caller.js');

caller.make_call('+140883231289', response => {
  console.log(response);
});
```
