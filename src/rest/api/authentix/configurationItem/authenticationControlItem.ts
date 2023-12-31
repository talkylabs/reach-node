/*
 * This code was generated by
 *  ___ ___   _   ___ _  _    _____ _   _    _  ___   ___      _   ___ ___      ___   _   ___     ___ ___ _  _ ___ ___    _ _____ ___  ___ 
 * | _ \ __| /_\ / __| || |__|_   _/_\ | |  | |/ | \ / / |    /_\ | _ ) __|___ / _ \ /_\ |_ _|__ / __| __| \| | __| _ \  /_\_   _/ _ \| _ \
 * |   / _| / _ \ (__| __ |___|| |/ _ \| |__| ' < \ V /| |__ / _ \| _ \__ \___| (_) / _ \ | |___| (_ | _|| .` | _||   / / _ \| || (_) |   /
 * |_|_\___/_/ \_\___|_||_|    |_/_/ \_\____|_|\_\ |_| |____/_/ \_\___/___/    \___/_/ \_\___|   \___|___|_|\_|___|_|_\/_/ \_\_| \___/|_|_\
 * 
 * Reach Authentix API
 *  Reach Authentix API helps you easily integrate user authentification in your application. The authentification allows to verify that a user is indeed at the origin of a request from your application.  At the moment, the Reach Authentix API supports the following channels:    * SMS      * Email   We are continuously working to add additionnal channels. ## Base URL All endpoints described in this documentation are relative to the following base URL: ``` https://api.reach.talkylabs.com/rest/authentix/v1/ ```  The API is provided over HTTPS protocol to ensure data privacy.  ## API Authentication Requests made to the API must be authenticated. You need to provide the `ApiUser` and `ApiKey` associated with your applet. This information could be found in the settings of the applet. ```curl curl -X GET [BASE_URL]/configurations -H \"ApiUser:[Your_Api_User]\" -H \"ApiKey:[Your_Api_Key]\" ``` ## Reach Authentix API Workflow Three steps are needed in order to authenticate a given user using the Reach Authentix API. ### Step 1: Create an Authentix configuration A configuration is a set of settings used to define and send an authentication code to a user. This includes, for example: ```   - the length of the authentication code,    - the message template,    - and so on... ``` A configuaration could be created via the web application or directly using the Reach Authentix API. This step does not need to be performed every time one wants to use the Reach Authentix API. Indeed, once created, a configuartion could be used to authenticate several users in the future.    ### Step 2: Send an authentication code A configuration is used to send an authentication code via a selected channel to a user. For now, the supported channels are `sms`, and `email`. We are working hard to support additional channels. Newly created authentications will have a status of `awaiting`. ### Step 3: Verify the authentication code This step allows to verify that the code submitted by the user matched the one sent previously. If, there is a match, then the status of the authentication changes from `awaiting` to `passed`. Otherwise, the status remains `awaiting` until either it is verified or it expires. In the latter case, the status becomes `expired`. 
 *
 * NOTE: This class is auto generated by OpenAPI Generator.
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { inspect, InspectOptions } from "util";
import Authentix from "../../Authentix";
const deserialize = require("../../../../base/deserialize");
const serialize = require("../../../../base/serialize");
import { isValidPathParam } from "../../../../base/utility";


/**
 * Information related to the digital payment to authenticate. It is required when `usedForDigitalPayment` is true. It is ignored otherwise.
 */
export class PaymentInfo {
  /**
   * The payee of the financial transaction.
   */
  "payee": string;
  /**
   * the amount of the transaction.
   */
  "amount": number;
  /**
   * The currency of the transaction.
   */
  "currency": string;
}



/**
 * Options to pass to check a AuthenticationControlItemInstance
 */
export interface AuthenticationControlItemListInstanceCheckOptions {
  /** The phone number or email being authenticated. Phone numbers must be in E.164 format. Either this parameter or the `authenticationId` must be specified. */
  "dest"?: string;
  /** The 4-10 character string being verified. This is required for `sms` and `email` channels. */
  "code"?: string;
  /** The ID of the authentication being checked. Either this parameter or the to `dest` must be specified. */
  "authenticationId"?: string;
  /** Information related to the digital payment to authenticate. It is required when `usedForDigitalPayment` is true. It is ignored otherwise. It is a stringfied JSON map where keys are `payee`, `amount`, and `currency` and the associated values are respectively the payee, the amount, and the currency of a financial transaction.  */
  "paymentInfo"?: string;
}


export interface AuthenticationControlItemSolution {
  configurationId: string;
}

export interface AuthenticationControlItemListInstance {
  _version: Authentix;
  _solution: AuthenticationControlItemSolution;
  _uri: string;
  



  /**
   * Check a AuthenticationControlItemInstance
   *
   * @param callback - Callback to handle processed record
   *
   * @returns Resolves to processed AuthenticationControlItemInstance
   */
  check(callback?: (error: Error | null, item?: AuthenticationControlItemInstance) => any): Promise<AuthenticationControlItemInstance>;
  /**
   * Check a AuthenticationControlItemInstance
   *
   * @param params - Parameter for request
   * @param callback - Callback to handle processed record
   *
   * @returns Resolves to processed AuthenticationControlItemInstance
   */
  check(params: AuthenticationControlItemListInstanceCheckOptions, callback?: (error: Error | null, item?: AuthenticationControlItemInstance) => any): Promise<AuthenticationControlItemInstance>;


  /**
   * Provide a user-friendly representation
   */
  toJSON(): any;
  [inspect.custom](_depth: any, options: InspectOptions): any;
}

export function AuthenticationControlItemListInstance(version: Authentix, configurationId: string): AuthenticationControlItemListInstance {
  if (!isValidPathParam(configurationId)) {
    throw new Error('Parameter \'configurationId\' is not valid.');
  }

  const instance = {} as AuthenticationControlItemListInstance;

  instance._version = version;
  instance._solution = { configurationId,  };
  instance._uri = `/authentix/v1/configurations/${configurationId}/authentication-controls`;

  instance.check = function check(params?: AuthenticationControlItemListInstanceCheckOptions | ((error: Error | null, items: AuthenticationControlItemInstance) => any), callback?: (error: Error | null, items: AuthenticationControlItemInstance) => any): Promise<AuthenticationControlItemInstance> {
    if (params instanceof Function) {
      callback = params;
      params = {};
    } else {
      params = params || {};
    }

    let data: any = {};

    
        if (params["dest"] !== undefined)
    data["dest"] = params["dest"];
    if (params["code"] !== undefined)
    data["code"] = params["code"];
    if (params["authenticationId"] !== undefined)
    data["authenticationId"] = params["authenticationId"];
    if (params["paymentInfo"] !== undefined)
    data["paymentInfo"] = params["paymentInfo"];


    const headers: any = {};
    headers["Content-Type"] = "application/x-www-form-urlencoded"

    let operationVersion = version,
        operationPromise = operationVersion.check({ uri: instance._uri, method: "post", data, headers });
    
    operationPromise = operationPromise.then(payload => new AuthenticationControlItemInstance(operationVersion, payload, instance._solution.configurationId));
    

    operationPromise = instance._version.setPromiseCallback(operationPromise,callback);
    return operationPromise;


    }

  instance.toJSON = function toJSON() {
    return instance._solution;
  }

  instance[inspect.custom] = function inspectImpl(_depth: any, options: InspectOptions) {
    return inspect(instance.toJSON(), options);
  }

  return instance;
}

interface AuthenticationControlItemPayload extends AuthenticationControlItemResource {}

interface AuthenticationControlItemResource {
  appletId: string;
  apiVersion: string;
  configurationId: string;
  authenticationId: string;
  status: string;
  dest: string;
  channel: string;
  paymentInfo: PaymentInfo;
  dateCreated: Date;
  dateUpdated: Date;
}

export class AuthenticationControlItemInstance {

  constructor(protected _version: Authentix, payload: AuthenticationControlItemResource, configurationId: string) {
    this.appletId = (payload.appletId);
    this.apiVersion = (payload.apiVersion);
    this.configurationId = (payload.configurationId);
    this.authenticationId = (payload.authenticationId);
    this.status = (payload.status);
    this.dest = (payload.dest);
    this.channel = (payload.channel);
    this.paymentInfo = (payload.paymentInfo);
    this.dateCreated = deserialize.iso8601DateTime(payload.dateCreated);
    this.dateUpdated = deserialize.iso8601DateTime(payload.dateUpdated);

  }

  /**
   * The identifier of the applet.
   */
  appletId: string;
  /**
   * The API version.
   */
  apiVersion: string;
  /**
   * The identifier of the configuration.
   */
  configurationId: string;
  /**
   * The identifier of the authentication.
   */
  authenticationId: string;
  /**
   * The outcome of the authentication control.
   */
  status: string;
  /**
   * The phone number or email being verified. Phone numbers must be in E.164 format.
   */
  dest: string;
  /**
   * The channel used.
   */
  channel: string;
  paymentInfo: PaymentInfo;
  /**
   * The date and time in GMT that the authentication was created. 
   */
  dateCreated: Date;
  /**
   * The date and time in GMT that the authentication was last updated. 
   */
  dateUpdated: Date;

  /**
   * Provide a user-friendly representation
   *
   * @returns Object
   */
  toJSON() {
    return {
      appletId: this.appletId,
      apiVersion: this.apiVersion,
      configurationId: this.configurationId,
      authenticationId: this.authenticationId,
      status: this.status,
      dest: this.dest,
      channel: this.channel,
      paymentInfo: this.paymentInfo,
      dateCreated: this.dateCreated,
      dateUpdated: this.dateUpdated,
    }
  }

  [inspect.custom](_depth: any, options: InspectOptions) {
    return inspect(this.toJSON(), options);
  }
}


