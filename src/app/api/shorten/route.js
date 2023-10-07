import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

import connectMongoDB from "@/config/database";
import Url from "@/models/url";

const verifyEndpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const secret = process.env.SECRET_KEY

export async function POST(request) {
    try {
        const requestData = await request.json();

        if (!requestData.url && !requestData.token) {
            return NextResponse.json(
                { message: "Invalid parameters" },
                { status: 400 },
            );
        };

        const token = requestData.token;

        const res = await fetch(verifyEndpoint, {
            method: 'POST',
            body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        })
    
        const data = await res.json()

        if (data.success) {
            let url;
            let unique;
    
            url = requestData.url;
    
            await connectMongoDB();
    
            if (!requestData.customAddress) {
                unique = nanoid(5);
            } else {
                const existingUrl = await Url.findOne({ unique: requestData.customAddress });
    
                if (existingUrl) {
                    return NextResponse.json(
                        { message: "Custom unique already exists" },
                        { status: 400 }
                    );
                };
    
                unique = requestData.customAddress;
            }
    
            const query = await Url.create({ 
                url: url,
                unique: unique
            });
    
            return NextResponse.json(
                { message: "Success shorten URL", data: query },
                { status: 200 },
            );
        } else {
            return NextResponse.json(
                { message: "Cant confirmation your security code" },
                { status: 400 }
            )
        }
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
}