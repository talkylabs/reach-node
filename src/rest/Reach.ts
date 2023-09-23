/*
 * This code was generated by
 *  ___ ___   _   ___ _  _    _____ _   _    _  ___   ___      _   ___ ___      ___   _   ___     ___ ___ _  _ ___ ___    _ _____ ___  ___ 
 * | _ \ __| /_\ / __| || |__|_   _/_\ | |  | |/ | \ / / |    /_\ | _ ) __|___ / _ \ /_\ |_ _|__ / __| __| \| | __| _ \  /_\_   _/ _ \| _ \
 * |   / _| / _ \ (__| __ |___|| |/ _ \| |__| ' < \ V /| |__ / _ \| _ \__ \___| (_) / _ \ | |___| (_ | _|| .` | _||   / / _ \| || (_) |   /
 * |_|_\___/_/ \_\___|_||_|    |_/_/ \_\____|_|\_\ |_| |____/_/ \_\___/___/    \___/_/ \_\___|   \___|___|_|\_|___|_|_\/_/ \_\_| \___/|_|_\
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator.
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Client, ClientOpts, RequestOpts } from "../base/BaseReach";
import Api from "./Api";
import Messaging from "./api/Messaging";
import Authentix from "./api/Authentix";

/* jshint ignore:start */
/**
 * Reach Client to interact with the Rest API
 */
/* jshint ignore:end */

class Reach extends Client {
  _api?: Api;

  /* jshint ignore:start */
  /**
   * Creates a new instance of Reach Client
   *
   * @param username -
   *          The username used for authentication. This is normally account sid, but if using key/secret auth will be the api key sid.
   * @param password -
   *          The password used for authentication. This is normally auth token, but if using key/secret auth will be the secret.
   * @param opts - The options argument
   *
   * @returns A new instance of Reach client
   */
  /* jshint ignore:end */
  constructor(username?: string, password?: string, opts?: ClientOpts) {
    super(username, password, opts);

    if (this.opts?.lazyLoading === false) {
      this.api;
    }
  }

  //Domains
  /** Getter for (Reach.Api) domain */
  get api(): Api {
    return this._api ?? (this._api = new (require("./Api"))(this));
  }

  /** Getter for (Reach.Api.Messaging) version */
  get messaging(): Messaging {
    return this.api.messaging;
  }
  
  /** Getter for (Reach.Api.Authentix) version */
  get authentix(): Authentix {
    return this.api.authentix;
  }
}

namespace Reach {
  export interface RequestClientOptions extends ClientOpts {}
  export interface RequestOptions extends RequestOpts {}
}

export = Reach;
