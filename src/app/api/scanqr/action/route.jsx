import { NextResponse } from "next/server";
import satori from "satori";
import sharp from "sharp";
import { join } from "path";
import * as fs from "fs";
import kv from '@vercel/kv';
import { uuid } from 'uuidv4';
import {
  getSSLHubRpcClient,
  Message,
  UserDataType,
} from "@farcaster/hub-nodejs";
import { ReclaimClient } from '@reclaimprotocol/js-sdk'
import axios from "axios";
const HUB_URL = process.env["HUB_URL"] || "nemes.farcaster.xyz:2283";
const hubClient = getSSLHubRpcClient(HUB_URL);

const interRegPath = join(process.cwd(), "public/Inter-Regular.ttf");
let interReg = fs.readFileSync(interRegPath);

const interBoldPath = join(process.cwd(), "public/Inter-Bold.ttf");
let interBold = fs.readFileSync(interBoldPath);

export async function POST(req) {
  const body = await req.json();
  const fid = body.untrustedData.fid;
  const choice = body.untrustedData.buttonIndex;
  const getVerificationReq = async () => {
    const reclaimClient = new ReclaimClient("0x60FD1d47fFFB2796829Df855DAdb6571e2343B10" );
    const providers = ['Uber US - 2'];
    const APP_SECRET ="0xfa63d69c0faccfc0ef8b48e8a980902ff0ebc8e41405e2814d1530ba7b613af3";
    const providerV2 = await reclaimClient.buildHttpProviderV2ByName(
      providers
    );

    await reclaimClient.addContext(`FID::${fid}`, "Farcaster PPPoP")

    const requestProofs = await reclaimClient.buildRequestedProofs(
      providerV2,
      await reclaimClient.getAppCallbackUrl()
    );
    reclaimClient.setSignature(
        await reclaimClient.getSignature(
        requestProofs,
        APP_SECRET
      )
    );
    const reclaimReq = await reclaimClient.createVerificationRequest(providers);
    const url = await reclaimReq.start();
    
    return {proofUrl: url, statusUrl: reclaimClient.getStatusUrl() };
  }

  const {proofUrl, statusUrl} = await getVerificationReq();

  console.log(proofUrl, statusUrl);
  const alias = uuid().substring(0,20);
  const tinyUrlResponse = await axios.post('https://api.tinyurl.com/create?api_token=GIQZYcwEJBwPkytdy5BCi2YcprsyrWJRW9QYvxs3MqxAtbxWwVvBpq1lB8pd', {
    "url": proofUrl,
    "domain": "tinyurl.com",
    "alias": `pppop-${alias}`,
    "description": "string"
  });

  const shortUrl = tinyUrlResponse.data.data.tiny_url;
  console.log(shortUrl);


  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
        <head>
            <title>PPPoP</title>
            <meta property="og:title" content="PPPoP" />
            <meta property="og:image" content="https://next-pppop.vercel.app/api/scanqr/image?proofUrl=${shortUrl}&date=${Date.now()}" />
            <meta name="fc:frame" content="vNext" />
            <meta name="fc:frame:image" content="https://next-pppop.vercel.app/api/scanqr/image?proofUrl=${shortUrl}&date=${Date.now()}" />
            <meta name="fc:frame:post_url" content="https://next-pppop.vercel.app/api/status/action?statusUrl=${statusUrl}" />
            <meta name="fc:frame:button:1" content="Check Status" />            
        </head>
        <body><h1>PPPoP!</h1></body>
    </html>
    `, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}

