import RestException from "../../../src/base/RestException";

describe("exception gets created from string", function () {
  it("should test serialize without details", function () {
    const response = {
      statusCode: 200,
      body: '{"errorMessage":"test", "errorCode":81022,"more_info": "more_info here"}',
    };

    const exception = new RestException(response);
    expect(exception.status).toEqual(200);
    expect(exception.message).toEqual("test");
    expect(exception.code).toEqual(81022);
    expect(exception.moreInfo).toEqual(
      "more_info here"
    );
  });
  it("should test serialize from improper json string", function () {
    const response = {
      statusCode: 200,
      body: '{errorMessage":test", "errorCode:81022,"more_info": "more_info here"}',
    };
    const exception = new RestException(response);
    expect(exception.status).toEqual(200);
    expect(exception.message).toEqual(
      `[HTTP ${response.statusCode}] Failed to execute request`
    );
    expect(exception.code).toEqual(undefined);
    expect(exception.moreInfo).toEqual(undefined);
  });
});

describe("exception gets created from json error", function () {
  it("should create exception without details", function () {
    const response = {
      statusCode: 200,
      body: {
        errorMessage: "test",
        errorCode: 81022,
        more_info: "more_info here",
      },
    };

    var exception = new RestException(response);
    expect(exception.status).toEqual(200);
    expect(exception.message).toEqual("test");
    expect(exception.code).toEqual(81022);
    expect(exception.moreInfo).toEqual(
      "more_info here"
    );
    expect(exception.details).toEqual(undefined);
  });

  it("should create exception with details", function () {
    const details = {
      foo: "bar",
    };

    const response = {
      statusCode: 200,
      body: {
        errorMessage: "test",
        errorCode: 81022,
        more_info: "more_info here",
        errorDetails: details,
      },
    };

    const exception = new RestException(response);
    expect(exception.details).toEqual(details);
  });
});
