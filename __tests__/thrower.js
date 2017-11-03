/* globals test,expect */
import Thrower from '../lib/thrower';

test('throws immediately a TypeError if invalid subject sent', () =>
    expect(() => Thrower()).toThrowError(TypeError),
);

test('returns an unnamed Error instance when sent with only subject', () => {
    const err = Thrower('Hello', undefined, false);
    expect(err.message).toBe('Hello');
    expect(err.name).toBe('Error');
});

test('returns an named Error instance when name parameter sent', () => {
    const err = Thrower('Hello', 'TestError', false);
    expect(err.message).toBe('Hello');
    expect(err.name).toBe('TestError');
});

test('returns corresponding instance when sent an Error as subject', () => {
    const err = Thrower(new ReferenceError('Aloha'), undefined, false);
    expect(err instanceof ReferenceError).toBe(true);
    expect(err.message).toBe('Aloha');
    expect(err.name).toBe('ReferenceError');
});

test('returns corresponding instance with custom name, when parameter sent', () => {
    const err = Thrower(new RangeError('Prost'), 'SuperTestError', false);
    expect(err.message).toBe('Prost');
    expect(err.name).toBe('SuperTestError');
    expect(err instanceof RangeError).toBe(true);
});

test('replaces correctly when sent an array as subject', () => {
    const err1 = Thrower(['hello, %s! I am a %s', 'world', 'Test'], undefined, false);
    const err2 = Thrower([], undefined, false);
    expect(err1.message).toBe('hello, world! I am a Test');
    expect(err2.message).toBe('');
});

test('throws correctly', () => {
    const error = Thrower('hello', 'world', false);
    const thrower = () => Thrower('hello', 'world');
    expect(thrower).toThrowError(error);
});
