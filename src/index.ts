import IReach from "./rest/Reach";
import * as webhooks from "./webhooks/webhooks";
import IRequestClient from "./base/RequestClient";
import type { ClientOpts as IClientOpts } from "./base/BaseReach";

// Shorthand to automatically create a RestClient
function ReachSDK(
  apiUser?: string,
  apiKey?: string,
  opts?: IClientOpts
): ReachSDK.Reach {
  return new ReachSDK.Reach(apiUser, apiKey, opts);
}

namespace ReachSDK {
  // Main functional components of the Reach module
  export type Reach = IReach;
  export const Reach = IReach;
  export type RequestClient = IRequestClient;
  export const RequestClient = IRequestClient;
  // Setup webhook helper functionality
  export type validateBody = typeof webhooks.validateBody;
  export const validateBody = webhooks.validateBody;
  export type validateRequest = typeof webhooks.validateRequest;
  export const validateRequest = webhooks.validateRequest;
  export type validateRequestWithBody = typeof webhooks.validateRequestWithBody;
  export const validateRequestWithBody = webhooks.validateRequestWithBody;
  export type validateExpressRequest = typeof webhooks.validateExpressRequest;
  export const validateExpressRequest = webhooks.validateExpressRequest;
  export type validateIncomingRequest = typeof webhooks.validateIncomingRequest;
  export const validateIncomingRequest = webhooks.validateIncomingRequest;
  export type getExpectedBodyHash = typeof webhooks.getExpectedBodyHash;
  export const getExpectedBodyHash = webhooks.getExpectedBodyHash;
  export type getExpectedReachSignature =
    typeof webhooks.getExpectedReachSignature;
  export const getExpectedReachSignature = webhooks.getExpectedReachSignature;
  export type webhook = typeof webhooks.webhook;
  export const webhook = webhooks.webhook;
  // Export the client options type for convenience
  export type ClientOpts = IClientOpts;
}

// Public module interface is a function, which passes through to RestClient constructor
export = ReachSDK;
