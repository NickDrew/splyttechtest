/**
 * Extracts function parameter names from provided function and returns them as an array of strings
 *
 * There is a potential falure point here. Some edge cases for function patterns and
 * complex arguments will break this. Need to consider either expanding the logic to
 * cover additional edge cases or an alternate approach to this entire task.
 */
const getFuncArgNames = (func) => {
  const funcStr = func.toString();
  const isArrowNotation = funcStr.match(/\(?[^]*?\)?\s*=>/);
  if (isArrowNotation) {
    return isArrowNotation[0]
      .replace(/[()\s]/gi, '')
      .replace('=>', '')
      .split(',');
  }
  const match = funcStr.match(/\([^]*?\)/);
  return match ? match[0].replace(/[()\s]/gi, '').split(',') : [];
};

/**
 * Takes an array of argument names and an object containing argument default values.
 * Returns a hashmap of default values, with values missing a default set to undefined
 * eg [ a, b, c ] and { b:1, c:2 } will return { a:undefined, b:1, c:2 }
 */
const buildDefaultArgsHash = (argNames, defaultVals) => {
  const parHash = {};
  argNames.forEach((parName) => {
    parHash[parName] = defaultVals[parName];
  });
  return parHash;
};

/**
 * Takes an array of argument names and an objects containing argument old and new
 * default values.
 * Returns a hashmap of default values, with old defaults overwitten by new defaults
 * eg [ a, b, c ]  { a:undefined b:1, c:2 } { a:undfined, b:undefined, c:4} will return { a:undefined, b:1, c:4 }
 */
const mergeDefaultArgsHash = (argNames, oldHash, newHash) => {
  argNames.forEach((parName) => {
    if (newHash[parName]) oldHash[parName] = newHash[parName];
  });
  return oldHash;
};

/**
 * Takes an array of arguments and a hashmap of default values and combines them to
 * return a merged argument array.
 * eg [ 1, 2 ] and { a:undefined, b:6, c:4 } will return [ 1, 2, 4 ]
 */
const generateMergedArgArray = (args, parHash) => {
  const mergedArgArray = Object.values(parHash);
  args.forEach((value, index) => {
    if (value) mergedArgArray[index] = value;
  });
  return mergedArgArray;
};

/**
 *  Checks if this is a func already generated by defaultArguments
 * */
const isClosuredFunc = (func) => {
  if (func.defaultArguments && func.defaultArguments.argNames) {
    return true;
  }
  return false;
};

/**
 * Takes a function and an object containing default values and returns a closure function
 * that wraps the original function and maintains access to the defaults.
 *
 * There is a potential failure point here caused by the provided function
 * having a defaultArguments parameter appended by some other process. To reduce the likelyhood
 * of this to acceptable levels, the name of the storage parameter has been set to match this
 * functions name and is checked when calling this function repeatedly.
 *
 * Assumes that func and defaultVals have already been validated
 */
const defaultArguments = (func, defaultVals) => {
  let argNames = [];
  let oldHash;

  // Either generate defaults, or use pre-generated values if this is re-calling a wrapped func.
  if (isClosuredFunc(func)) {
    argNames = func.defaultArguments.argNames;
    oldHash = func.defaultArguments.defaultsHash;
    func = func.defaultArguments.func; // Use the stored original func to prevent an eventual stack overflow
  } else {
    argNames = getFuncArgNames(func);
  }

  let defaultsHash = buildDefaultArgsHash(argNames, defaultVals);

  if (oldHash) {
    // Merge the previous defaults with the new
    defaultsHash = mergeDefaultArgsHash(argNames, oldHash, defaultsHash);
  }

  // Create the closure
  const closuredFunc = (...vals) => {
    const argArray = generateMergedArgArray(vals, defaultsHash);
    return func(...argArray);
  };

  // Append the argNames to the closure to allow future iterative wrapping
  closuredFunc.defaultArguments = { argNames, defaultsHash, func };

  return closuredFunc;
};

module.exports.defaultArguments = defaultArguments;
