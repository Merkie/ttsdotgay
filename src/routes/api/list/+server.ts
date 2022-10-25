import type { RequestHandler } from './$types';
import Voices from '$lib/Voices';

export const GET: RequestHandler = async () => {
	const response = new Response(JSON.stringify(Voices), { status: 200 });
	response.headers.append('Access-Control-Allow-Origin', '*');
	return response;
};
