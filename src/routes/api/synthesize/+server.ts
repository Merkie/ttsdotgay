import AzureTTS from '$lib/Azure';
import GoogleTTS from '$lib/Google';
import AwsTTS from '$lib/AWS';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { provider, text, voice, name } = await request.json();

	// synthesize based on provider
	if (provider === 'azure') {
		const lastWord = name.split(' ').pop();
		if (lastWord === lastWord.toLowerCase()) {
			return new Response((await AzureTTS(text, voice.privShortName, lastWord)) as BodyInit, {
				status: 200
			});
		} else {
			return new Response((await AzureTTS(text, voice.privShortName, '')) as BodyInit, {
				status: 200
			});
		}
	}
	if (provider === 'google') {
		return new Response(await GoogleTTS(text, voice.languageCode, voice.ssmlGender), {
			status: 200
		});
	}
	if (provider === 'aws') {
		return new Response(await AwsTTS(text, voice.voice, voice.engine), { status: 200 });
	}

	// return error if provider is not supported
	return new Response('No valid provider specified', { status: 400 });
};
