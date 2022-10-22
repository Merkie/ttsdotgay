import tts from '@google-cloud/text-to-speech';

export default async (
	text: string,
	languageCode: string,
	ssmlGender: 'NEUTRAL' | 'MALE' | 'FEMALE'
) => {
	// create client with api key
	const client = new tts.TextToSpeechClient({
		key: process.env.GCLOUD_KEY
	});

	const request = {
		input: { text },
		// Select the language and SSML voice gender (optional)
		voice: { languageCode, ssmlGender },
		// select the type of audio encoding
		audioConfig: { audioEncoding: 'MP3' }
	};

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	const [response] = await client.synthesizeSpeech(request);

	// return the b64 string
	return 'data:audio/mpeg;base64,' + response.audioContent.toString('base64');
};
