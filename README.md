## he-validation
##### @licence GPL v3

### Install

```
# npm install he-validation --save
```

### quick How to use
require the Core

```javascript
const ValidatorCore = require('he-validator');
```

create new instance from Core

```javascript
const Validator = new ValidatorCore;
```

after that you are ready to make your validation like so

first prepare your Inputs Object which contains all inputs that you need to validate
it can be `req.body` if you use Express js or any Object

```javascript
const Inputs = req.body;
// OR
const Inputs = {
    "input": "value"
}
```

then you need to prepare the Roles that will contains all your validation roles

```javascript
const Roles = {
    // any Role you need with it's options
    "input": ["required", "min:3", "max:100", "numeric"]
}
```

finally run the `Validator`

```javascript
const validation = Validator.make(Inputs, Roles);
```
the Validator by Default returns Promise
```javascript
validation.then(() => {
    // the Validator success with NO Errors at All
}, (errors) => {
    // the Validator failed and all Errors passed here
});
```

## Go Deep Into Rabbit Hole

#### if you need to add custom Roles or Extend the Validator

first method => you can create Object contains your Custom Roles then pass it to the constractor.

```javascript
const RolesObject = {
    "new_role": (options) => {
        return new Promise((resolve, reject) => {
            if(validationPassed === true){
                return resolve();
            }

            return reject("$s failed with error message");
        });
    },
    "another_awesome_role": ...
};

// create new instance from Core
const Validator = new ValidatorCore(RolesObject);
```

second method => you can add or register custom Role after Intiating the Validator by using `register` method

```javascript
Validator.register("customRoleName", (options) => {});
```

all registerd roles must have Handler that accept `options` parameter that contains `value`, `params`, `inputs` and `roles`

1. `value` => the value that User passed into Inputs Object.
2. `params` => any additional params passed to the role
3. `inputs` => all user inputs in it's original shap in case you need to access another value.
4. `roles` => the main RolesObject in case you need to interact with any Other Role.

**Notice: any error message should contain `$s` that will replaced with the input name**

#### Overwrite
if there is a case when you need to replace exist role with new one with the same name .. in other words you need to Overwrite exist Role you can do this by add `:force` to the name of the Role.
but Notice that this is NOT Recommended because there is some Roles Depend on other Roles so be careful when you do this Overwriting thing.

```javascript
Validator.register("required:force", (options) => {});
```

this will force the Validator to Unregister the Old `required` Role and add Yours.

## Availabile Roles

<table>
    <tr>
        <th>Name</th>
        <th>Parameters</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>accepted</td>
        <td></td>
        <td>the field must be one of these values 'yes, on, 1, or true', usefull on forms confirmation.</td>
    </tr>
    <tr>
        <td>required</td>
        <td></td>
        <td>the field must be presend and not Null</td>
    </tr>
    <tr>
        <td>require_if</td>
        <td>anotherField, value</td>
        <td>
            1- the field will be required if field 'anotherField' is present.</br>
            2- the field will be required if field 'anotherField' is equal to 'value'
        </td>
    </tr>
    <tr>
        <td>string</td>
        <td></td>
        <td>the field must be string</td>
    </tr>
    <tr>
        <td>number</td>
        <td></td>
        <td>the field must be number</td>
    </tr>
    <tr>
        <td>array</td>
        <td></td>
        <td>the field must be array</td>
    </tr>
    <tr>
        <td>min</td>
        <td>value</td>
        <td>
            the field must be at least equal to 'value' AND if the field</br>
            1- string => then we check the number of chars</br>
            2- number => then we check the value</br>
            3- array => then we check the length
        </td>
    </tr>
    <tr>
        <td>max</td>
        <td>value</td>
        <td>
            the field must be at most equal to 'value' AND if the field</br>
            1- string => then we check the number of chars</br>
            2- number => then we check the value</br>
            3- array => then we check the length
        </td>
    </tr>
    <tr>
        <td>length</td>
        <td>value</td>
        <td>
            the field must be equal to 'value' AND if the field</br>
            1- string => then we check the number of chars</br>
            2- number => then we check the value</br>
            3- array => then we check the length
        </td>
    </tr>
    <tr>
        <td>date</td>
        <td></td>
        <td>the field must be a valid date, with any format</td>
    </tr>
    <tr>
        <td>date_format</td>
        <td>value</td>
        <td>the field must be a valid date with 'value' format</td>
    </tr>
    <tr>
        <td>date_after</td>
        <td>value</td>
        <td>the field must be a valid date and must be grater than 'value'</td>
    </tr>
    <tr>
        <td>date_before</td>
        <td>value</td>
        <td>the field must be a valid date and must be less than 'value'</td>
    </tr>
    <tr>
        <td>in</td>
        <td>value1, value2, ..etc</td>
        <td>the field value must be equal one of 'value1, value2, ..etc'</td>
    </tr>
    <tr>
        <td>not_in</td>
        <td>value1, value2, ..etc</td>
        <td>the field value must be NOT one of 'value1, value2, ..etc'</td>
    </tr>
    <tr>
        <td>alpha</td>
        <td></td>
        <td>the field must be string of alphabets only</td>
    </tr>
    <tr>
        <td>alphanum</td>
        <td></td>
        <td>the field must be string of alphabets and numbers only</td>
    </tr>
    <tr>
        <td>between</td>
        <td>value1, value2</td>
        <td>if the field is number then it's value must be between 'value1, value2'</td>
    </tr>
    <tr>
        <td>boolean</td>
        <td></td>
        <td>the field must be true or false OR 'true' or 'false' as strings</td>
    </tr>
    <tr>
        <td>match</td>
        <td>value</td>
        <td>the field must be equal 'value'</td>
    </tr>
    <tr>
        <td>email</td>
        <td></td>
        <td>the field must be a valid email</td>
    </tr>
    <tr>
        <td>url</td>
        <td></td>
        <td>the field must be a valid URL</td>
    </tr>
</table>

## License
This project is licensed under the GPL v3 License - see the [LICENSE.md](LICENSE.md) file for details

### I'm Welcoming with any comment or advise or you can open new issue on [github](https://github.com/ibrahim-sakr/he-validation/issues)
