import { queue, Queue } from '@xutl/queue';

import { EventEmitter } from 'events';
import { Readable } from 'stream';

export function events<T>(source: EventEmitter, event: string | symbol, final: string | symbol): AsyncIterable<T> {
	const iq = queue<T>();
	source.on(event, (item: T) => iq.push(item));
	source.on(final, () => iq.done());
	source.on('error', (err: Error) => iq.error(err));
	return iq as AsyncIterable<T>;
}

export function buffers(stream: Readable): AsyncIterable<Buffer> {
	return events<Buffer>(stream, 'data', 'close');
}

export function strings(source: Readable | AsyncIterable<Buffer>): AsyncIterable<string> {
	const base = (source instanceof Readable ? buffers(source) : source) as AsyncIterable<Buffer>;
	const iter = queue<string>();
	(async function bufferStrings(source: AsyncIterable<Buffer>, target: Queue<string>): Promise<void> {
		for await (const item of source) {
			target.push(item.toString('utf-8'));
		}
		target.done();
	})(base, iter).catch((error) => iter.error(error));
	return iter;
}

export function lines(source: Readable | AsyncIterable<Buffer | string>): AsyncIterable<string> {
	const base = (source instanceof Readable ? buffers(source) : source) as AsyncIterable<Buffer>;
	const iter = queue<string>();
	let buffer = '';
	(async function bufferStrings(source: AsyncIterable<Buffer>, target: Queue<string>): Promise<void> {
		for await (const item of source) {
			buffer += item.toString('utf-8');
			const lines = buffer.split(/\r?\n/);
			buffer = lines.pop() as string;
			lines.forEach(target.push);
		}
		target.push(buffer);
		target.done();
	})(base, iter).catch((error) => iter.error(error));
	return iter;
}
