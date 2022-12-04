import { Voice } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import VoicesTable from "../components/VoicesTable";
import prisma from "../lib/prisma";
import Head from "next/head";

export async function getServerSideProps() {
  const voices = await prisma.voice.findMany();
  return {
    props: {
      data: {
        voices,
        count: [...voices.map((voice) => voice.useCount)].reduce(
          (a, b) => a + b,
          0
        ),
        host: process.env.HOST,
      },
    },
  };
}

function Page({
  data,
}: {
  data: { voices: Voice[]; host: string; count: number };
}) {
  // refs
  const idInput = useRef<HTMLInputElement>(null);
  const textTArea = useRef<HTMLTextAreaElement>(null);
  const variantInput = useRef<HTMLInputElement>(null);
  const [selectedVoiceName, setSelectedVoiceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [curlCommand, setCurlCommand] = useState("");

  const synthesize = async () => {
    setLoading(true);
    const res = await fetch(process.env.HOST + "/api/v1/synthesize", {
      method: "POST",
      body: JSON.stringify({
        id: idInput.current?.value,
        text: textTArea.current?.value,
        variant: variantInput.current?.value,
      }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.audio) {
      const audio = new Audio(json.audio);
      audio.play();
    }
  };

  const updateVoiceName = () => {
    const voice = data.voices.find(
      (v) => v.id + "" === idInput.current?.value + ""
    );
    if (voice) {
      setSelectedVoiceName(voice.name);
    } else {
      setSelectedVoiceName("");
    }
  };

  useEffect(() => {
    setCurlCommand(
      `
      curl -X POST ${data.host}/api/v1/synthesize
      -H "Content-Type: application/json" 
      -d '{"id": ${idInput.current?.value || ""}, "text": "${
        textTArea.current?.value || ""
      }", "variant": "${variantInput.current?.value || ""}"}' 
      `
    );
  }, [loading, data.host]);

  return (
    <>
      <Head>
        <title>TTS.gay</title>
      </Head>
      <main>
        <div
          style={{ padding: "50px", background: "#05299E", color: "#9DB3FB" }}
        >
          <p>
            TTS.gay is a free and{" "}
            <a
              style={{ color: "#9DB3FB" }}
              href="https://github.com/merkie/ttsdotgay"
            >
              open source
            </a>{" "}
            cloud text-to-speech access platform that compiles voices from
            providers like Google, Microsoft Azure, and Amazon Web Services, and
            brings them to developers and consumers at no cost. You can use this
            service via the API as demonstrated down below. So far, TTS.gay has
            fufilled {data.count} text to speech requests. TTS.gay was created
            with 💙 by{" "}
            <a style={{ color: "#9DB3FB" }} href="https://github.com/merkie">
              Archer (merkie)
            </a>
            .
          </p>
        </div>
        <VoicesTable voices={data.voices} />
        <div
          style={{
            background:
              "linear-gradient(0deg, rgba(51,65,85,0) 0%, #05299E 100%)",
            height: "75px",
            marginBottom: "50px",
            position: "relative",
          }}
        >
          <h1
            style={{
              position: "absolute",
              top: "-150%",
              left: "5%",
              fontSize: "7.5rem",
              color: "#05299E",
              opacity: "0.1",
              zIndex: 1,
            }}
          >
            Try the API
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "clamp(300px, 50%, 600px)",
            margin: "0 auto",
            background: "#09090b",
            padding: "50px",
            zIndex: 10,
          }}
        >
          <h1 style={{ fontSize: "2.5rem", marginBottom: 0 }}>Try the API</h1>
          <p>ID</p>
          <input onInput={updateVoiceName} ref={idInput} type="number" />
          {selectedVoiceName && (
            <>
              <p style={{ margin: "10px 0", opacity: 0.75 }}>
                Voice: {selectedVoiceName}
              </p>
              <p style={{ margin: 0, opacity: 0.75 }}>
                {"Variants: " +
                  data.voices
                    .find(
                      (voice) => voice.id + "" === idInput.current?.value + ""
                    )
                    ?.variants.join(", ")}
              </p>
            </>
          )}
          <p>Text</p>
          <textarea ref={textTArea} />
          <p>Variant (optional)</p>
          <input ref={variantInput} type="text" />
          <button
            onClick={synthesize}
            disabled={loading}
            style={{
              marginTop: "25px",
              background: "#05299E",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              color: "white",
              cursor: "pointer",
              opacity: loading ? 0.75 : 1,
              position: "relative",
              height: "40px",
            }}
          >
            {loading ? <span className="loader" /> : "Synthesize"}
          </button>
          <code style={{ marginTop: "20px" }}>{curlCommand}</code>
        </div>
      </main>
    </>
  );
}

export default Page;
