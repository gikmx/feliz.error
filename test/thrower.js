import Test from 'ava';
import Thrower from '../lib/thrower';

Test('throws immediately a TypeError if invalid subject sent', test =>
    test.throws(() => Thrower(), TypeError),
);

Test('returns an unnamed Error instance when sent with only subject', (test) => {
    const err = Thrower('Hello');
    test.is(err.message, 'Hello');
    test.is(err.name, 'Error');
});

Test('returns an named Error instance when name parameter sent', (test) => {
    const err = Thrower('Hello', 'TestError');
    test.is(err.message, 'Hello');
    test.is(err.name, 'TestError');
});

Test('returns corresponding instance when sent an Error as subject', (test) => {
    const err = Thrower(new ReferenceError('Aloha'));
    test.is(err.message, 'Aloha');
    test.true(err instanceof ReferenceError);
});

Test('returns corresponding instance with custom name, when parameter sent', (test) => {
    const err = Thrower(new RangeError('Prost'), 'SuperTestError');
    test.is(err.message, 'Prost');
    test.is(err.name, 'SuperTestError');
    test.true(err instanceof RangeError);
});

Test('replaces correctly when sent an array as subject', (test) => {
    const err1 = Thrower(['hello, %s! I am a %s', 'world', 'Test']);
    const err2 = Thrower([]);
    test.is(err1.message, 'hello, world! I am a Test');
    test.is(err2.message, '');
});

Test('throws correctly', (test) => {
    function thrower() {
        throw Thrower('hello', 'world');
    }
    test.throws(thrower, function validate(err) {
        return err instanceof Error && err.message === 'hello' && err.name === 'world';
    });
});
