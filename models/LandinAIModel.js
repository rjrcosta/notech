import fs from 'fs';
import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';
import pg from "pg"; //Postgres client
import dotenv from 'dotenv';


dotenv.config(); // Load environment variables

const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});



export const landingAi = async (metadata) => {

    const url = 'https://api.va.landing.ai/v1/tools/agentic-object-detection';
    const apiKey = process.env.LANDING_AI_KEY;

    console.log('fetching data from landing ai')
    for (const item of metadata) {
        try {
            const buffer = fs.readFileSync(item.path);
            const formData = new FormData();

            formData.append('image', new Blob([buffer]), item.path);
            formData.append('prompts', item.prompt);
            formData.append('model', 'agentic');

            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Basic ${apiKey}`,
                },
            });

            const result = await response.json();
            console.log(`Results for ${item.path}:`, JSON.stringify(result));

            const detections = result.data?.[0] || [];

            const cmPerPixel = 0.025; // Adjust based on real reference scale

            for (const [index, det] of detections.entries()) {
                const [x_min, y_min, x_max, y_max] = det.bounding_box;
                const width_px = x_max - x_min;
                const height_px = y_max - y_min;
                const area_px = width_px * height_px;

                const width_cm = width_px * cmPerPixel;
                const height_cm = height_px * cmPerPixel;
                const area_cm2 = width_cm * height_cm;

                console.log({
                    label: det.label,
                    index: index + 1,
                    width_px,
                    height_px,
                    area_px,
                    width_cm,
                    height_cm,
                    area_cm2,
                });
            }                

            } catch (error) {
                console.error(`Error processing ${item.path}:`, error);
            }
        }


}