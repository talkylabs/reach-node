import nock from "nock";
import Reach from "../../../src";

describe("client", () => {
  let client;

  describe("initializing", () => {
    it("should use the first arg for the username as well", () => {
      client = new Reach("ACXXXXXXXX", "test-password");
      expect(client.username).toEqual("ACXXXXXXXX");
    });

    it("should use the first arg for the username and the second for password", () => {
      client = new Reach("SKXXXXXXXX", "test-password");
      expect(client.username).toEqual("SKXXXXXXXX");
      expect(client.password).toEqual("test-password");
    });
  });

  
  describe("adding user agent extensions", () => {
    it("sets the user-agent by default", () => {
      const client = new Reach("ACXXXXXXXX", "test-password");
      const scope = nock("https://api.reach.talkylabs.com", {
        reqheaders: {
          "User-Agent":
            /^reach-node\/[0-9.]+(-rc\.[0-9]+)?\s\(\w+\s\w+\)\snode\/[^\s]+$/,
        },
      })
        .get("/")
        .reply(200, "test response");
      return client
        .request({ method: "GET", uri: "https://api.reach.talkylabs.com" })
        .then(() => scope.done());
    });

    it("allows for user-agent extensions", () => {
      const client = new Reach("ACXXXXXXXX", "test-password", {
        userAgentExtensions: [
          "reach-run/2.0.0-test",
          "@reach-labs/plugin-serverless/1.1.0-test",
        ],
      });
      const scope = nock("https://api.reach.talkylabs.com", {
        reqheaders: {
          "User-Agent":
            /^reach-node\/[0-9.]+(-rc\.[0-9]+)?\s\(\w+\s\w+\)\snode\/[^\s]+ (reach-run\/2.0.0-test @reach-labs\/plugin-serverless\/1.1.0-test)$/,
        },
      })
        .get("/")
        .reply(200, "test response");
      return client
        .request({ method: "GET", uri: "https://api.reach.talkylabs.com" })
        .then(() => scope.done());
    });
  });
});
