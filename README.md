## he-validation
##### @licence MIT

### Install
    npm install he-validation --save

### quick How to use
require the Core

    var ValidatorCore = require('he-validation');

create new instance from Core

    var Validator = new ValidatorCore();

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
    
the Validator by Default returns Promise that always success with error message if any

    validation.then(function success(errs){
        if(errs) {
            // retrun the errors
        }

        // the Validator success with NO Errors at All
    });

OR with es6 async await

    var validationErrors = await Validator.make(Inputs, Roles);

    if(validationErrors) {
        // return the erros
    }

    // the Validator success with NO Errors at All


## Go Deep Into Rabbit Hole

#### if you need to add custom Roles or Extend the Validator

first method => you can pass Object contains your Custom Roles then pass it to the constractor.

    var RolesObject = {
        "new_role": (options) => {
            return new Promise((resolve, reject) => {
                if(true){ resolve(); }
                else { reject("$s error message"); }
            });
        }
    };

    // create new instance from Core
    var Validator = new ValidatorCore(RolesObject);

second method => you can add or register custom Role after Intiating the Validator by using `register` method

    Validator.register("customRoleName", (options) => {
        return new Promise((resolve, reject) => {
            if(true){ resolve(); }
            else { reject("$s error message"); }
        });
    });

all registerd roles have Options parameter that contains four keys `value`, `roles`, `inputs` and `params`
1. `value`  => the value that User passed into Inputs Object.
2. `params` => any params that User pass to the Role ex-> `range:5,10` the data will be array `[5, 10]`.
3. `roles`  => the main RolesObject in case you need to interact with any Other Role.
4. `inputs` => the main inputs Object that contains all user input and values in case you need to interact with another value like `confirm:another_input_name`

Notice => Any Role Must Return a promise and resolve it if vlidation success OR reject it if validator failed
Notice => the `$s` in the error message will replace automaticly with the input name 

#### Overwrite
if there is a case when you need to replace exist role with new one with the same name .. in other words you need to Overwrite exist Role you can do this by add `:force` to the name of the Role.
but Notice that this is NOT Recommended because there is some Roles Depend on other Roles so be careful when you do this Overwriting thing.

    Validator.register("required:force", (options) => {});

this will force the Validator to Unregister the Old `required` Role and add Yours.


### I'm Welcoming with any comment or advise or you can open new issue on [github](https://github.com/ibrahimsaqr/he-validation/issues)
