import { inspect as INSPECT } from 'util';
import Debug from 'debug';
import PrepareStack from './stacktrace';

const debug = Debug('feliz:error');

export default function Exception({ name, templ }, message) {
    debug('Exception');

    // when sent the 'use' method, use that error instead.
    if (name === 'use') return PrepareStack.call(message);

    const ErrorClass = this;
    let error;

    // Standard error;
    if (!name) error = new ErrorClass(message);

    // transform the message based upon a template
    if (typeof templ === 'string') {
        if (!message || message.constructor !== Object) {
            const msg = 'Invalid error.type message; Expecting Object, got: ';
            throw new Error(msg + INSPECT(message));
        }
        Object.keys(message).forEach(function eachKey(key) {
            let val = message[key];
            // if the data is not a string, describe it.
            if (key === 'data' && typeof val !== 'string') val = `↵\n\n${INSPECT(val)}\n`;
            templ = templ.replace(new RegExp(`%${key}`, 'g'), val);
        });
        error = new ErrorClass(templ);
    }

    return PrepareStack.call(error);
}
