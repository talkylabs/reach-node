var Reach = require("../lib");

var apiUser = process.env.REACH_TALKYLABS_API_USER;
var apiKey = process.env.REACH_TALKYLABS_API_KEY;

// Uncomment the following line to specify a custom CA bundle for HTTPS requests:
// process.env.REACH_TALKYLABS_CA_BUNDLE = '/path/to/cert.pem';
// You can also set this as a regular environment variable outside of the code

var reach = new Reach(apiUser, apiKey);

var i = 0;
// Callback as second parameter
reach.messaging.messagingItems.each({
  pageSize: 7,
  callback: function (item, done) {
    console.log(item.messageId);
    i++;
    if (i === 10) {
      done();
    }
  },
  done: function (error) {
    console.log("je suis fini");
    console.log(error);
  },
});

// Callback as first parameter
reach.messaging.messagingItems.each(function (item) {
  console.log(item.messageId);
});

var src = process.env.REACH_TALKYLABS_FROM_NUMBER;
var dest = process.env.REACH_TALKYLABS_TO_NUMBER;

// Send message using callback
reach.messaging.messagingItems.send(
  {
    src: src,
    dest: dest,
    body: "create using callback",
  },
  function (err, result) {
    console.log("Created message using callback");
    console.log(result.messageId);
    console.log(err);
  }
);

// Send message using promise
var promise = reach.messaging.messagingItems.send({
  src: src,
  dest: dest,
  body: "create using promises",
});
promise.then(function (message) {
  console.log("Created message using promises");
  console.log(message.messageId);
});

// List messages using callbacks
reach.messaging.messagingItems.list(function (err, messages) {
  console.log("Listing messages using callbacks");
  messages.forEach(function (message) {
    console.log(message.messageId);
  });
});

// List messages using promises
promise = reach.messaging.messagingItems.list();
promise.then(function (messages) {
  console.log("Listing messages using promises");
  messages.forEach(function (message) {
    console.log(message.messageId);
  });
});
