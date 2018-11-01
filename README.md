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
        "input": ["required", "min:3", "max:100"] // any Role you need with it's options
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

#### Available Roles
- required -----> the field must be presend and not Null

- require_if:a -> the field will be required if field 'a' is present
    require_if:a,b => the field will be required if field 'a' is equal to 'b'

- string -------> the field must be string

- number -------> the field must be number

- array --------> the field must be array

- alpha --------> the field must be string of alphabets only

- alphanum -----> the field must be string of alphabets and numbers only

- min:a --------> the field must be at least equal to 'a'
    min:a => if the field string the will check the number of chars
    min:a => if the field number will check the value
    min:a => if the field array will check the length

- max:a --------> the field must be at most equal to 'a'
    max:a => if the field string the will check the number of chars
    max:a => if the field number will check the value
    max:a => if the field array will check the length

- length:a -----> the field must be equal to 'a'
    length:a => if the field string will check the number of chars
    length:a => if the field number will check the value
    length:a => if the field array will check the length

- date_format --> the field must be with date format, Now we only support 'YYYY-MM-DD'

- date_after:a -> the field must be date and must be grater than 'a'

- in:a,b,c -----> the field value must be equal one of 'a, b, c'

- not_in:a,b,c -> the field value must be NOT one of 'a, b, c'

- between:a,b --> if the field is number then it's value must be between 'a, b'

- boolean ------> the field must be true or false OR 'true' or 'false' as strings

- equal:a ------> the field must be equal 'a'

- email --------> the field must be an email

- url  ---------> the field must be URL

### I'm Welcoming with any comment or advise or you can open new issue on [github](https://github.com/ibrahimsaqr/he-validation/issues)
