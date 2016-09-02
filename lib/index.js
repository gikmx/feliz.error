'use strict';

const PATH      = require('path');
const Chalk     = require('chalk');
const Stack     = require('stack-trace');
const Columnify = require('columnify');

const debug = require('debug')('feliz:error');
const {inspect} = require('util');

class FelizError     extends Error     {}
class FelizErrorType extends TypeError {}

const ERRORS = [
    {
        name  : 'use',
        class : FelizError,
        templ : null
    }, {
        name  : 'type',
        class : FelizErrorType,
        templ : 'Invalid %name. expecting «%type», got: %data'
    }
];

/**
 * @module error
 * @todo Write documentation.
 */
module.exports = ERRORS.reduce((acc, cur) => {
    acc[cur.name] = Exception.bind(cur.class, {name:cur.name, templ:cur.templ });
    return acc;
}, Exception.bind(FelizError, {}));


function Exception({name, templ}, message){
    debug('Exception');

    // when sent the 'use' method, use that error instead.
    if (name == 'use') return prepareStackTrace.call(message);

    const ErrorClass = this;
    let error;

    // Standard error;
    if (!name) error = new ErrorClass(message);

    // transform the message based upon a template
    if (typeof templ == 'string') {
        if (!message || message.constructor !== Object){
            const msg = 'Invalid error.type message; Expecting Object, got: ';
            throw new Error(msg + inspect(message));
        }
        Object.keys(message).forEach(key => {
            let val = message[key];
            // if the data is not a string, describe it.
            if (key == 'data' && typeof val != 'string') val = `↵\n\n${inspect(val)}\n`;
            templ = templ.replace(new RegExp(`%${key}`, 'g'), val);
        });
        error = new ErrorClass(templ);
    }

    return prepareStackTrace.call(error);
}

function prepareStackTrace(){
    debug('prepareStackTrace');
    const main = process.mainModule? PATH.dirname(process.mainModule.filename) : '';
    const modx = new RegExp(`node_modules${PATH.sep}`);
    const intx = new RegExp(`^internal${PATH.sep}`);
    const rules = [
        { type: 'internal', find: intx         , color: Chalk.gray     , del: true  },
        { type: 'module'  , find: modx         , color: Chalk.gray.bold, del: true  },
        { type: 'feliz'   , find: /feliz[-\.]/ , color: Chalk.red      , del: false },
        { type: 'app'     , find: main         , color: Chalk.red.bold , del: false },
    ];
    const lines = Stack.parse(this)
        .map(f => {
            if (f.fileName === __filename) return null;
            const index = f.fileName.search(rules[1].find);
            let found = false;
            let rule  = rules
                .map(rule => {
                    if (found) return null;
                    let match = f.fileName.match(rule.find);
                    if (match === null) return null;
                    found = true;
                    const index = rule.del? match.index + match[0].length : match.index;
                    return Object.assign({file: f.fileName.slice(index)}, rule);
                })
                .filter(Boolean)
                .shift();
            if (!found) rule = { type:'native', file: f.fileName, color: Chalk.gray }
            return {
                type: rule.color(rule.type),
                pos : rule.color(`[${f.lineNumber}:${f.columnNumber}]`),
                file: rule.color(rule.file),
                cont: rule.color(f.functionName)
            }
        })
        .filter(Boolean);
    const stack = Columnify(lines, { showHeaders:false, align:'left' });
    const name  = Chalk.white.bgRed(` ${this.name || 'Error'} `);
    const mesg  = Chalk.white.bold(` ${this.message} `);
    this.stack  = `\n${name}${mesg}\n\n${stack}\n`;
    return this;
}

