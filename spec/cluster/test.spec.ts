jest.setTimeout(15000);

import reach from "reach";

const fromNumber = process.env.REACH_TALKYLABS_FROM_NUMBER;
const toNumber = process.env.REACH_TALKYLABS_TO_NUMBER;
const apiUser = process.env.REACH_TALKYLABS_API_USER;
const apiKey = process.env.REACH_TALKYLABS_API_KEY;
const testClient = reach(apiUser, apiKey);

test("Should send a text", () => {
  return testClient.messaging.messagingItems
    .send({
      body: "hello world",
      dest: toNumber,
      src: fromNumber,
    })
    .then((msg) => {
      expect(msg.messageId).not.toBeUndefined();
      expect(msg.dest).toBe(toNumber);
      expect(msg.src).toBe(fromNumber);
      expect(msg.body).toBe("hello world");
    });
});


