import type { NextApiRequest, NextApiResponse } from "next";
import { synthesize as synthesizeAWS } from "../../../lib/AWS";
import { synthesize as synthesizeAzure } from "../../../lib/Azure";
import { synthesize as synthesizeGCP } from "../../../lib/Google";
import prisma from "../../../lib/prisma";
import NextCors from "nextjs-cors";

type Data = {
  success: boolean;
  message?: string;
  audio?: string;
};

// Router function that handles the synthesis request
// and sends it to the corrent provider's synthesis function
const synthesize = (
  provider: string,
  text: string,
  id: string,
  variant: string
) => {
  switch (provider) {
    case "aws":
      return synthesizeAWS(id, variant, text);
    case "azure":
      return synthesizeAzure(id, variant, text);
    case "gcp":
      return synthesizeGCP(id, text);
    default:
      return null;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  // This route is post only
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Method not allowed" });
    return;
  }

  // Get the provider, voice id, variant, and text from the request body
  const { id, text, variant } =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  // Get the voice from the database
  const voice = await prisma.voice.findFirst({
    where: { id: parseInt(id + "") },
  });

  // If the voice does not exist, return an error
  if (!voice) {
    res.status(404).json({ success: false, message: "Voice not found" });
    return;
  }

  // If the requested variant is not supported by the voice, return an error
  if (!voice.variants.includes(variant) && variant !== "") {
    res.status(400).json({ success: false, message: "Variant not found" });
    return;
  }

  // Synthesize the text using the voice and variant
  const result = await synthesize(
    voice.provider,
    text,
    voice.providerId,
    variant
  );

  // If no result, return an error
  if (!result) {
    res.status(500).json({ success: false, message: "Synthesis failed" });
    return;
  }

  // Update the voice in the database with an incremented useCount
  await prisma.voice.update({
    where: { id: parseInt(id + "") },
    data: {
      useCount: {
        increment: 1,
      },
    },
  });

  // Return the audio
  res.status(200).json({ success: true, audio: result + "" });
}
