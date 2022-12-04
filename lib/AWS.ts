import aws from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const polly = new aws.Polly({
  signatureVersion: "v4",
  region: "us-east-1",
  accessKeyId: process.env.TTSDOTGAY_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.TTSDOTGAY_AWS_SECRET_ACCESS_KEY,
});

export const synthesize = async (
  voice: string,
  engine: string,
  text: string
) => {
  const params = {
    Engine: "standard",
    OutputFormat: "mp3",
    Text: text,
    VoiceId: voice,
  };

  const audio = await polly.synthesizeSpeech(params).promise();
  if (!audio.AudioStream) return null;
  return "data:audio/mpeg;base64," + audio.AudioStream.toString("base64");
};

export const list = async () => {
  const voices = await polly.describeVoices().promise();
  return voices.Voices;
};
