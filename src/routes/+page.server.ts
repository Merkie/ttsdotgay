import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async () => {
	const response = await fetch('https://tts.gay/api/list');
	const list = await response.json();
	return {
		voices: list
	};
};
