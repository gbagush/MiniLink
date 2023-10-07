import connectMongoDB from "@/config/database";
import Url from "@/models/url";

import { notFound, redirect } from 'next/navigation';

export default async function RedirectPage({ params }) {
    const { unique } = params;

    await connectMongoDB();
    const result = await Url.findOne({ unique: unique });

    if (result) {
        return redirect(result.url);
    } else {
        return notFound();
    }
}