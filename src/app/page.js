import { Metadata } from "next";
import satori from "satori";
import { join } from "path";
import * as fs from "fs";


const interRegPath = join(process.cwd(), "public/Inter-Regular.ttf");
let interReg = fs.readFileSync(interRegPath);

const interBoldPath = join(process.cwd(), "public/Inter-Bold.ttf");
let interBold = fs.readFileSync(interBoldPath);

const buildImage = async (props) => {
  const svg = await satori(
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        padding: 50,
        lineHeight: 1.2,
        fontSize: 24,
        color: "black",
      }}
    >
      <h1>Have you pppop'd yet?</h1>
      <div style={{ display: "flex" }}>
        <p>
          You have 3 ways to prove you're a human
          <ul>
            <li>Prove you've taken more than 1 uber ride</li>
            <li>Prove you've run more than 1 mile on strava</li>
            <li>Prove you've made more than 1 purchase on amazon</li>
          </ul>
        </p>
      </div>
    </div>,
    {
      width: 600,
      height: 400,
      fonts: [
        {
          name: "Inter",
          data: interReg,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: interBold,
          weight: 800,
          style: "normal",
        },
      ],
    },
  );
  return svg;
}

export async function generateMetadata(props, params) {
  return {
    title: "Pppop!",
    description: "privacy preserving proof of personhood",
    openGraph: {
      title: "Pppop!",
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:button:1": "Start",
    },
  };
}

export default async function Home() {
  return (
    <main className="flex flex-col text-center lg:p-16">
      <div className="mt-4">
        <p>Click <a className="text-red-500 underline" href="https://warpcast.com/horsefacts.eth/0x80dd1ea4" target="_blank">here</a> to yoink on Warpcast.</p>
        <p>See the code on <a className="text-red-500 underline" href="https://github.com/horsefacts/yoink" target="_blank">GitHub</a></p>
        {await buildImage()}
      </div>
    </main>
  );
}