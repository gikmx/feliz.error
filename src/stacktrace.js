// Node modules
import PATH from 'path';

import Chalk from 'chalk';
import Stack from 'stack-trace';
import Columnify from 'columnify';

export const Rules = [
    {
        type: 'internal',
        find: new RegExp(`^internal${PATH.sep}|^[^${PATH.sep}]+.js`),
        color: Chalk.gray,
        slice: false,
        filter: false,
    }, {
        type: 'module',
        find: new RegExp(`node_modules${PATH.sep}`),
        color: Chalk.red,
        slice: true,
        filter: false,
    }, {
        type: process.env.npm_package_name || PATH.basename(process.cwd()),
        find: process.cwd(),
        color: Chalk.red.bold,
        slice: true,
        filter: false,
    },
];

export default function prepareStackTrace(error) {
    const lines = Stack
        .parse(error)
        // Omit calls that are either native or without a filename (?)
        .filter(({ native, fileName }) => !!fileName && !native)
        // Omit all stacks pointing to this file.
        .filter(({ fileName }) => PATH.dirname(fileName) !== __dirname)
        // Determine the type of stack by parsing the fileName.
        .map(({ fileName, lineNumber, columnNumber, functionName, methodName }) => {
            let color = Chalk.gray;
            const stack = {
                type: 'unknown',
                pos: `[${lineNumber}:${columnNumber}]`,
                file: fileName,
                content: functionName || methodName,
            };
            for (let i = 0; i < Rules.length; i++) {
                const rule = Rules[i];
                const r = fileName.match(rule.find);
                if (r === null) continue; // eslint-disable-line no-continue
                // matched, should it be filtered out?
                if (rule.filter) return null;
                color = rule.color; // eslint-disable-line prefer-destructuring
                // update properties
                stack.type = rule.type;
                // should the matched text be sliced-out from the filename?
                stack.file = fileName.slice(rule.slice ? r.index + r[0].length : r.index);
                break;
            }
            Object.keys(stack).forEach((k) => { stack[k] = color(stack[k]); });
            return stack;
        })
        .filter(Boolean);
    const stack = Columnify(lines, { showHeaders: false, align: 'left' });
    const name = Chalk.white.bgRed(` ${error.name || 'Error'} `);
    const mesg = Chalk.white.bold(` ${error.message} `);
    error.stack = `\n${name}${mesg}\n\n${stack}\n`; // eslint-disable-line
    return error;
}
