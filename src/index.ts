import _HttpsProxyAgent from './agent';
import {HttpsProxyAgentOptions as Options } from './agent';

function createHttpsProxyAgent(
	opts: string | createHttpsProxyAgent.HttpsProxyAgentOptions
): _HttpsProxyAgent {
	return new _HttpsProxyAgent(opts);
}

namespace createHttpsProxyAgent {

	export interface HttpsProxyAgentOptions extends Options{}

	export type HttpsProxyAgent = _HttpsProxyAgent;
	export const HttpsProxyAgent = _HttpsProxyAgent;

	createHttpsProxyAgent.prototype = _HttpsProxyAgent.prototype;
}

export default createHttpsProxyAgent;
