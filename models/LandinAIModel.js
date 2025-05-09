import fs from 'fs';
import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';
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

            const data = await response.json();
            console.log(`Results for ${item.path}:`, JSON.stringify(data));
        } catch (error) {
            console.error(`Error processing ${item.path}:`, error);
        }
    }
}