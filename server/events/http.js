'use strict';

import { OK, BAD_REQUEST, ERROR } from '../constants';
import Promise from 'bluebird';

export function Response(cb) {
  var toCode = (status) => {
    switch(status) {
      case OK:
        return 200;
      case BAD_REQUEST:
        return 422;
      case ERROR:
      default:
        return 500;
    }
  };

  return (status = OK, body = "") => {
    var code = toCode(status);
    if(code.toString().match(/^2[0-9]{2}$/)) {
      cb(null, body);
    } else {
      cb(new Error(`[${code}] Error: "${body}"`));
    }
  };
}

export function Wrap(req, ...params) {
  return (ev, ctx, fn) => { new req(ev, ctx, fn).perform(...params) }
};

class Request {
  constructor(event, context, cb) {
    this.event = event;
    this.context = context;
    this.cb = Response(cb);
  }

  get headers() {
    return this.event.headers
  }

  get path() {
    return this.event.path;
  }
}

export default Request;
