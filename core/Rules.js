/**
 * every Role has a single parameter 'options' contains
 * options.value
 * options.roles
 * options.inputs
 * options.params
 * @return {Promise}
 */
module.exports = {
  /**
   * check if field present in the inputs and it's not undefined or null
   * @param options
   * @returns {Promise<string>}
   */
  required(options) {
    return new Promise((resolve, reject) => {
      if (typeof options.value === 'undefined' || options.value === null) {
        reject("$s is required");
      } else {
        resolve();
      }
    });
  },

  /**
   * mark a field as required only if another field exist or equal value
   * @param options
   * @returns {Promise<string>}
   */
  require_if(options) {
    return new Promise((resolve, reject) => {
      if (options.params.length === 1) {
        // if the another field exist then this field is required
        if (options.inputs[options.params[0]]) {
          options.roles.required({
            value: options.value,
            roles: options.roles,
            inputs: options.inputs,
            params: []
          }).then(() => {
            resolve();
          }, (error) => {
            reject(error);
          });
        } else {
          resolve();
        }
      } else if (options.params.length === 2) {
        // if the another field equal to value then this field is required
        if ( options.inputs[options.params[0]].toString() === options.params[1] ) {
          options.roles.required({
            value: options.value,
            roles: options.roles,
            inputs: options.inputs,
            params: []
          }).then(() => {
            resolve();
          }, (error) => {
            reject(error);
          });
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    });
  },

  /**
   * check if the field is string if it present
   * @param options
   * @returns {Promise<string>}
   */
  string(options) {
    return new Promise((resolve, reject) => {
      if (options.value) {
        if (typeof options.value === 'string') {
          resolve();
        } else {
          reject('$s must be a string');
        }
      } else {
        resolve();
      }
    });
  },

  /**
   * check if value is a number
   * @param options
   * @returns {Promise<any>}
   */
  number(options) {
    return new Promise((resolve, reject) => {
      if (typeof options.value === 'number') {
        resolve();
      } else {
        reject('$s must be a number');
      }
    });
  },

  /**
   * check if field is array
   * @param options
   * @returns {Promise<any>}
   */
  array(options) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(options.value)) {
        resolve();
      } else {
        reject('$s must be an array');
      }
    });
  },

  /**
   * check if field has
   * string =>  min chars
   * array => min length
   * int => min value
   * @param options
   * @returns {Promise<string>}
   */
  min(options) {
    return new Promise((resolve, reject) => {
      let min = 0;
      let message = `can't get the length of ${typeof options.value}`;
      if (typeof options.value === 'string') {
        min = options.value.length;
        message = `$s must be at least ${options.params[0]} characters`;
      }
      if (typeof options.value === 'number') {
        min = options.value;
        message = `$s must be minimum ${options.params[0]}`;
      }
      if (Array.isArray(options.value)) {
        min = options.value.length;
        message = `$s must be minimum length of ${options.params[0]}`;
      }

      if (options.params[0] <= min) {
        resolve();
      } else {
        reject(message);
      }
    });
  },

  /**
   * check if field has
   * string =>  max chars
   * array => max length
   * int => max value
   * @param options
   * @returns {Promise<string>}
   */
  max(options) {
    return new Promise((resolve, reject) => {
      let max = 0;
      let message = `can't get the length of ${typeof options.value}`;
      if (typeof options.value === 'string') {
        max = options.value.length;
        message = `$s must be less than or equal ${options.params[0]} characters`;
      }
      if (typeof options.value === 'number') {
        max = options.value;
        message = `$s must be maximum ${options.params[0]}`;
      }
      if (Array.isArray(options.value)) {
        max = options.value.length;
        message = `$s must be maximum length of ${options.params[0]}`;
      }

      if (options.params[0] >= max) {
        resolve();
      } else {
        reject(message);
      }
    });
  },

  /**
   * check if field has length of
   * string =>  chars
   * array => elements
   * @param options
   * @returns {Promise<string>}
   */
  length(options) {
    return new Promise((resolve, reject) => {
      let length = 0;
      let message = `can't get the length of ${typeof options.value}`;
      if (typeof options.value === 'string') {
        length = options.value.length;
        message = `$s must be equal ${options.params[0]} characters`;
      }
      if (Array.isArray(options.value)) {
        length = options.value.length;
        message = `$s must be length of ${options.params[0]}`;
      }

      if (options.params[0] === length) {
        resolve();
      } else {
        reject(message);
      }
    });
  },

  /**
   * check if the filed has a date with specific format
   * @TODO pass the format as params
   * @param options
   * @returns {Promise<string>}
   */
  date_format(options) {
    return new Promise((resolve, reject) => {
      if ((new Date(options.value) !== "Invalid Date") && !Number.isNaN(new Date(options.value))) {
        // it's already a date so we check the format
        const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
        if (options.value.match(regex)) {
          // the format is correct
          resolve();
        } else {
          // wrong format
          reject('$s must be a Date formatted with YYYY-MM-DD format');
        }
      } else {
        // not a date
        reject('$s must be a Date formatted with YYYY-MM-DD format');
      }
    });
  },

  /**
   * check if the date is grater than or equal another
   * @param options
   * @returns {Promise<string>}
   */
  date_after(options) {
    return new Promise((resolve, reject) => {
      if (Date.parse(options.value) > Date.parse(options.params[0])) {
        resolve();
      } else {
        reject(`$s must be a date before ${options.params[0]}`);
      }
    });
  },

  /**
   * check if field value exist in the passed values
   * @param options
   * @returns {Promise<string>}
   */
  in(options) {
    return new Promise((resolve, reject) => {
      if (options.params.indexOf(options.value.toString()) > -1) {
        resolve();
      } else {
        reject(`$s must be equal one of these ${options.params.join(', ')}`);
      }
    });
  },

  /**
   * check if field value doesn't exist in the passed values
   * @param options
   * @returns {Promise<string>}
   */
  not_in(options) {
    return new Promise((resolve, reject) => {
      if (options.params.indexOf(options.value.toString()) === -1) {
        resolve();
      } else {
        reject(`$s must be different than these ${options.params.join(', ')}`);
      }
    });
  },

  /**
   * check if field have only alphabet characters
   * @param options
   * @returns {Promise<string>}
   */
  alpha(options){
    return new Promise((resolve, reject) => {
      if ( options.value.match(/^[a-z\s]+$/i) ) {
        resolve();
      } else {
        reject("$s must contain Letters Only [a-z]");
      }
    });
  },

  /**
   * check if field have only alphabet and numbers characters
   * @param options
   * @returns {Promise<string>}
   */
  alphanum(options){
    return new Promise((resolve, reject) => {
      if ( options.value.match(/^[a-z0-9\s]+$/i) ) {
        resolve();
      }
      else {
        reject("$s must contain Letters and Numbers Only [a-z][0-9]");
      }
    });
  },

  /**
   * check if field value between two values
   * @param options
   * @returns {Promise<string>}
   */
  between(options){
    return new Promise((resolve, reject) => {
      if ( options.value >= options.params[0] && options.value <= options.params[1] ) {
        resolve();
      } else {
        reject(`$s must be between '${options.params[0]}' and '${options.params[1]}'`);
      }
    });
  },

  /**
   * check if field value is boolean
   * @param options
   * @returns {Promise<string>}
   */
  boolean(options){
    return new Promise((resolve, reject) => {
      if(options.value.match(/(true)|(false)/)) {
        resolve();
      } else {
        reject("$s must be a valid boolean or stringfied boolean");
      }
    });
  },

  /**
   * check if field value is equal to another field
   * @param options
   * @returns {Promise<string>}
   */
  match(options) {
    return new Promise((resolve, reject) => {
      if(options.value === options.inputs[options.params[0]]) {
        resolve();
      } else {
        reject(`$s must be the same as ${options.params[0]}`);
      }
    });
  },

  /**
   * check if field value is email
   * @param options
   * @returns {Promise<string>}
   */
  email(options) {
    return new Promise((resolve, reject) => {
      if(options.value) {
        const email = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (options.value.match(email)) {
          resolve();
        } else {
          reject('$s must be a valid email');
        }
      } else {
        resolve();
      }
    });
  },

  /**
   * check if field value is URL
   * @param options
   * @returns {Promise<string>}
   */
  url(options) {
    return new Promise((resolve, reject) => {
      if(options.value) {
        const urlRegex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|(www\\.)?){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
        if (options.value.length < 2083 && options.value.match(urlRegex)) {
          resolve();
        } else {
          reject('$s must be a valid URL');
        }
      } else {
        resolve();
      }
    });
  }
};
