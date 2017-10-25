import Test from 'ava';
import Thrower from '../lib/thrower';

Test('throws immediately a TypeError if invalid subject sent', t =>
    t.throws(() => Thrower(), err =>
        err.name === 'TypeError' && err.message.indexOf('Invalid subject') === 0,
    ),
);

Test('returns an unnamed Error instance when sent with only subject', (t) => {
    const err = Thrower('Hello', undefined, false);
    t.is(err.message, 'Hello');
    t.is(err.name, 'Error');
});

Test('returns an named Error instance when name parameter sent', (t) => {
    const err = Thrower('Hello', 'TestError', false);
    t.is(err.message, 'Hello');
    t.is(err.name, 'TestError');
});

Test('returns corresponding instance when sent an Error as subject', (t) => {
    const err = Thrower(new ReferenceError('Aloha'), undefined, false);
    t.true(err instanceof ReferenceError);
    t.is(err.message, 'Aloha');
    t.is(err.name, 'ReferenceError');
});

Test('returns corresponding instance with custom name, when parameter sent', (t) => {
    const err = Thrower(new RangeError('Prost'), 'SuperTestError', false);
    t.is(err.message, 'Prost');
    t.is(err.name, 'SuperTestError');
    t.true(err instanceof RangeError);
});

Test('replaces correctly when sent an array as subject', (t) => {
    const err1 = Thrower(['hello, %s! I am a %s', 'world', 'Test'], undefined, false);
    const err2 = Thrower([], undefined, false);
    t.is(err1.message, 'hello, world! I am a Test');
    t.is(err2.message, '');
});

Test('throws correctly', (t) => {
    const thrower = () => Thrower('hello', 'world');
    t.throws(thrower, err =>
        err instanceof Error && err.message === 'hello' && err.name === 'world',
    );
});
