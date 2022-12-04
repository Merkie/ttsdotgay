import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

type Data = {
  success: boolean;
  voices?: any[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Get all the cached voices from the database
  const voices = await prisma.voice.findMany();

  // Format the voices so the useCount and refrence are removed (the user doesnt need these fields)
  const voicesFormatted = voices.map((voice) => {
    delete (voice as any).reference;
    delete (voice as any).useCount;
    return voice;
  });

  // Return the voices
  res.status(200).json({ voices: voicesFormatted, success: true });
}
