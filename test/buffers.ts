import { describe, it } from '@xutl/test';
import assert from 'assert';

import { buffers } from '../';
import { readFileSync, createReadStream } from 'fs';

const expected = readFileSync(__filename);

describe('event streaming to async iterator', () => {
	const q = buffers(createReadStream(__filename));
	it('can iterate over stream and read buffers', async () => {
		const buffers = [];
		for await (let buf of q) buffers.push(buf);
		const actual = Buffer.concat(buffers);
		assert.equal(actual.toString('utf-8'), expected.toString('utf-8'));
	});
});
