## he-validation
##### @licence MIT
##### the initial version

### Install
    npm install he-validation --save

### quick How to use
require the Core

    var ValidatorCore = require('he-validator');

create new instance from Core

    var Validator = new ValidatorCore;

after that you are ready to make you validation like so

first prepare your Inputs Object which contains all inputs that you need to validate
it can be `req.body` if you use Expressjs or any Object

    var Inputs = req.body;
    // OR
    var Inputs = {
        "input": "value"
    }

then you need to prepare the Roles that will contains all your validation roles

    var Roles = {
        "input": ["required", "min:3", "max:100", "numeric"] // any Role you need with it's options
    }

finally run the `Validator`

    var validation = Validator.make(Inputs, Roles);
    
the Validator by Default returns Promise

    validation.then(function success(){
        // the Validator success with NO Errors at All
    }, function fail(errors){
        // the Validator failed and all Errors passed here
    });

OR and this is NOT Recommended You can pass a third parameter to `make` method and it's a Function that accept an erros param

    Validator.make(Inputs, Roles, function callback(errors){
        if (errors) {
            // do your Logic here
        } else { 
            // there is No errors
        }
    });
    
## Go Deep Into Rabbit Hole

#### if you need to add custom Roles or Extend the Validator

first method => you can pass Object contains your Custom Roles then pass it to the constractor.

    var RolesObject = {
        "new_role": function(value, data, roles, cb){
            if(true){
                return cb();
            } else {
                return cb("error message");
            }
        }
    };
    // create new instance from Core
    var Validator = new ValidatorCore(RolesObject);

second method => you can add or register custom Role after Intiating the Validator by using `register` method

    Validator.register("customRoleName", function(value, data, roles, cb){});

all registerd roles must have Handler that accept four required parameters `value`, `data`, `roles` and `cb`
1. `value` => the value that User passed into Inputs Object.
2. `data` => any data that User pass to the Role ex-> `range:5,10` the data will be array `[5, 10]`.
3. `roles` => the main RolesObject in case you need to interact with any Other Role.
4. `cb` OR `callback` => a function that return when all your logic finished either with null or with error message ex-> `return cb(null)` if value passed the test OR `return cb("$s must be a number")` an Error message that contains `$s` which will be replaced by Input Name.

#### Overwrite
if there is a case when you need to replace exist role with new one with the same name .. in other words you need to Overwrite exist Role you can do this by add `:force` to the name of the Role.
but Notice that this is NOT Recommended because there is some Roles Depend on other Roles so be careful when you do this Overwriting thing.

    Validator.register("required:force", function(value, data, roles, cb){});

this will force the Validator to Unregister the Old `required` Role and add Yours.


### I'm Welcoming with any comment or advise or you can open new issue on [github](https://github.com/ibrahimsaqr/he-validation/issues)

### Todo List
1. add more Roles
