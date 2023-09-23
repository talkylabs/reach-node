import reach from "../src/";

var apiUser = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
var apiKey = "token";

describe("reach", function () {
  it("should set the api user and key", function () {
    var client = reach(apiUser, apiKey);
    expect(client.username).toBe(apiUser);
    expect(client.password).toBe(apiKey);
  });

  it("should provide list shorthand alias", function () {
    var client = new reach(apiUser, apiKey);
    expect(client.api.messaging.messagingItems.list).toBeTruthy();
    expect(client.messaging.messagingItems.list).toBeTruthy();
  });

  it("should provide instance shorthand alias", function () {
    var client = new reach(apiUser, apiKey);
    expect(client.api.authentix.configurationItems("CA123").fetch).toBeTruthy();
    expect(client.authentix.configurationItems("CA123").fetch).toBeTruthy();
  });

  it("should provide each for integration", function () {
    var client = new reach.Reach(apiUser, apiKey);
    expect(client.api.messaging.messagingItems.each).toBeTruthy();
  });

  it("should disable HTTP client auto-retry with exponential backoff by default", function () {
    var client = new reach.Reach(apiUser, apiKey);
    expect(client.autoRetry).toBe(false);
    expect(client.httpClient.autoRetry).toBe(false);
  });

  it("should set Reach and HTTP client auto-retry with exponential backoff properties", function () {
    var client = new reach.Reach(apiUser, apiKey, {
      autoRetry: true,
      maxRetries: 5,
    });
    expect(client.autoRetry).toBe(true);
    expect(client.maxRetries).toBe(5);
    expect(client.httpClient.autoRetry).toBe(true);
    expect(client.httpClient.maxRetries).toBe(5);
  });
});
