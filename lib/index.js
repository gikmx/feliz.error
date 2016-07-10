'use strict';

const ERRORS = [
    { name:'type'      , args: [TypeError      , 'Invalid %name. expecting %type; got: %data' ] },
    { name:'range'     , args: [RangeError     , 'TODO: Add an error message here' ]            },
    { name:'reference' , args: [ReferenceError , 'TODO: Add an error message here' ]            },
    { name:'syntax'    , args: [SyntaxError    , 'TODO: Add an error message here' ]            },
];

function Exception(template, options){
    const Instance = this;
    if (!options || options.constructor !== Object)
        options = { message:String(options) };
    Object
        .keys(options)
        .map(key => template = template.replace(`%${key}`, String(options[key])))
    return new Instance(template);
}

module.exports = function(){
    return ERRORS.reduce((acc, cur) => {
        acc[cur.name] = Exception.bind.apply(Exception, cur.args);
        return acc;
    }, Error);
}

module.exports.Exception = Exception;
