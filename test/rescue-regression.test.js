// Regression test for utile args() out-of-bounds read (NSWG-ECO-445 / HackerOne #321701)
//
// The vulnerable implementation of lib/args.js unconditionally reads args[args.length]
// (always out-of-bounds -> undefined) and unconditionally defines a 'first' property
// even when no arguments are passed. When invoked with zero arguments this triggers
// out-of-bounds reads and defines nonsensical properties.
//
// The patched implementation returns the empty args array as-is when there are no
// arguments, so no 'first', 'last', 'callback', or 'cb' properties are defined.

var assert = require('node:assert');
var utile = require('..');

var args = utile.args((function () { return arguments; })());

// Sanity: args should be an array-like with length 0.
assert.strictEqual(args.length, 0, 'args() with no arguments should have length 0');

// The vulnerable code defines args.first = args[0] (undefined) and reads args[args.length].
// The patched code must NOT define 'first' when there are no arguments.
assert.ok(
  !Object.prototype.hasOwnProperty.call(args, 'first'),
  "args() with no arguments must not define a 'first' property (out-of-bounds read guard)"
);
assert.ok(
  !Object.prototype.hasOwnProperty.call(args, 'last'),
  "args() with no arguments must not define a 'last' property"
);
assert.ok(
  !Object.prototype.hasOwnProperty.call(args, 'callback'),
  "args() with no arguments must not define a 'callback' property"
);
assert.ok(
  !Object.prototype.hasOwnProperty.call(args, 'cb'),
  "args() with no arguments must not define a 'cb' property"
);

// Also verify normal behavior is preserved on a non-empty call so the guard is not overbroad.
var cb = function () {};
var args2 = utile.args((function () { return arguments; })('a', 'b', cb));
assert.strictEqual(args2.first, 'a', "args().first should still work for non-empty invocations");
assert.strictEqual(args2.callback, cb, "args().callback should still be detected for non-empty invocations");

console.log('REGRESSION: utile.args() with zero arguments no longer performs out-of-bounds read / defines bogus first/last/callback properties (NSWG-ECO-445).');
