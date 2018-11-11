const Roles = require('./roles');
const utils = require('./validator.utils');

/**
 * the main Class and access point
 */
class Validator {
  constructor(rolesObject) {
    /**
     * the main Object that contains all registered roles
     * By Default the roles contains our Default Roles
     * @type {Object}
     */
    this.roles = Roles || {};

    /**
     * the main errors object that contains all generated errors
     * @type {Object}
     */
    this.errors = {};

    /**
     * hold all inputs the will be validated
     * @type {Object}
     */
    this.inputs = {};

    /**
     * the Roles that user want to run against the Inputs
     * @type {Object}
     */
    this.userRoles = {};

    /**
     * if the user passed in any roles Object we need to register them.
     */
    this.registerUserRoles(rolesObject);
  }

  /**
   * Register User Roles
   * @param  {Object} rolesObject [the User's Object that contains all roles and the related handlers]
   * @return {void}
   */
  registerUserRoles(rolesObject) {
    if (typeof rolesObject === 'object') {
      for (const roleName in rolesObject) {
        this.register(roleName, rolesObject[roleName]);
      }
    }
  }

  /**
   * add new role to the Validator OR Overwrite an existing One.
   * @param  {String}   roleName    [the role name]
   * @param  {Function} roleHandler [the function that will excute when role fired]
   * @return {void}
   */
  register(roleName, roleHandler) {
    const parsedRoleName = roleName.split(':');

    if (parsedRoleName[1] && parsedRoleName[1] === "force") {
      if (this.roles[parsedRoleName[0]]) {
        this.unregister(parsedRoleName[0]);
        this.register(parsedRoleName[0], roleHandler);
      }
    } else if (this.roles[roleName]) {
      throw Error("the role (" + roleName + ") registered before, you can't reRegister it But you can Overwrite it, Read the Docs.");
    }

    this.roles[roleName] = roleHandler;
  }

  /**
   * remove role that added before
   * @param  {String} roleName [the role name]
   * @return {void}
   */
  unregister(roleName) {
    if (!this.roles[roleName]) throw Error("the role (" + roleName + ") unregistered before, you can't unRegister it again");

    delete this.roles[roleName];
  }

  /**
   * create new error in Main Errors Object
   * @param {String} inputName  [the name of the input that will register the new error in it]
   * @param {String} errMessage [the error message that will added]
   * @return {void}
   */
  setError(inputName, errMessage) {
    this.errors[inputName] = [utils.generateError(errMessage)];
  }

  /**
   * add error to set of errors already added
   * @param  {String} inputName  [the input name that will add the new error to it]
   * @param  {String} errMessage [the error message that will added]
   * @return {void}
   */
  appendError(inputName, errMessage) {
    if (this.errors[inputName]) {
      this.errors[inputName].push(utils.generateError(errMessage));
    } else {
      this.setError(inputName, errMessage);
    }
  }

  /**
   * prepare the Validation Class to receive run another validation with Inputs and Roles
   */
  async make(inputs, roles) {
    // reset global Error
    this.errors = {};

    // set inputs
    this.setInputs(inputs);

    // set roles
    this.setRoles(roles);

    return this.validate();
  }

  /**
   * validate all inputs with the userRoles
   * @returns {Promise<Object|null>}
   */
  async validate() {
    // loop throw this.userRoles
    for (const role in this.userRoles) {
      // check if it has array validation
      // convert it to normal input
      const parsedRole = utils.normalizeInput(role, this.inputs);

      for (const parse of parsedRole) {
        await this.validateInput(parse, this.inputs[parse], this.userRoles[role]);
      }
    }

    return (Object.keys(this.errors).length) ? this.errors : null;
  }

  /**
   * validate One Input with it's roles
   * @param inputName
   * @param value
   * @param roles
   * @returns {Promise<String>}
   */
  validateInput(inputName, value, roles) {
    return new Promise((resolve) => {
      let count = 0;
      for (const role of roles) {
        const promise = this.roles[role.name]({
          value,
          roles: this.roles,
          params: role.options || [],
          inputs: this.inputs
        });
        promise.then(() => null, (errors) => {
          this.appendError(inputName, utils.generateErrMessage(inputName, errors));
        }).finally(() => {
          count++;
          if (count === roles.length) {
            return resolve();
          }
        });
      }
    });
  }

  /**
   * set passed Inputs into the place
   * @param inputs
   */
  setInputs(inputs) {
    this.inputs = utils.flattenInputs(inputs);
  }

  /**
   * set passed Roles into the place
   * @param roles
   */
  setRoles(roles) {
    this.userRoles = utils.parseUserRoles(roles);
  }
}

module.exports = Validator;
