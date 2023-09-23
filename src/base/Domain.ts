import { Client as BaseReach, RequestOpts } from "./BaseReach";
import { trim } from "./utility";

/**
 * Base domain object
 */
export default class Domain {
  /**
   * Creates a Domain instance
   *
   * @param reach - A Reach Client
   * @param baseUrl - Base url for this domain
   */
  constructor(public reach: BaseReach, public baseUrl: string) {}

  /**
   * Turn a uri into an absolute url
   *
   * @param uri - uri to transform
   * @returns absolute url
   */
  absoluteUrl(uri?: string): string {
    var result = "";
    if (typeof this.baseUrl === "string") {
      const cleanBaseUrl = trim(this.baseUrl, "/");
      result += cleanBaseUrl;
      result += "/";
    }
    if (typeof uri === "string") {
      uri = trim(uri, "/");
      if (result === "") {
        result += "/";
      }
      result += uri;
    }
    return result;
  }

  /**
   * Make request to this domain
   *
   * @param opts - request options
   * @returns request promise
   */
  request(opts: RequestOpts): Promise<any> {
    return this.reach.request({
      ...opts,
      uri: this.absoluteUrl(opts.uri),
    });
  }
}
