/**
 * https://document.microcms.io/manual/limitations#h1eb9467502
 */

import { createClient } from "microcms-js-sdk";
import PromiseThrottle from "promise-throttle";
import { assertNever } from "../utils";

const _client = createClient({
  serviceDomain: "kakei",
  apiKey: "8776cc24ae7a4f5591f453280dbef748fe56",
});

const getThrottle = new PromiseThrottle({
  requestsPerSecond: 60,
});
const writeThrottle = new PromiseThrottle({
  requestsPerSecond: 5,
});

const handler: ProxyHandler<typeof _client> = {
  get: (target, action: keyof typeof _client) => (args: any) => {
    switch (action) {
      case "get":
      case "getList":
      case "getListDetail":
      case "getObject": {
        return getThrottle.add(() => target[action](args));
      }
      case "create":
      case "update": {
        return writeThrottle.add(() => target[action](args));
      }
      case "delete": {
        return writeThrottle.add(() => target[action](args));
      }
      default: {
        return assertNever(action);
      }
    }
  },
};

const client = new Proxy(_client, handler);

export default client;
