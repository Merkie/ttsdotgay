import aws from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

export default async (text: string, voice: string, engine: string) => {
	const polly = new aws.Polly({
		signatureVersion: 'v4',
		region: 'us-east-1',
		accessKeyId: process.env.TTSDOTGAY_AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.TTSDOTGAY_AWS_SECRET_ACCESS_KEY
	});

	const params = {
		Engine: engine,
		OutputFormat: 'mp3',
		Text: text,
		VoiceId: voice
	};

	const audio = await polly.synthesizeSpeech(params).promise();
	if (!audio.AudioStream) return null;

	return 'data:audio/mpeg;base64,' + audio.AudioStream.toString('base64');
};
