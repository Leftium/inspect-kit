async function serializeRequest(request: Request) {
	const {
		method,
		cache,
		credentials,
		destination,
		integrity,
		keepalive,
		mode,
		redirect,
		referrer,
		referrerPolicy
		// isReloadNavigation,
		// isHistoryNavigation
	} = request;

	// prettier-ignore
	return {
		url:     request.url,
		headers: Object.fromEntries(request.headers.entries()),
		body:    await request.clone().text(),
		method,
		destination,
		referrer,
		referrerPolicy,
		mode,
		credentials,
		cache,
		redirect,
		integrity,
		keepalive
		//isReloadNavigation,
		//isHistoryNavigation
	};
}

export const load = async (loadEvent) => {
    function serializePlatform(platform: typeof loadEvent.platform) {
	if (!platform) {
		return null;
	}
	const { cf } = platform;

	return {
		cf
	};
}
	//console.log(loadEvent);

	const { isDataRequest, isSubRequest, route, locals } = loadEvent;

	// prettier-ignore
	const loadEventSerialized = {     
		request:          await serializeRequest(loadEvent.request),
		url:              loadEvent.url.href,
		cookies:          loadEvent.cookies.getAll(),
		getClientAddress: loadEvent.getClientAddress(),
        platform:         serializePlatform(loadEvent.platform),

        params:           {...loadEvent.params},
		route,
		isDataRequest,
		isSubRequest,
        locals,
	};

	function getType(v: unknown) {
		if (typeof v !== 'object') {
			return typeof v;
		} else if (v === null) {
			return 'null';
		}
		const cname = v.constructor.name;
		return cname === 'Object' ? 'object' : cname;
	}

	// Ensure function and undefined sorted last
	const sortingType = ({ type1, type2 }: { type1: string; type2: string }) =>
		`${[type1, 'undefined'].includes(type2) ? '' : '_'}${type1}${type2}`
			.replaceAll('function', 'y')
			.replaceAll('undefined', 'z');

	const keys = Object.keys(loadEvent)
		.map((k) => {
			const key = k as keyof typeof loadEvent;
			const type1 = getType(loadEvent[key]);
			const type2 = getType(loadEventSerialized[key as keyof typeof loadEventSerialized]);
			const status = Object.keys(loadEventSerialized).includes(key)
				? '*'
				: type1 === 'function'
					? ' '
					: '?';

			return { key, type1, type2, status };
		})
		.sort((a, b) => {
			const aType = sortingType(a);
			const bType = sortingType(b);
			if (aType === bType) {
				return a.key > b.key ? 1 : -1;
			}
			return aType > bType ? 1 : -1;
		});

	///console.log(loadEvent);
	///console.log(loadEventSerialized);
	/*
	console.log(
		keys
			.map(
				({ status, key, type1, type2 }) =>
					`${status} ${key.padEnd(16)} ${type1.padEnd(9)} ${(type1 === type2 ? ' ' : type2).padEnd(10)}`
			)
			.join('\n')
	);
	*/

	return { loadEventSerialized, keys };
};
