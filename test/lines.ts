import { describe, it } from '@xutl/test';
import assert from 'assert';

import { lines } from '../';
import { readFileSync, createReadStream } from 'fs';

const expected = readFileSync(__filename, 'utf-8').split(/\r?\n/);

describe('event streaming to async iterator', () => {
	const q = lines(createReadStream(__filename));
	it('can iterate over stream and read lines', async () => {
		for await (let actual of q) {
			assert.equal(actual, expected.shift());
		}
		assert.equal(expected.length, 0, JSON.stringify(expected));
	});
});
