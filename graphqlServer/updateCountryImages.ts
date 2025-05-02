import mysql from 'mysql2/promise';

const DATABASE_NAME = 't19_p2';
const DATABASE_USER = 'root';
const DATABASE_PASSWORD = 'password';
const DATABASE_HOST = 'it2810-19.idi.ntnu.no';
const DATABASE_PORT = 3306;

const PIXABAY_API_KEY = '46656355-d8360c8434e096065c1807601';

async function fetchImageUrl(query: string): Promise<string | null> {
    const fetch = require('node-fetch');
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&pretty=true`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json() as { hits: { webformatURL: string }[] };
            if (data.hits && data.hits.length > 0) {
                return data.hits[0].webformatURL;
            }
        }
        console.log(`No image found for ${query}`);
        return null;
    } catch (error) {
        console.error(`Error fetching image for ${query}:`, error);
        return null;
    }
}

async function updateCountryImages() {
    let connection: mysql.Connection | null = null;
    try {
        connection = await mysql.createConnection({
            host: DATABASE_HOST,
            user: DATABASE_USER,
            password: DATABASE_PASSWORD,
            database: DATABASE_NAME,
            port: DATABASE_PORT
        });
        console.log('Connected to the database');

        const [countries] = await connection.query('SELECT id, country_name FROM countries');

        for (const { id, country_name } of countries as any[]) {
            console.log(`Fetching new image for ${country_name}`);
            const imageUrl = await fetchImageUrl(country_name);

            if (imageUrl) {
                await connection.execute('UPDATE countries SET image_url = ? WHERE id = ?', [imageUrl, id]);
                console.log(`Updated ${country_name} with new image URL`);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('All countries updated with new image URLs');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('MySQL connection is closed');
        }
    }
}

updateCountryImages().catch(console.error);
