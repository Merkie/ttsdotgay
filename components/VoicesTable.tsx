import { Voice } from "@prisma/client";
import { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";

createTheme(
  "solarized",
  {
    text: {
      primary: "#9DB3FB",
      secondary: "#5E4AE3",
    },
    background: {
      default: "#05299E",
    },
    context: {
      background: "#F26CA7",
      text: "#FCD9E8",
    },
    divider: {
      default: "#062EB2",
    },
    button: {
      default: "#2aa198",
      hover: "rgba(0,0,0,.08)",
      focus: "rgba(255,255,255,.12)",
      disabled: "rgba(255, 255, 255, .34)",
    },
    sortFocus: {
      default: "#2aa198",
    },
  },
  "dark"
);

const columns = [
  {
    name: "ID",
    selector: (row: Voice) => row.id,
    sortable: true,
  },
  {
    name: "Name",
    selector: (row: Voice) => row.name,
    sortable: true,
  },
  {
    name: "Gender",
    selector: (row: Voice) => row.gender,
    sortable: true,
  },
  {
    name: "Language",
    selector: (row: Voice) => row.languageCode,
    sortable: true,
  },
  {
    name: "Variants",
    selector: (row: Voice) => row.variants.join(", "),
    sortable: true,
  },
  {
    name: "Provider",
    selector: (row: Voice) => row.provider,
    sortable: true,
  },
];

export default function VoicesTable({ voices }: { voices: Voice[] }) {
  const [formattedVoices, setFormattedVoices] = useState<Voice[]>([]);
  useEffect(() => {
    setFormattedVoices(
      voices.map((voice) => ({
        ...voice,
        variants: voice.variants.filter(
          (variant) => variant !== "standard" && variant !== "neural"
        ),
      }))
    );
  }, [voices]);

  return (
    <DataTable
      title={"Voices we offer"}
      theme={"solarized"}
      pagination={true}
      // selectableRows={true}
      columns={columns}
      data={formattedVoices}
    />
  );
}
