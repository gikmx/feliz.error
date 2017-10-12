import PrepareStack from './stacktrace';

/**
 * Returns an error with easier to read stack, and with an optional custom name.
 * @name thrower
 * @memberof Tools
 *
 * @param {string|Error} subject - Either a message for the error or an existing Error.
 * @param {string} [name=Error] - An identifier for the error type.
 * @returns {Error} - A custom error instance with a pretty stack.
 */
export default function Exception(subject, name = undefined) {
    let error;
    if (subject instanceof Error) error = subject;
    else if (typeof subject === 'string') error = new Error(subject);
    error.name = typeof name === 'string' ? name : 'Error';
    return PrepareStack(error);
}
