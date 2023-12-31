/*
 * This code was generated by
 *  ___ ___   _   ___ _  _    _____ _   _    _  ___   ___      _   ___ ___      ___   _   ___     ___ ___ _  _ ___ ___    _ _____ ___  ___ 
 * | _ \ __| /_\ / __| || |__|_   _/_\ | |  | |/ | \ / / |    /_\ | _ ) __|___ / _ \ /_\ |_ _|__ / __| __| \| | __| _ \  /_\_   _/ _ \| _ \
 * |   / _| / _ \ (__| __ |___|| |/ _ \| |__| ' < \ V /| |__ / _ \| _ \__ \___| (_) / _ \ | |___| (_ | _|| .` | _||   / / _ \| || (_) |   /
 * |_|_\___/_/ \_\___|_||_|    |_/_/ \_\____|_|\_\ |_| |____/_/ \_\___/___/    \___/_/ \_\___|   \___|___|_|\_|___|_|_\/_/ \_\_| \___/|_|_\
 * 
 * Reach Messaging API
 * Reach SMS API helps you add robust messaging capabilities to your applications.  Using this REST API, you can * send SMS messages * track the delivery of sent messages * schedule SMS messages to send at a later time * retrieve and modify message history
 *
 * NOTE: This class is auto generated by OpenAPI Generator.
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import ApiBase from "../ApiBase";
import Version from "../../base/Version";
import { MessagingItemListInstance } from "./messaging/messagingItem";

export default class Messaging extends Version {
  /**
   * Initialize the Messaging version of Api
   *
   * @param domain - The Reach (Reach.Api) domain
   */
  constructor(domain: ApiBase) {
    super(domain, "rest");
  }

  /** messagingItems - { Reach.Api.Messaging.MessagingItemListInstance } resource */
  protected _messagingItems?: MessagingItemListInstance;

  /** Getter for messagingItems resource */
  get messagingItems(): MessagingItemListInstance {
    this._messagingItems = this._messagingItems || MessagingItemListInstance(this);
    return this._messagingItems;
  }

}
