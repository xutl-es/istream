import { describe, it } from '@xutl/test';
import assert from 'assert';

import { strings } from '../';
import { readFileSync, createReadStream } from 'fs';

const expected = readFileSync(__filename, 'utf-8');

describe('event streaming to async iterator', () => {
	const q = strings(createReadStream(__filename));
	it('can iterate over stream and read strings', async () => {
		const buffers = [];
		for await (let buf of q) buffers.push(buf);
		const actual = buffers.join('');
		assert.equal(actual, expected);
	});
});
