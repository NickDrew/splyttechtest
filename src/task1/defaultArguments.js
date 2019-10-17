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

const buildDefaultArgsHash = (argNames, defaultVals) => {
  const parHash = {};
  argNames.forEach((parName) => {
    parHash[parName] = defaultVals[parName];
  });
  return parHash;
};

const mergeDefaultArgsHash = (argNames, oldHash, newHash) => {
  argNames.forEach((parName) => {
    if (newHash[parName]) oldHash[parName] = newHash[parName];
  });
  return oldHash;
};

const generateMergedArgArray = (args, parHash) => {
  const mergedArgArray = Object.values(parHash);
  args.forEach((value, index) => {
    if (value) mergedArgArray[index] = value;
  });
  return mergedArgArray;
};

const isClosuredFunc = (func) => {
  if (func.defaultArguments && func.defaultArguments.argNames) {
    return true;
  }
  return false;
};

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
