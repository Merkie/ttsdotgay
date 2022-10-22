import type { RequestHandler } from './$types';
import Voices from '$lib/Voices';

export const GET: RequestHandler = async () => {
	return new Response(JSON.stringify(Voices), { status: 200 });
};
