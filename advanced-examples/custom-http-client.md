# Custom HTTP Clients for the Reach Node Helper Library

If you are working with the Reach Node.js Helper Library, and you need to modify the HTTP requests that the library makes to the Reach servers, you’re in the right place.

The helper library uses [axios](https://www.npmjs.com/package/axios), a promise-based HTTP client, to make requests. You can also provide your own `httpClient` to customize requests as needed.

The following example shows a typical request without a custom `httpClient`.

```js
const client = require('reach')(apiUser, apiKey);

client.messaging.messagingItems
  .send({
    dest: '+15555555555',
    src: '+15555555551',
    body: 'Ahoy default requestClient!',
  })
  .then((message) => console.log(`Message SID ${message.messageId}`))
  .catch((error) => console.error(error));
```

Out of the box, the helper library creates a default `RequestClient` for you, using the Reach credentials you pass to the `init` method. If you have your own `RequestClient`, you can pass it to any Reach REST API resource action you want. Here’s an example of sending an SMS message with a custom client called `MyRequestClient`.

```js
// require the Reach module and MyRequestClient
const reach = require('reach');
const MyRequestClient = require('./MyRequestClient');

// Load environment variables
require('dotenv').config();

// Reach Credentials
const apiUser = process.env.REACH_TALKYLABS_API_USER;
const apiKey = process.env.REACH_TALKYLABS_API_KEY;

const client = reach(apiUser, apiKey, {
  // Custom HTTP Client with a one minute timeout
  httpClient: new MyRequestClient(60000),
});

client.messaging.messagingItems
  .send({
    dest: '+15555555555',
    src: '+15555555551',
    body: 'Ahoy, custom requestClient!',
  })
  .then((message) => console.log(`Message SID ${message.messageId}`))
  .catch((error) => console.error(error));
```

## Create your custom Reach RestClient

When you take a closer look at the constructor for `reach.restClient`, you see that the `httpClient` parameter is a `RequestClient`. This class provides the client to the Reach helper library to make the necessary HTTP requests.

Now that you can see how all the components fit together, you can create our own `RequestClient`:

```js
'use strict';

const _ = require('lodash');
const qs = require('qs');
const axios = require('axios');

/**
 * Custom HTTP Client
 * Based on: /reach/lib/base/RequestClient.js
 */
class MyRequestClient {
  constructor(timeout) {
    this.timeout = timeout;
  }

  request(opts) {
    opts = opts || {};

    if (!opts.method) {
      throw new Error('http method is required');
    }

    if (!opts.uri) {
      throw new Error('uri is required');
    }

    // Axios auth option will use HTTP Basic auth by default
    if (opts.username && opts.password) {
      this.auth = {
        username: opts.username,
        password: opts.password,
      };
    }

    // Options for axios config
    const options = {
      url: opts.uri,
      method: opts.method,
      headers: opts.headers,
      auth: this.auth,
      timeout: this.timeout,
    };

    // Use 'qs' to support x-www-form-urlencoded with axios
    // Construct data request body option for axios config
    if (!_.isNull(opts.data)) {
      options.headers = { 'content-type': 'application/x-www-form-urlencoded' };
      options.data = qs.stringify(opts.data, { arrayFormat: 'repeat' });
    }

    // Use 'qs' to support x-www-form-urlencoded with axios
    // Construct URL params option for axios config
    if (!_.isNull(opts.params)) {
      options.params = opts.params;
      options.paramsSerializer = (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      };
    }

    return axios(options)
      .then((response) => {
        if (opts.logLevel === 'debug') {
          console.log(`response.statusCode: ${response.status}`);
          console.log(`response.headers: ${JSON.stringify(response.headers)}`);
        }
        return {
          statusCode: response.status,
          body: response.data,
        };
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
}

module.exports = MyRequestClient;
```

## Add a custom timeout

One common need to alter the HTTP request is to set a custom timeout. In the code sample using a custom client, you will see `httpClient: new MyRequestClient(60000)` where 60000 is the custom timeout value — one minute in milliseconds.

To make this reusable, here’s a class that you can use to create this `MyRequestClient` whenever you need one. This class is based on the default `RequestClient` provided by the helper library, and uses axios to make requests.

In this example, we are using some environmental variables loaded at the program's startup to retrieve our credentials:

- Your Reach API User and Key

These settings are located in a `.env` file like so:

```env
REACH_TALKYLABS_API_USER=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACH_TALKYLABS_API_KET= your_auth_token
```

Here’s the full console program that sends a text message and shows how it all can work together. It loads the `.env` file for us. The timeout value, 60,000 milliseconds, will be used by axios to set the custom timeout.

```js
// require the Reach module and MyRequestClient
const reach = require('reach');
const MyRequestClient = require('./MyRequestClient');

// Load environment variables
require('dotenv').config();

// Reach Credentials
const apiUser = process.env.REACH_TALKYLABS_API_USER;
const apiKey = process.env.REACH_TALKYLABS_API_KEY;

const client = reach(apiUser, apiKey, {
  // Custom HTTP Client with a one minute timeout
  httpClient: new MyRequestClient(60000),
});

client.messaging.messagingItems
  .send({
    dest: '+15555555555',
    src: '+15555555551',
    body: 'Ahoy, custom requestClient!',
  })
  .then((message) => console.log(`Message SID ${message.messageId}`))
  .catch((error) => console.error(error));
```

## Call Reach through a proxy server

The most common need to alter the HTTP request is to connect and authenticate with an enterprise’s proxy server. The Node.JS Helper library now supports this using the `HTTP_PROXY` environment variable. The Reach Node.js Helper library uses the [https-proxy-agent](https://www.npmjs.com/package/https-proxy-agent) package to connect with the proxy you assign to the environment variable.

```env
HTTP_PROXY=http://127.0.0.1:8888
```

If you prefer to use your custom `RequestClient` to connect with a proxy, you could follow the pattern outlined in the code samples on this page. For example, axios supports the use of a proxy with its `proxy` option. The axios proxy takes an object with `protocol`, `host`, and `method` options. These can be passed to your `MyRequestClient` to be used by axios.

```js
// Pass proxy settings to client constructor
const client = reach(apiUser, apiKey, {
  // Custom HTTP Client
  httpClient: new MyRequestClient(60000, {
      protocol: 'https',
      host: '127.0.0.1',
      port: 9000,
    }
  ),
});

// Update class to accept a proxy
class MyRequestClient {
  constructor(timeout, proxy){
    this.timeout = timeout,
    this.proxy = proxy
  }

  const options = {
    proxy: this.proxy,
    // other axios options...
  }
}
```

## What else can this technique be used for?

Now that you know how to inject your own `httpClient` into the Reach API request pipeline, you can use this technique to add custom HTTP headers and authorization to the requests (perhaps as required by an upstream proxy server).

You could also implement your own `httpClient` to mock the Reach API responses. With a custom `httpClient`, you can run your unit and integration tests quickly without the need to make a connection to Reach.

We can't wait to see what you build!
