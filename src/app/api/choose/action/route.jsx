import { NextResponse } from "next/server";
import satori from "satori";
import sharp from "sharp";
import { join } from "path";
import * as fs from "fs";


const interRegPath = join(process.cwd(), "public/Inter-Regular.ttf");
let interReg = fs.readFileSync(interRegPath);

const interBoldPath = join(process.cwd(), "public/Inter-Bold.ttf");
let interBold = fs.readFileSync(interBoldPath);

export async function POST() {

  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
        <head>
            <title>PPPoP</title>
            <meta property="og:title" content="PPPoP" />
            <meta property="og:image" content="https://next-pppop.vercel.app/api/choose/image?date=${Date.now()}" />
            <meta name="fc:frame" content="vNext" />
            <meta name="fc:frame:image" content="https://next-pppop.vercel.app/api/choose/image?date=${Date.now()}" />
            <meta name="fc:frame:post_url" content="https://next-pppop.vercel.app/api/scanqr/action" />
            <meta name="fc:frame:button:1" content="1. Uber" />
            <meta name="fc:frame:button:2" content="2. Strava" />
            <meta name="fc:frame:button:3" content="3. Amazon" />
            
        </head>
        <body><h1>PPPoP!</body>
    </html>
    `
  );
}

