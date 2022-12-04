import { PassThrough } from "stream";
import { Buffer } from "buffer";
import dotenv from "dotenv";
dotenv.config();

const sdk = require("microsoft-cognitiveservices-speech-sdk");

export const synthesize = async (id: string, variant: string, text: string) => {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.AZURE_KEY + "",
    process.env.AZURE_REGION + ""
  );
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  const ssml = `
		<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
		xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
			<voice name="${id}">
					<mstts:express-as style="${variant}">
							${text}
					</mstts:express-as>
			</voice>
		</speak>`;

  return new Promise((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      ssml,
      (result: any) => {
        const { audioData } = result;
        synthesizer.close();
        // return stream from memory
        const bufferStream = new PassThrough();
        bufferStream.end(Buffer.from(audioData));
        resolve(
          "data:audio/mpeg;base64," + bufferStream.read().toString("base64")
        );
      },
      (error: any) => {
        synthesizer.close();
        reject(error);
      }
    );
  });
};

export const list = async () => {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.AZURE_KEY + "",
    process.env.AZURE_REGION + ""
  );
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  return (await synthesizer.getVoices()).privVoices;
};
