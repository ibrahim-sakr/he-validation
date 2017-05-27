var Rules = require("./Rules");

class Validator {
    constructor(RulesObject){
        /**
         * the main Object that contains all registered rules
         * By Default the rules contains our Default Roles
         * @type {Object}
         */
        this.rules = Rules || {};

        /**
         * the main errors object that contains all generated errors
         * @type {Object}
         */
        this.errors = {};

        // if the user passed in any rules Object we need to register them.
        this.registerUserRules(RulesObject);
    }

    /**
     * Register User Rules
     * @param  {Object} RulesObject [the User's Object that contains all rules and the related handlers]
     * @return {Void}
     */
    registerUserRules (RulesObject){
        if (typeof RulesObject === 'object') {
            for(var ruleName in RulesObject){
                this.register(ruleName, RulesObject[ruleName]);
            };
        }
    }

    /**
     * add new rule to the Validator OR Overwrite an existing One.
     * @param  {String}   ruleName    [the rule name]
     * @param  {Function} ruleHandler [the function that will excute when rule fired]
     * @return {Void}
     */
    register (ruleName, ruleHandler){
        var parsedRuleName = ruleName.split(':');

        if (parsedRuleName[1] && parsedRuleName[1] == "force") {
            if ( this.rules[ parsedRuleName[0] ] ) {
                this.unregister(parsedRuleName[0]);
                this.register(parsedRuleName[0], ruleHandler);
            }
        } else if ( !!this.rules[ruleName] ){
            throw "the rule (" + ruleName + ") registered before, you can't reRegister it But you can Overwrite it, Read the Docs.";
        }
        this.rules[ruleName] = ruleHandler;
    }

    /**
     * remove rule that added before
     * @param  {String} ruleName [the rule name]
     * @return {Void}
     */
    unregister (ruleName){
        if ( !this.rules[ruleName] ) throw "the rule (" + ruleName + ") unregistered before, you can't unRegister it again";

        delete this.rules[ruleName];
    }

    /**
     * create new error in Main Errors Object
     * @param {String} inputName  [the name of the input that will register the new error in it]
     * @param {String} errMessage [the error meassge that will added]
     * @return {Void}
     */
    setError (inputName, errMessage){
        this.errors[inputName] = [errMessage];
    }

    /**
     * add error to set of errors already added
     * @param  {String} inputName  [the input name that will add the new error to it]
     * @param  {String} errMessage [the error meassge that will added]
     * @return {Void}
     */
    appendError (inputName, errMessage){
        if (this.errors[inputName]) {
            this.errors[inputName].push(errMessage);
        } else {
            this.setError(inputName, errMessage);
        }
    }

    /**
     * extract rule name and rule options from string
     * @param  {String} string [the string that the user passed in the rule array]
     * @return {Object}        [the rule name and the rule options]
     */
    parseInputArray (string){
        // string   -> "require" OR "between:3,10" OR "unique:user,email"
        // ruleName -> between
        // options  -> [3, 10]
        var split = string.split(':');
        return {
            "ruleName": split[0],
            "options" : (split[1]) ? split[1].split(',') : null
        };
    }

    /**
     * find and replace the input name in the error message
     * @param  {String} inputName  [the input name]
     * @param  {String} errMessage [the error message]
     * @return {String}            [the error message after modified]
     */
    generateErrMessage (inputName, errMessage){
        // replace $s with inputName in errMessage
        return errMessage.replace("$s", inputName);
    }

    /**
     * get the length of all rules arrays
     * @param {Object} rules [the rules object that the user passed in]
     * @return {Number}      [the length of all sub arrays in the rules object]
     */
    getEndLimit (rules){
        /**
         * rules = {
         *     "input1": ['rule1', 'rule2'],
         *     "input2": ['rule3', 'rule4'],
         * }
         * the length will be input1.length + input2.length = the final length
         */
        var end = 0;
        for(var x in rules){
            end += rules[x].length;
        };
        return end;
    }

    /**
     * start the validation against passed rules
     * @param  {Object}             inputs   [mostly it's the body object but it can be any object that we need to validate]
     * @param  {Object}             rules    [the rules that we need to validate against]
     * @param  {Function}           callback [optional the function that will be returned with errors object]
     * @return {Promise | Callback}          [Promise if no callback, or callback]
     */
    make (inputs, rules, callback){
        // create new Promise to return at the end
        var promise = new Promise((resolve, reject) => {
            // the counter for count finished operations
            // we don't need to run them Sync so we use this method
            var counter = 0,
            // the end of the counter
                end     = this.getEndLimit(rules);

            // loop into rules
            // for every inputName in rules
            for(var inputName in rules) {
                // if inputName doesn't exist in inputs
                if ( Object.keys(inputs).indexOf(inputName) == -1 ) {
                    // add the error to exist errors
                    this.setError(inputName, this.generateErrMessage(inputName, "the input $s doesn't exist in the injected inputs Object"));
                    // don't excute the rest of the code and start over again
                    continue;
                }

                // foreach rule in rules[inputName] array
                rules[inputName].forEach(function(rule, index){
                    // extract rule name and rule options
                    var parse = this.parseInputArray(rule);

                    // if ruleName doesn't exist in this.rules
                    if (!this.rules[parse.ruleName]) {
                        // add the error to exist errors like before
                        this.appendError(inputName, this.generateErrMessage(parse.ruleName, "the rule $s doesn't registered yet."));

                        // this time we inceased counter by One.
                        counter++;

                        // and check if the counter equals end or NOT
                        if (counter == end) {
                            // if True then check if there is any errors at all
                            if (Object.keys(this.errors).length > 0) {
                                // if True then reject the Promise and return all errors
                                reject(this.errors);
                            }
                            // if there is no errors then resolve the Promise
                            resolve();
                        }
                    } else {
                        // run the registerd ruleHandler and pass all required parameters
                        this.rules[parse.ruleName](inputs[inputName], parse.options, this.rules, function(errMessage){
                            // if error found then add it
                            if (errMessage) this.appendError(inputName, this.generateErrMessage(inputName, errMessage));

                            // inceased counter by One.
                            counter++;

                            // and check if the counter equals end or NOT
                            if (counter == end) {
                                // if True then check if there is any errors at all
                                if (Object.keys(this.errors).length > 0) {
                                    // if True then reject the Promise and return all errors
                                    reject(this.errors);
                                }
                                // if there is no errors then resolve the Promise
                                resolve();
                            }
                        }.bind(this));
                    }
                }.bind(this));
            };
        });

        // at the end check if the User passed Callback
        if (typeof callback === "function") {
            // if True then Manually resolve the Promise and pass Callback as resolver and rejection
            promise.then(callback.bind(null, null), callback);
        };
        // if No Callback then return the Promise
        return promise;
    }
}

/**
 * export the Validator Class
 * @type {Object}
 */
exports = module.exports = Validator;
