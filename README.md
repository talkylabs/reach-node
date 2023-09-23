# reach-node

## Documentation

The documentation for the Reach API can be found [here][apidocs].

The Node library documentation can be found [here][libdocs].

## Versions

`reach-node` uses a modified version of [Semantic Versioning](https://semver.org) for all changes. [See this document](VERSIONS.md) for details.

### Supported Node.js Versions

This library supports the following Node.js implementations:

- Node.js 14
- Node.js 16
- Node.js 18

TypeScript is supported for TypeScript version 2.9 and above.

> **Warning**
> Do not use this Node.js library in a front-end application. Doing so can expose your Reach credentials to end-users as part of the bundled HTML/JavaScript sent to their browser.

## Installation

`npm install reach-talkylabs` or `yarn add reach-talkylabs`

### Test your installation

To make sure the installation was successful, try sending yourself an SMS message, like this:

```js
// Your API User and Key from web application
const apiUser = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const apiKey = 'your_auth_token';

const client = require('reach')(apiUser, apiKey);

client.messaging.messagingItems
  .send({
    body: 'Hello from reach-node',
    dest: '+12345678901', // Text your number
    src: '+12345678901', // From a valid number
  })
  .then((message) => console.log(message.messageId));
```

After a brief delay, you will receive the text message on your phone.

> **Warning**
> It's okay to hardcode your credentials when testing locally, but you should use environment variables to keep them secret before committing any code or deploying to production.

## Usage

Check out these [code examples](examples) in JavaScript and TypeScript to get up and running quickly.

### Environment Variables

`reach-node` supports credential storage in environment variables. If no credentials are provided when instantiating the Reach client (e.g., `const client = require('reach')();`), the values in following env vars will be used: `REACH_TALKYLABS_API_USER` and `REACH_TALKYLABS_API_KEY`.

If your environment requires SSL decryption, you can set the path to CA bundle in the env var `REACH_TALKYLABS_CA_BUNDLE`.

### Lazy Loading

`reach-node` supports lazy loading required modules for faster loading time. Lazy loading is enabled by default. To disable lazy loading, simply instantiate the Reach client with the `lazyLoading` flag set to `false`:

```javascript
// Your API User and Key from the web application
const apiUser = process.env.REACH_TALKYLABS_API_USER;
const apiKey = process.env.REACH_TALKYLABS_API_KEY;

const client = require('reach')(apiUser, apiKey, {
  lazyLoading: false,
});
```

### Enable Auto-Retry with Exponential Backoff

`reach-node` supports automatic retry with exponential backoff when API requests receive an Error 429 response. This retry with exponential backoff feature is disabled by default. To enable this feature, instantiate the Reach client with the `autoRetry` flag set to `true`.

Optionally, the maximum number of retries performed by this feature can be set with the `maxRetries` flag. The default maximum number of retries is `3`.

```javascript
const apiUser = process.env.REACH_TALKYLABS_API_USER;
const apiKey = process.env.REACH_TALKYLABS_API_KEY;

const client = require('reach')(apiUser, apiKey, {
  autoRetry: true,
  maxRetries: 3,
});
```

### Iterate through records

The library automatically handles paging for you. Collections, such as `messagingItems`, have `list` and `each` methods that page under the hood. With both `list` and `each`, you can specify the number of records you want to receive (`limit`) and the maximum size you want each page fetch to be (`pageSize`). The library will then handle the task for you.

`list` eagerly fetches all records and returns them as a list, whereas `each` streams records and lazily retrieves pages of records as you iterate over the collection. You can also page manually using the `page` method.

```js
// Your API User and Key from the web application
const apiUser = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const apiKey = 'your_auth_token';
const client = require('reach')(apiUser, apiKey);

client.messaging.messagingItems.each((call) => console.log(call.messageId));
```

### Enable Debug Logging

There are two ways to enable debug logging in the default HTTP client. You can create an environment variable called `REACH_TALKYLABS_LOG_LEVEL` and set it to `debug` or you can set the logLevel variable on the client as debug:

```javascript
cconst apiUser = process.env.REACH_TALKYLABS_API_USER;
const apiKey = process.env.REACH_TALKYLABS_API_KEY;

const client = require('reach')(apiUser, apiKey, {
  logLevel: 'debug',
});
```

You can also set the logLevel variable on the client after constructing the Reach client:

```javascript
const client = require('reach')(apiUser, apiKey);
client.logLevel = 'debug';
```

### Debug API requests

To assist with debugging, the library allows you to access the underlying request and response objects. This capability is built into the default HTTP client that ships with the library.

For example, you can retrieve the status code of the last response like so:

```js
const apiUser = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const apiKey = 'your_auth_token';

const client = require('reach')(apiUser, apiKey);

client.messaging.messagingItems
  .send({
    dest: '+14158675309',
    src: '+14258675310',
    body: 'Ahoy!',
  })
  .then(() => {
    // Access details about the last request
    console.log(client.lastRequest.method);
    console.log(client.lastRequest.url);
    console.log(client.lastRequest.auth);
    console.log(client.lastRequest.params);
    console.log(client.lastRequest.headers);
    console.log(client.lastRequest.data);

    // Access details about the last response
    console.log(client.httpClient.lastResponse.statusCode);
    console.log(client.httpClient.lastResponse.body);
  });
```

### Handle exceptions

If the Reach API returns a 400 or a 500 level HTTP response, `reach-node` will throw an error including relevant information, which you can then `catch`:

```js
client.messaging.messagingItems
  .send({
    body: 'Hello from Node',
    dest: '+12345678901',
    src: '+12345678901',
  })
  .then((message) => console.log(message))
  .catch((error) => {
    // You can implement your fallback code here
    console.log(error);
  });
```

or with `async/await`:

```js
try {
  const message = await client.messaging.messagingItems.send({
    body: 'Hello from Node',
    dest: '+12345678901',
    src: '+12345678901',
  });
  console.log(message);
} catch (error) {
  // You can implement your fallback code here
  console.error(error);
}
```

If you are using callbacks, error information will be included in the `error` parameter of the callback.

400-level errors are normal during API operation ("Invalid number", "Cannot deliver SMS to that number", for example) and should be handled appropriately.

### Use a custom HTTP Client

To use a custom HTTP client with this helper library, please see the [advanced example of how to do so](./advanced-examples/custom-http-client.md).


## Docker image

The `Dockerfile` present in this repository and its respective `talkylabs/reach-node` Docker image are currently used by Talkylabs for testing purposes only.

## Getting help

If you've instead found a bug in the library or would like new features added, go ahead and open issues or pull requests against this repo!

## Contributing

Bug fixes, docs, and library improvements are always welcome. Please refer to our [Contributing Guide](CONTRIBUTING.md) for detailed information on how you can contribute.

> ⚠️ Please be aware that a large share of the files are auto-generated by our backend tool. You are welcome to suggest changes and submit PRs illustrating the changes. However, we'll have to make the changes in the underlying tool. You can find more info about this in the [Contributing Guide](CONTRIBUTING.md).

If you're not familiar with the GitHub pull request/contribution process, [this is a nice tutorial](https://gun.io/blog/how-to-github-fork-branch-and-pull-request/).

### Get started

If you want to familiarize yourself with the project, you can start by [forking the repository](https://help.github.com/articles/fork-a-repo/) and [cloning it in your local development environment](https://help.github.com/articles/cloning-a-repository/). The project requires [Node.js](https://nodejs.org) to be installed on your machine.

After cloning the repository, install the dependencies by running the following command in the directory of your cloned repository:

```bash
npm install
```

You can run the existing tests to see if everything is okay by executing:

```bash
npm test
```

To run just one specific test file instead of the whole suite, provide a JavaScript regular expression that will match your spec file's name, like:

```bash
npm run test:javascript -- -m .\*client.\*
```

[apidocs]: https://www.reach.talkylabs.com/docs/api
[libdocs]: https://talkylabs.github.io/reach-node
