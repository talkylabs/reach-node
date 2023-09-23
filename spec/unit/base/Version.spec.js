import Version from "../../../src/base/Version";
import Holodeck from "../../integration/holodeck";
import Response from "../../../src/http/response";
import Reach from "../../../src";

describe("fetch method", function () {
  it("should not throw an exception on 3xx status code", function (done) {
    const body = { test: true };
    const version = new Version(
      {
        request: () => Promise.resolve({ statusCode: 307, body }),
      },
      {}
    );

    version.fetch({}).then((response) => {
      expect(response).toBeDefined();
      expect(response).toEqual(body);
      done();
    });
  });

  it("should throw an exception if status code >= 400", function (done) {
    const body = { errorMessage: "invalid body" };
    const version = new Version(
      {
        request: () => Promise.resolve({ statusCode: 400, body }),
      },
      null
    );

    version.fetch({}).catch((error) => {
      expect(error).toBeDefined();
      expect(error.status).toEqual(400);
      expect(error.message).toEqual(body.errorMessage);
      done();
    });
  });
});

describe("streaming results", function () {
  let holodeck;
  let client;
  const bodyOne = {
    messages: [{ body: "payload0" }, { body: "payload1" }],
    page: 0,
    pageSize: 2,
    totalMessages: 5,
    totalPages: 3,
    outOfPageRange: false,
  };
  const bodyTwo = {
    messages: [{ body: "payload2" }, { body: "payload3" }],
    page: 1,
    pageSize: 2,
    totalMessages: 5,
    totalPages: 3,
    outOfPageRange: false,
  };
  const bodyThree = {
    messages: [{ body: "payload4" }],
    page: 2,
    pageSize: 2,
    totalMessages: 5,
    totalPages: 3,
    outOfPageRange: true,
  };

  beforeEach(function () {
    holodeck = new Holodeck();
    client = new Reach("ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", "AUTHTOKEN", {
      httpClient: holodeck,
    });
  });

  it("streams all results", function (done) {
    holodeck.mock(new Response(200, bodyOne));
    holodeck.mock(new Response(200, bodyTwo));
    holodeck.mock(new Response(200, bodyThree));
    client.api.messaging.messagingItems.list()
      .then((messages) => {
        expect(messages.length).toEqual(5);
      });
    done();
  });

  it("limits results", function (done) {
    holodeck.mock(new Response(200, bodyOne));
    holodeck.mock(new Response(200, bodyTwo));
    holodeck.mock(new Response(200, bodyThree));
    client.api.messaging.messagingItems.list({ limit: 3 })
      .then((messages) => {
        expect(messages.length).toEqual(3);
      });
    done();
  });
});

describe("done should only be called once in each", () => {
  let holodeck;
  let client;
  let body;

  beforeEach(function () {
    holodeck = new Holodeck();
    client = new Reach("ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", "AUTHTOKEN", {
      httpClient: holodeck,
    });
    body = {     
      messages: [{}],
      page: 0,
      pageSize: 1,
      totalMessages: 1,
      totalPages: 2,
      outOfPageRange: false,
    };
  });

  it("done is explicitly called", async () => {
    holodeck.mock(new Response(200, body));
    holodeck.mock(new Response(200, body));
    const mockDone = jest.fn(console.debug.bind(null, "done!"));
    client.api.messaging.messagingItems.each({
        limit: 1,
        callback: (account, done) => {
          done();
        },
        done: mockDone,
      });

    // Sleep to allow async work to complete
    await new Promise((r) => setTimeout(r, 2000));

    expect(mockDone.mock.calls.length).toBe(1);
  });

  it("done is not explicitly called", async () => {
    holodeck.mock(new Response(200, body));
    holodeck.mock(new Response(200, body));
    const mockDone = jest.fn(console.debug.bind(null, "done!"));
    client.api.messaging.messagingItems.each({
        limit: 1,
        callback: (account, done) => {
          console.log();
        },
        done: mockDone,
      });

    // Sleep to allow async work to complete
    await new Promise((r) => setTimeout(r, 2000));

    expect(mockDone.mock.calls.length).toBe(1);
  });
});

describe("each method", function () {
  let holodeck;
  let client;
  const bodyOne = {
    messages: [{ body: "payload0" }, { body: "payload1" }],
    page: 0,
    pageSize: 2,
    totalMessages: 5,
    totalPages: 3,
    outOfPageRange: false,
  };
  const bodyTwo = {
    messages: [{ body: "payload2" }, { body: "payload3" }],
    page: 1,
    pageSize: 2,
    totalMessages: 5,
    totalPages: 3,
    outOfPageRange: false,
  };
  const bodyThree = {
    messages: [{ body: "payload4" }],
    page: 2,
    pageSize: 2,
    totalMessages: 5,
    totalPages: 3,
    outOfPageRange: true,
  };

  beforeEach(function () {
    holodeck = new Holodeck();
    client = new Reach("ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", "AUTHTOKEN", {
      httpClient: holodeck,
    });
  });

  it("should call user callback foreach resource instance", function (done) {
    let mockCallback = jest.fn();
    holodeck.mock(new Response(200, bodyOne));
    holodeck.mock(new Response(200, bodyTwo));
    holodeck.mock(new Response(200, bodyThree));

    client.api.messaging.messagingItems.each({
        done: () => {
          expect(mockCallback).toHaveBeenCalledTimes(5);
          expect(mockCallback.mock.calls[0][0].body).toBe("payload0");
          expect(mockCallback.mock.calls[1][0].body).toBe("payload1");
          expect(mockCallback.mock.calls[2][0].body).toBe("payload2");
          expect(mockCallback.mock.calls[3][0].body).toBe("payload3");
          expect(mockCallback.mock.calls[4][0].body).toBe("payload4");
          done();
        },
        callback: mockCallback,
      });
  });

  it("should call user callback with a done function argument", function (done) {
    let mockCallback = jest.fn();
    holodeck.mock(new Response(200, bodyOne));

    client.api.messaging.messagingItems.each({
        limit: 1,
        done: () => {
          expect(mockCallback).toHaveBeenCalledTimes(1);
          expect(mockCallback.mock.calls[0][1]).toBeInstanceOf(Function);
          done();
        },
        callback: mockCallback,
      });
  });

  it("should call user done with an error if user callback throws an error", function (done) {
    let mockError = new Error("An error occurred.");
    let mockCallback = jest.fn(() => {
      throw mockError;
    });
    holodeck.mock(new Response(200, bodyOne));
    holodeck.mock(new Response(200, bodyTwo));
    holodeck.mock(new Response(200, bodyThree));

    client.api.messaging.messagingItems.each({
        limit: 3,
        done: (error) => {
          expect(mockCallback).toHaveBeenCalledTimes(1);
          expect(error).toBe(mockError);
          done();
        },
        callback: mockCallback,
      });
  });

  it("should resolve promise after looping through each resource instance", function (done) {
    let mockCallback = jest.fn();
    holodeck.mock(new Response(200, bodyOne));
    holodeck.mock(new Response(200, bodyTwo));
    holodeck.mock(new Response(200, bodyThree));

    client.api.messaging.messagingItems.each({
        callback: mockCallback,
      })
      .then(() => {
        expect(mockCallback).toHaveBeenCalledTimes(5);
        done();
      });
  });

  it("should resolve promise if an error occurs and user done function executes successfully", function (done) {
    let mockCallback = jest.fn(() => {
      throw new Error("An error occurred.");
    });
    let mockDone = jest.fn();
    holodeck.mock(new Response(200, bodyOne));
    holodeck.mock(new Response(200, bodyTwo));
    holodeck.mock(new Response(200, bodyThree));

    client.api.messaging.messagingItems.each({
        limit: 3,
        callback: mockCallback,
        done: mockDone,
      })
      .then(() => {
        expect(mockDone).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it("should reject promise with error if an error occurs and user done function is not provided", function (done) {
    let mockError = new Error("An error occurred.");
    let mockCallback = jest.fn(() => {
      throw mockError;
    });
    holodeck.mock(new Response(200, bodyOne));
    holodeck.mock(new Response(200, bodyTwo));
    holodeck.mock(new Response(200, bodyThree));

    client.api.messaging.messagingItems.each({
        limit: 3,
        callback: mockCallback,
      })
      .catch((e) => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(e).toBe(mockError);
        done();
      });
  });

  it("should reject promise with error if an error occurs in user done function", function (done) {
    let mockCallback = jest.fn(() => {
      throw new Error("An error occurred in callback fn.");
    });
    let mockError = new Error("An error occurred in done fn.");
    let mockDone = jest.fn((error) => {
      throw mockError;
    });
    holodeck.mock(new Response(200, bodyOne));
    holodeck.mock(new Response(200, bodyTwo));
    holodeck.mock(new Response(200, bodyThree));

    client.api.messaging.messagingItems.each({
        limit: 3,
        callback: mockCallback,
        done: mockDone,
      })
      .catch((e) => {
        expect(mockDone).toHaveBeenCalledTimes(1);
        expect(e).toBe(mockError);
        done();
      });
  });

  it("should short-circuit foreach loop if user callback done argument is called", function (done) {
    let mockCallback = jest.fn((instance, done) => {
      done();
    });
    let mockDone = jest.fn();
    holodeck.mock(new Response(200, bodyOne));
    holodeck.mock(new Response(200, bodyTwo));
    holodeck.mock(new Response(200, bodyThree));

    client.api.messaging.messagingItems.each({
        limit: 3,
        callback: mockCallback,
        done: mockDone,
      })
      .then(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockDone).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it("should short-circuit foreach loop and pass an error if user callback done argument is called with an error", function (done) {
    let mockError = new Error("An error occurred.");
    let mockCallback = jest.fn((instance, done) => {
      done(mockError);
    });
    holodeck.mock(new Response(200, bodyOne));
    holodeck.mock(new Response(200, bodyTwo));
    holodeck.mock(new Response(200, bodyThree));

    client.api.messaging.messagingItems.each({
        limit: 3,
        callback: mockCallback,
        done: (error) => {
          expect(mockCallback).toHaveBeenCalledTimes(1);
          expect(error).toBe(mockError);
          done();
        },
      });
  });
});
