import PrepareStack from './stacktrace';

/**
 * @memberof thrower
 * @private
 * @description Function used internally when an array subject is sent.
 *
 * @param {string} message - The string with replacement patterns.
 * @param {Array} replacements - The replacements.
 * @returns {string} - A string with resolved replacements.
 */
export function Replacer(message, replacements) {
    let result = message;
    replacements.forEach((replacement) => {
        result = result.replace('%s', replacement);
    });
    return result;
}

/**
 * @module thrower
 * @description Errors with pretty stack and customizable name.
 * > - [Standalone version](https://github.com/gikmx/tools-streamer).
 * > - [Report a Bug](https://github.com/gikmx/tools-streamer/issues).
 *
 * @param {string|Array|Error} subject - The message or an Error instance to beautify.
 * When an array is sent, replace subject ALA printf. signature:`[subject, ...replacements]`
 * @param {string} [name='Error'] - An identifier for the error instance.
 * @param {boolean} [throws=true] - If false, return error instance instead of throwing.
 * @returns {Error} - A custom error instance with a pretty stack.
 *
 * @example @lang js
 * Thrower('test'); // A standard Error with prettified stack
 * Thrower(new TypeError('test2')); // Standard TypeError with prettified stack
 * Thrower('test3', 'TestError'); // Custom TestError with 'test3' as message
 * Thrower(['hola %s', 'mundo'], 'HelloError'); // HelloError with 'hola mundo' as message
 * const Err = Thrower('bad boy', 'CanineError', false); // Returns CanineError instance.
 */
export default function Exception(subject, name = undefined, throws = true) {
    let error;
    if (subject instanceof Error) {
        error = subject;
        if (!name) name = subject.name; // eslint-disable-line
    } // eslint-disable-line
    else if (typeof subject === 'string')
        error = new Error(subject);
    else if (Array.isArray(subject))
        error = new Error(Replacer(subject[0], subject.slice(1)));
    else {
        const m = `Invalid subject, expected {string|Array|Error}, got "${typeof subject}"`;
        throw new TypeError(m);
    }
    error.name = typeof name === 'string' ? name : 'Error';
    const instance = PrepareStack(error);
    if (throws) throw instance;
    return instance;
}
