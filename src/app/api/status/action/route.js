import { kv } from "@vercel/kv";
import axios from "axios";
import { NextResponse } from "next/server";


export async function POST(req) {
    const statusUrl = req.nextUrl.searchParams.get('statusUrl'); 
    console.log(req.nextUrl.searchParams);
    console.log(statusUrl);
    let message = "Loading ...";

    const body = await req.json();
    const fid = body.untrustedData.fid;
    const choice = body.untrustedData.buttonIndex;
  

    try {
        const response = await axios.get(statusUrl);
        console.log("status", statusUrl, response.data);
        if(response.data.message !== "Ok"){
            throw new Error(`Failed proof, ${response.data.message}`);
        }
        message = `Your FID ${fid} has been verified! Developers can check your verification at https://next-pppop.vercel.app/api/status?fid=${fid}`;
        await kv.set(fid, "Verified as a Person!");
    }
    catch (error) {
        message = "Error: " + error.message;
        await kv.set(fid, message);
    }
    
    return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
            <head>
                <title>PPPoP</title>
                <meta property="og:title" content="PPPoP" />
                <meta property="og:image" content="https://next-pppop.vercel.app/api/status/image?message=${message}&date=${Date.now()}" />
                <meta name="fc:frame" content="vNext" />
                <meta name="fc:frame:image" content="https://next-pppop.vercel.app/api/status/image?message=${message}&date=${Date.now()}" />
                <meta name="fc:frame:post_url" content="https://next-pppop.vercel.app/api/status/action?statusUrl=${statusUrl}" />
                <meta name="fc:frame:button:1" content="Refresh" />            
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

export async function GET(req) {
    const statusUrl = req.nextUrl.searchParams.get('statusUrl');
    const fid = req.nextUrl.searchParams.get('fid');
    const message = await kv.get(fid);
    return new NextResponse(
        JSON.stringify({
            fid: fid,
            message: message,
            statusUrl: statusUrl,
        }), {
          status: 200,
          headers: {
            "Content-Type": "text/json",
          },
        }
      );

}
