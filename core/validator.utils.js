/**
 * find and replace the input name in the error message
 * @param  {String} inputName  [the input name]
 * @param  {String} errMessage [the error message]
 * @return {String}            [the error message after modified]
 */
const generateErrMessage = (inputName, errMessage) => {
  // replace $s with inputName in errMessage
  return errMessage.replace("$s", inputName);
};

/**
 * generate error body
 * @param errMessage
 * @returns {Object}
 */
const generateError = (errMessage) => {
  return errMessage;
};

/**
 * get all matched keys against filter
 * @param obj
 * @param filter
 * @returns {Array}
 */
const filteredKeys = (obj, filter) => {
  // remove $ from filter
  filter = filter.replace('$.', '');
  const keys = Object.keys(obj);
  const result = [];
  for (const key of keys) {
    if (match(key, filter)) {
      result.push(key);
    }
  }

  return result;
};

/**
 * remove special chars from the keys and replace with the actual chars
 * @param role
 * @param inputs
 * @returns {Array}
 */
const normalizeInput = (role, inputs) => {
  const arr = [];
  if (role.indexOf('$') > -1) {
    const keysLength = filteredKeys(inputs, role).length;
    for (let i = 0; i < keysLength; i++) {
      arr.push(role.replace("$", i));
    }
  } else {
    arr.push(role);
  }

  return arr;
};

/**
 * check if key matches a filter
 * @param key
 * @param filter
 * @returns {boolean}
 */
const match = (key, filter) => {
  const filterArr = filter.split('');
  for (const filterAr of filterArr) {
    const index = key.indexOf(filterAr);
    if (index > -1) {
      key = key.substr(index);
    } else {
      return false;
    }
  }
  return true;
};

/**
 * flatten all Inputs with new keys
 * @param inputs
 */
const flattenInputs = (inputs) => {
  const toReturn = {};

  for (const i in inputs) {
    if (!inputs.hasOwnProperty(i)) {
      continue;
    }

    toReturn[i] = inputs[i];
    if (typeof inputs[i] === 'object') {
      const flatObject = flattenInputs(inputs[i]);
      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + '.' + x] = flatObject[x];
      }
    }
  }

  return toReturn;
};

/**
 * parse user roles and generate userRoles Object
 * @param roles
 */
const parseUserRoles = (roles) => {
  const userRoles = {};
  for (const roleName in roles) {
    userRoles[roleName] = [];
    for (const role of roles[roleName]) {
      const parseRole = role.split(':');
      const options = (parseRole[1] || '').split(',');

      userRoles[roleName].push({
        name: parseRole[0],
        options
      });
    }
  }

  return userRoles;
};

module.exports = {
  generateErrMessage,
  generateError,
  normalizeInput,
  match,
  flattenInputs,
  parseUserRoles
};
