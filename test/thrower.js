import Test from 'ava';
import Thrower from '../lib/thrower';

Test('throws immediately a TypeError if invalid subject sent', test =>
    test.throws(() => Thrower(), err =>
        err.name === 'TypeError' && err.message.indexOf('Invalid subject') === 0,
    ),
);

Test('returns an unnamed Error instance when sent with only subject', (test) => {
    const err = Thrower('Hello', undefined, false);
    test.is(err.message, 'Hello');
    test.is(err.name, 'Error');
});

Test('returns an named Error instance when name parameter sent', (test) => {
    const err = Thrower('Hello', 'TestError', false);
    test.is(err.message, 'Hello');
    test.is(err.name, 'TestError');
});

Test('returns corresponding instance when sent an Error as subject', (test) => {
    const err = Thrower(new ReferenceError('Aloha'), undefined, false);
    test.true(err instanceof ReferenceError);
    test.is(err.message, 'Aloha');
    test.is(err.name, 'ReferenceError');
});

Test('returns corresponding instance with custom name, when parameter sent', (test) => {
    const err = Thrower(new RangeError('Prost'), 'SuperTestError', false);
    test.is(err.message, 'Prost');
    test.is(err.name, 'SuperTestError');
    test.true(err instanceof RangeError);
});

Test('replaces correctly when sent an array as subject', (test) => {
    const err1 = Thrower(['hello, %s! I am a %s', 'world', 'Test'], undefined, false);
    const err2 = Thrower([], undefined, false);
    test.is(err1.message, 'hello, world! I am a Test');
    test.is(err2.message, '');
});

Test('throws correctly', (test) => {
    const thrower = () => Thrower('hello', 'world');
    test.throws(thrower, err =>
        err instanceof Error && err.message === 'hello' && err.name === 'world',
    );
});
