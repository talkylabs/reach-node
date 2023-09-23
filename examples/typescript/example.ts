import reach from "../../";
import { MessagingItemListInstanceSendOptions } from "../../lib/rest/api/messaging/messagingItem";

const apiUser: string = process.env.REACH_TALKYLABS_API_USER || "";
const apiKey: string = process.env.REACH_TALKYLABS_API_KEY || "";

const client = reach(apiUser, apiKey);

let i: number = 0;
client.messaging.messagingItems.each({
  pageSize: 7,
  callback: (item: any, done: any) => {
    console.log(item.messageId);
    i++;
    if (i === 10) {
      done();
    }
  },
  done: (err: Error) => {
    console.log("je suis fini");
    console.log(err);
  },
});

client.messaging.messagingItems.each({}, (item: any) => {
  console.log(item.messageId);
});

const src = process.env.REACH_TALKYLABS_FROM_NUMBER || "";
const dest = process.env.REACH_TALKYLABS_TO_NUMBER || "";

const msgData: MessagingItemListInstanceSendOptions = {
  dest,
  src,
  body: "create using callback",
};

// Send message using callback
client.messaging.messagingItems.send(msgData, (err: Error, result: any) => {
  console.log("Created message using callback");
  console.log(result.messageId);
});

// Send message using promise
const promise = client.messaging.messagingItems.send({
  src: src,
  dest: dest,
  body: "create using promises",
});
promise.then((message: any) => {
  console.log("Created message using promises");
  console.log(message.messageId);
});


// List messages using callbacks
client.messaging.messagingItems.list({}, (err: Error, messages: any[]) => {
  console.log("Listing messages using callbacks");
  messages.forEach(function (message: any) {
    console.log(message.messageId);
  });
});

// List messages using promises
const promiseMessage = client.messaging.messagingItems.list();
promiseMessage.then((messages: any[]) => {
  console.log("Listing messages using promises");
  messages.forEach(function (message: any) {
    console.log(message.messageId);
  });
});

