import { Readable } from 'stream';


export interface ProxyResponse {
	statusCode: number;
	buffered: Buffer;
}

export default function parseProxyResponse(
	socket: Readable
): Promise<ProxyResponse> {
	return new Promise((resolve, reject) => {
		// we need to buffer any HTTP traffic that happens with the proxy before we get
		// the CONNECT response, so that if the response is anything other than an "200"
		// response code, then we can re-play the "data" events on the socket once the
		// HTTP parser is hooked up...
		let buffersLength = 0;
		const buffers: Buffer[] = [];

		function read() {
			const b = socket.read();
			if (b) ondata(b);
			else socket.once('readable', read);
		}

		function cleanup() {
			socket.removeListener('error', onerror);
			socket.removeListener('readable', read);
		}

		
		function onerror(err: Error) {
			cleanup();
			reject(err);
		}

		function ondata(b: Buffer) {
			buffers.push(b);
			buffersLength += b.length;

			const buffered = Buffer.concat(buffers, buffersLength);
			const endOfHeaders = buffered.indexOf('\r\n\r\n');

			if (endOfHeaders === -1) {
				// keep buffering
				read();
				return;
			}

			const firstLine = buffered.toString(
				'ascii',
				0,
				buffered.indexOf('\r\n')
			);
			const statusCode = +firstLine.split(' ')[1];
			resolve({
				statusCode,
				buffered
			});
		}

		socket.on('error', onerror);

		read();
	});
}
