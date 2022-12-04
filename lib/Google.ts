import tts from "@google-cloud/text-to-speech";

export const synthesize = async (id: string, text: string) => {
  const response = await fetch(
    `https://content-texttospeech.googleapis.com/v1beta1/text:synthesize?alt=json&key=${process.env.GCLOUD_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audioConfig: {
          audioEncoding: "MP3",
        },
        input: {
          text,
        },
        voice: {
          languageCode: id.split("-").slice(0, 2).join("-"),
          name: id,
        },
      }),
    }
  );
  const { audioContent } = await response.json();
  return "data:audio/mpeg;base64," + audioContent;
};

export const list = async () => {
  const response = await fetch(
    `https://content-texttospeech.googleapis.com/v1beta1/voices?key=${process.env.GCLOUD_KEY}`
  );
  const data = await response.json();
  return data.voices;
};
