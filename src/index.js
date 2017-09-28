import Exception from './exception';

class CustomError extends Error {}
class CustomTypeError extends TypeError {}

const ERRORS = [
    {
        name: 'use',
        class: CustomError,
        templ: null,
    },
    {
        name: 'type',
        class: CustomTypeError,
        templ: 'Invalid %name. expecting «%type», got: %data',
    },
];

/**
 * @module error
 * @todo Write documentation.
 */
module.exports = ERRORS.reduce((acc, cur) => {
    acc[cur.name] = Exception.bind(cur.class, { name: cur.name, templ: cur.templ });
    return acc;
}, Exception.bind(CustomError, {}));
