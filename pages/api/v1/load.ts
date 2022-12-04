import type { NextApiRequest, NextApiResponse } from "next";
import { list as listAWS } from "../../../lib/AWS";
import { list as listAzure } from "../../../lib/Azure";
import { list as listGCP } from "../../../lib/Google";
import prisma from "../../../lib/prisma";

type Data = {
  success: boolean;
  updated: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // The load route only really needs to be called once so the database
  // can be loaded with voices, but everything this route is visited it
  // checks to see if any new voices from the providers have been added.
  // This can be an authorized or closed route but for now it is open
  // because it is not a security risk.

  // Get all the voices from all the voice providers
  const awsVoices = await listAWS();
  const azureVoices = await listAzure();
  const gcpVoices = await listGCP();

  // This is a giant array of all the voices. Map functions are
  // used to format the data so it is all uniform and ready to be
  // inserted into the database.
  const voices = [
    ...(awsVoices?.map((voice) => ({
      provider: "aws",
      providerId: voice.Id,
      gender: voice.Gender?.toLowerCase(),
      languageCode: voice.LanguageCode,
      name: voice.Name,
      variants: voice.SupportedEngines,
      reference: voice,
    })) as any[]),
    ...azureVoices?.map((voice: any) => ({
      provider: "azure",
      providerId: voice.privShortName,
      gender:
        voice.privGender === 2
          ? "male"
          : voice.privGender === 1
          ? "female"
          : "neutral",
      languageCode: voice.privLocale,
      name: voice.privLocalName,
      variants: voice.privStyleList,
      reference: voice,
    })),
    ...gcpVoices?.map((voice: any) => ({
      provider: "gcp",
      providerId: voice.name,
      gender: voice.ssmlGender.toLowerCase(),
      languageCode: voice.languageCodes[0],
      name: "",
      variants: [],
      reference: voice,
    })),
  ];

  // Send all the voices to the database and skip duplicates
  // so we aren't constantly rewriting the same voices over and over
  const resp = await prisma.voice.createMany({
    data: voices,
    skipDuplicates: true,
  });

  // Return the number of voices that were updated
  res.status(200).json({ success: true, updated: resp.count });
}
