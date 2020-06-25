import { describe, it } from '@xutl/test';
import assert from 'assert';

import { events } from '../';
import { EventEmitter } from 'events';

describe('event streaming to async iterator', () => {
	const emitter = new EventEmitter();
	const q = events<number>(emitter, 'item', 'done');
	const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	let timer: NodeJS.Timer;
	const runner = () => {
		if (!data.length) {
			clearInterval(timer);
			emitter.emit('done');
		} else {
			emitter.emit('item', data.shift());
		}
	};
	it('can iterate over events', async () => {
		timer = setInterval(runner, 50);
		const expected = data.slice();
		const actual = [];
		for await (let num of q) actual.push(num);
		assert.deepStrictEqual(actual, expected);
	});
});
