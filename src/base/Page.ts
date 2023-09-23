import Version from "./Version";
import Response from "../http/response";
import RestException from "./RestException";

export interface ReachResponsePayload {
  [key: string]: any;
  page: number;
  pageSize: number;
  totalPages: number,
  outOfPageRange: boolean;
}

interface Solution {
  [name: string]: any;
}

export default class Page<
  TVersion extends Version,
  TPayload extends ReachResponsePayload,
  TResource,
  TInstance
> {
  nextPageUrl?: string;
  previousPageUrl?: string;
  instances: TInstance[];
  _version: TVersion;
  _payload: TPayload;
  _solution: Solution;
  _url: string;

  /**
   *
   * Base page object to maintain request state.
   *
   * @param version - A Reach version instance
   * @param response - The http response
   * @param solution - path solution
   */
  constructor(
    url: string,
    version: TVersion,
    response: Response<string | TPayload>,
    solution: Solution
  ) {
    this._url = url;

    let payload = this.processResponse(response);
    this._version = version;
    this._payload = payload;
    this._solution = solution;

    this.nextPageUrl = this.getNextPageUrl();
    this.previousPageUrl = this.getPreviousPageUrl();
    this.instances = this.loadInstances(this.loadPage(payload));
  }

  /**
   * Meta keys returned in a list request
   *
   * @constant META_KEYS
   */
  static META_KEYS: string[] = [
    "outOfPageRange",
    "page",
    "pageSize",
    "totalPages",
    "page",
  ];

  /**
   * Get the url of the previous page of records
   *
   * @returns url of the previous page, or undefined if the
   * previous page URI/URL is not defined.
   */
  getPreviousPageUrl(): string | undefined {
    
    let currentPage = 0;
    let pageSize = 1;
    if("page" in this._payload){
      currentPage = this._payload.page;
    }
    if("pageSize" in this._payload){
      pageSize = this._payload.pageSize;
    }

    if (currentPage > 0) {
      // jshint ignore:line
      let query = "pageSize="+pageSize+"&page="+(currentPage-1);
      let url = new URL(this._url);
      if(!((url.search == null) || (url.search.length==0))){
          query = url.search + "&" + query;
      }
      url.search = query;
      
      return url.href; // jshint ignore:line
    }

    return undefined;
  }

  /**
   * Get the url of the next page of records
   *
   * @returns url of the next page, or undefined if the
   * next page URI/URL is not defined.
   */
  getNextPageUrl(): string | undefined {
    let currentPage = 0;
    let pageSize = 1;
    let outOfPageRange = true;
    let totalPages = 1;
    if("page" in this._payload){
      currentPage = this._payload.page;
    }
    if("pageSize" in this._payload){
      pageSize = this._payload.pageSize;
    }
    if("outOfPageRange" in this._payload){
      outOfPageRange = this._payload.outOfPageRange;
    }
    if("totalPages" in this._payload){
      totalPages = this._payload.totalPages;
    }

    if (!(outOfPageRange || (currentPage + 1 >= totalPages))) {
      // jshint ignore:line
      let query = "pageSize="+pageSize+"&page="+(currentPage+1);
      let url = new URL(this._url);
      if(!((url.search == null) || (url.search.length==0))){
          query = url.search + "&" + query;
      }
      url.search = query;
      
      return url.href; // jshint ignore:line
    }

    return undefined;
  }

  /**
   * Build a new instance given a json payload
   *
   * @param payload - Payload response from the API
   * @returns instance of a resource
   */
  getInstance(payload: any): TInstance {
    throw new Error(
      "Page.get_instance() must be implemented in the derived class"
    );
  }

  /**
   * Load a list of records
   *
   * @param resources - json payload of records
   * @returns list of resources
   */
  loadInstances(resources: TResource[]): TInstance[] {
    let instances: TInstance[] = [];
    resources.forEach((resource) => {
      instances.push(this.getInstance(resource));
    });
    return instances;
  }

  /**
   * Fetch the next page of records
   *
   * @returns promise that resolves to next page of results,
   * or undefined if there isn't a nextPageUrl undefined.
   */
  nextPage():
    | Promise<Page<TVersion, TPayload, TResource, TInstance>>
    | undefined {
    if (!this.nextPageUrl) {
      return undefined;
    }

    var reqPromise = this._version._domain.reach.request({
      method: "get",
      uri: this.nextPageUrl,
    });

    var nextPagePromise: Promise<
      Page<TVersion, TPayload, TResource, TInstance>
    > = reqPromise.then(
      function (this: any, response: any) {
        return new this.constructor(this._url, this._version, response, this._solution);
      }.bind(this)
    );

    return nextPagePromise;
  }

  /**
   * Fetch the previous page of records
   *
   * @returns promise that resolves to previous page of
   * results, or undefined if there isn't a previousPageUrl undefined.
   */
  previousPage():
    | Promise<Page<TVersion, TPayload, TResource, TInstance>>
    | undefined {
    if (!this.previousPageUrl) {
      return undefined;
    }

    var reqPromise = this._version._domain.reach.request({
      method: "get",
      uri: this.previousPageUrl,
    });

    var prevPagePromise: Promise<
      Page<TVersion, TPayload, TResource, TInstance>
    > = reqPromise.then(
      function (this: any, response: any) {
        return new this.constructor(this._url, this._version, response, this._solution);
      }.bind(this)
    );

    return prevPagePromise;
  }

  /**
   * Parse json response from API
   *
   * @param response - API response
   *
   * @throws Error If non 200 status code is returned
   *
   * @returns json parsed response
   */
  processResponse(response: Response<string | TPayload>): TPayload {
    if (response.statusCode !== 200) {
      throw new RestException(response);
    }

    if (typeof response.body === "string") {
      return JSON.parse(response.body);
    }
    return response.body;
  }

  /**
   * Load a page of records
   *
   * @param  {object} payload json payload
   * @return {array} the page of records
   */
  loadPage(payload: TPayload): TResource[] {
    if (payload?.meta?.key) {
      return payload[payload.meta.key];
    }

    const keys = Object.keys(payload).filter(
      (key: string) => !Page.META_KEYS.includes(key)
    );
    if (keys.length === 1) {
      return payload[keys[0]];
    }else if(keys.length === 2){
    	let key1 = keys[0].length > keys[1].length ? keys[1] : keys[0];
    	let key2 = keys[0].length > keys[1].length ? keys[0] : keys[1];
    	let key3 = "total" + key1[0].toUpperCase() + key1.substring(1);
    	if(key3 == key2){
    	    return payload[key1];
    	}    	
    }

    throw new Error("Page Records cannot be deserialized");
  }

  forOwn(
    obj: object,
    iteratee: (val: any, key: string, object: object) => void
  ) {
    obj = Object(obj);
    for (const [key, val] of Object.entries(obj)) {
      iteratee(val, key, obj);
    }
  }

  toJSON(): object {
    const clone: Record<string, any> = {};
    this.forOwn(this, (value, key) => {
      if (!key.startsWith("_") && typeof value !== "function") {
        clone[key] = value;
      }
    });
    return clone;
  }
}
