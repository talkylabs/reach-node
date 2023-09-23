import Holodeck from "../../integration/holodeck";
import Response from "../../../src/http/response";
import Reach from "../../../src";

var client;
var holodeck;

describe("IncomingPhoneNumber", function () {
  /* Before Hooks */
  beforeEach(function () {
    holodeck = new Holodeck();
    client = new Reach("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", "AUTHTOKEN", {
      httpClient: holodeck,
    });
  });

  /* Tests */
  it("should call done in the opts object when done", function (done) {
    var body = {      
      messages: [{}],
      page: 0,
      pageSize: 20,
      totalMessages: 1,
      totalPages: 1,
      outOfPageRange: true,
    };
    holodeck.mock(new Response(200, body));
    client.api.messaging.messagingItems.each({ done }, () => null);
  });
  it("should call done when limit in the opts object is reached", function (done) {
    var body = {      
      messages: [{}],
      page: 0,
      pageSize: 1,
      totalMessages: 1,
      totalPages: 1,
      outOfPageRange: true,
    };
    holodeck.mock(new Response(200, body));
    holodeck.mock(new Response(200, body));
    client.api.messaging.messagingItems.each({ limit: 1, done }, () => null);
  });

  it("should call done when using list function", function (done) {
    var body = {      
      messages: [{}],
      page: 0,
      pageSize: 1,
      totalMessages: 1,
      totalPages: 1,
      outOfPageRange: true,
    };
    holodeck.mock(new Response(200, body));
    holodeck.mock(new Response(200, body));
    client.api.messaging.messagingItems.list({ limit: 1 }, done);
  });

  it("should call done when using getPage function", function (done) {
    var body = {      
      messages: [{}],
      page: 0,
      pageSize: 1,
      totalMessages: 1,
      totalPages: 1,
      outOfPageRange: true,
    };
    holodeck.mock(new Response(200, body));
    holodeck.mock(new Response(200, body));
    client.api.messaging.messagingItems.getPage(
        "https://api.reach.talkylabs.com/rest/messaging/v1/list?dest=%2B19876543210&pageSize=1&page=0",
        done
    );
  });
});
