import AzureTTS from '$lib/Azure';
import GoogleTTS from '$lib/Google';
import AwsTTS from '$lib/AWS';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { provider, text, voice, name } = await request.json();
	let response;
	// synthesize based on provider
	if (provider === 'azure') {
		const lastWord = name.split(' ').pop();
		if (lastWord === lastWord.toLowerCase()) {
			response = new Response((await AzureTTS(text, voice.privShortName, lastWord)) as BodyInit, {
				status: 200
			});
		} else {
			response = new Response((await AzureTTS(text, voice.privShortName, '')) as BodyInit, {
				status: 200
			});
		}
	}
	if (provider === 'google') {
		response = new Response(await GoogleTTS(text, voice.languageCode, voice.ssmlGender), {
			status: 200
		});
	}
	if (provider === 'aws') {
		response = new Response(await AwsTTS(text, voice.voice, voice.engine), { status: 200 });
	}

	// response = error if provider is not supported
	response = new Response('No valid provider specified', { status: 400 });

	response.headers.append('Access-Control-Allow-Origin', '*');
	return response;
};