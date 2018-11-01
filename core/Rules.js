/**
 * Default Validation Rules for he-validation
 * 
 * required .................................DONE
 * min:3 ....................................DONE
 * max:12 ...................................DONE
 * alpha ....................................DONE
 * alpha_num ................................DONE
 * numeric ..................................DONE
 * array ....................................DONE
 * between ..................................DONE
 * length ...................................DONE
 * confirmed:feild_name .....................DONE  // password match password_again
 * unique:table,column,excludeId ............DONE
 * not_in:1,2,3,4
 * boolean...................................DONE
 * timestamp.................................DONE
 * equals:example............................DONE
 */
exports = module.exports = {
    required (value, data, rules, cb){
        if (!value || Object.prototype.toString(value).length == 0 || value.length == 0) return cb("$s is required");
        else return cb(null);
    },

    numeric (value, data, rules, cb){
        var reg = /^\d+$/;
        return ( !reg.test(value) ) ? cb("$s must be a number") : cb(null);
    },

    min (value, data, rules, cb){
        rules.numeric(value, '', rules, function(error){
            if (error) {
                if ( value.length < Number(data) ) return cb("$s must be " + data + " characters at least");
                else return cb(null);
            } else {
                if ( Number(value) < Number(data) ) return cb("$s must be at least " + data);
                else return cb(null);
            };
        });
    },

    max (value, data, rules, cb){
        roles.numeric(value, '', function(error){
            if (error) {
                if ( value.length > Number(data) ) return cb("$s must be "+ data +" characters at most");
                else return cb(null);
            } else {
                if ( Number(value) > Number(data) ) return cb("$s must be at most " + data);
                else return cb(null);
            }
        });
    },

    timestamp (value, data, rules, cb){
        if(!value.match(/^[0-9]+$/i)) return cb("$s must be a valid unix timestamp");
        else return cb(null);
    },

    alpha (value, data, rules, cb){
        if ( !value.match(/^[a-z\s]+$/i) ) return cb("$s must contain Letters Only [a-z]");
        else return cb(null);
    },

    alphanum (value, data, rules, cb){
        if ( !value.match(/^[a-z0-9\s]+$/i) ) return cb("$s must contain Letters and Numbers Only [a-z][0-9]");
        else return cb(null);
    },

    array (value, data, rules, cb){
        if ( !Array.isArray(value) ) return cb("$s must be an array");
        else return cb(null);
    },

    between (value, data, rules, cb){
        var data = data.split(',');
        if ( value >= data[0] && value <= data[1] ) return cb(null);
        else return cb("$s must be between '"+ data[0] +"' and '"+ data[1] +"'");
    },

    confirmed (value, data, rules, cb){
        if ( value !== targets[data] ) return cb("$s must be same as '"+ data + "'");
        else return cb(null);
    },

    length (value, data, rules, cb){
        if ( typeof value === "object" ) {
            if ( Array.isArray(value) ) {
                if ( value.length < data ) return cb("$s must be at least " + data);
                else return cb(null);
            } else {
                if ( !Object.keys(value).length < data ) return cb("$s must be at least " + data);
                else return cb(null);
            }
        } else return cb("$s must be an array or object with length at least " + data );
    },

    time (value, data, rules, cb){ // 00:00 or 00:00:00
        if ( !value.match(/^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/i) ) return cb("$s must be a valid time (00:00) or (00:00:00)");
        else return cb(null);
    },

    timesql (value, data, rules, cb){ // must be 00:00:00
        if ( !value.match(/(([0-1][0-9])|([2][0-3])):([0-5][0-9]):([0-5][0-9])/i) ) return cb("$s must be a valid time (00:00:00)");
        else return cb(null);
    },

    date (value, data, rules, cb){
        if ( !value.match(/([2][0-9][0-9][0-9])-([0-1][0-9])-([0-3][0-9])/i) || !value instanceof Date) return cb("$s must be a valid date (0000-00-00)");
        else return cb(null);
    },

    boolean (value, data, rules, cb){
        if(!/(true)|(false)/.test(value)) return cb("$s must be a valid boolean or stringfied boolean");
        else return cb(null);
    },

    equals (value, data, rules, cb){
        if(value != data ) return cb("$s must equal " + data);
        else return cb(null);
    }
};
