# Expat

Fork of express v4 to support async-await middleware. The idea is to have this around until express natively supports async-await. I think this will [land in v5](https://github.com/expressjs/express/issues/3277#issuecomment-292996093) (I can't guarantee because I'm not involved at all).

```js
const expat = require('expat');
const app = expat();

app.get('/', async (request, response) {
  const account = await getAccount();

  response.json({
    account,
  });
});

app.listen(process.env.PORT || 3000);
```

## Installation

```bash
$ npm install expat
```

## Quick Explanation

If your middleware return truthy (`.then` isn't checked explicitly), promise handling kicks in. It wraps the return value in `Promise.resolve` and calls `next(err)` if the promise is rejected. If the promise is rejected but no error is specified, an unknown error is created (else next would be called as if the next route needs to continue).

The promise is not used for the flow control, so you still need to call `next()`, `next('route')`, or `next(error)` if you want to or have to.

Having promise support means `await next()` would make sense to do, just like in [Koa](https://www.npmjs.com/package/koa), but that's not implemented (yet).
