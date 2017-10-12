import Test from 'ava';
import Thrower from '../lib/thrower';

Test('throws correctly', (test) => {
    function thrower() {
        throw Thrower('hello', 'world');
    }
    test.throws(thrower, function validate(err) {
        return err instanceof Error && err.message === 'hello' && err.name === 'world';
    });
});
