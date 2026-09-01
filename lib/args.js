/*
 * args.js: function argument parsing helper utility
 *
 * (C) 2011, Charlie Robbins & the Contributors
 * MIT LICENSE
 *
 */

var utile = require('./index');

//
// ### function args(_args)
// #### _args {Arguments} Original function arguments
//
// Top-level method will accept a javascript "arguments" object (the actual keyword
// "arguments" inside any scope), and attempt to return back an intelligent object
// representing the functions arguments
//
module.exports = function (_args) {
  var args = utile.rargs(_args),
      _cb;

  //
  // If there are no arguments, return the empty args array as-is
  // to avoid out-of-bounds reads on args[0] / args[args.length].
  //
  if (!args.length) {
    return args;
  }

  //
  // Find and define the first argument
  //
  Object.defineProperty(args, 'first', { value: args[0] });

  //
  // Find and define any callback. Only access the last element;
  // do NOT read args[args.length] which is always out-of-bounds.
  //
  _cb = args[args.length - 1];
  if (typeof _cb === "function") {
    Object.defineProperty(args, 'callback', { value: _cb });
    Object.defineProperty(args, 'cb', { value: _cb });
    args.pop();
  }

  //
  // Find and define the last argument
  //
  if (args.length) {
    Object.defineProperty(args, 'last', { value: args[args.length - 1] });
  }

  return args;
};
