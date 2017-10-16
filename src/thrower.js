import PrepareStack from './stacktrace';

/**
 * Returns an error with easier to read stack, and with an optional custom name.
 * @name thrower
 * @memberof Tools
 *
 * @param {string|Array|Error} subject Either a message for the error, or an Error instance.
 +        If an array is sent, then performs string replacements ALA printf.
 * @param {string} [name=Error] - An identifier for the error type.
 * @returns {Error} - A custom error instance with a pretty stack.
 * @example
 * const err1 = Thrower('test'); // A standard Error with modified stack
 * const err2 = Thrower(new TypeError('test2')); // Standard TypeError with modified stack
 * const err3 = Thrower('test3', 'TestError'); // An Error instance named TestError
 * const err4 = Thrower(['hola %s', 'mundo'], 'HelloError'); // message = 'hola mundo'
 */
export default function Exception(subject, name = undefined) {
    let error;
    if (subject instanceof Error) error = subject;
    else if (typeof subject === 'string') error = new Error(subject);
    else if (Array.isArray(subject)) {
        let message = subject.shift();
        subject.forEach(function replacer(replacement) {
            message = message.replace('%s', String(replacement));
        });
        error = new Error(message);
    } else {
        throw new TypeError(
            `Invalid subject, expected {string|Array|Error}, got "${typeof subject}"`,
        );
    }
    error.name = typeof name === 'string' ? name : 'Error';
    return PrepareStack(error);
}
