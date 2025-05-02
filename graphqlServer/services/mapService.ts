import db from '../db';

export const getMaps =  async () => {
    try {
        const maps = await db.Map.findAll();  // Use db.Map to fetch maps
        return maps;
    } catch (error) {
        console.error('Error fetching maps:', error);
        throw new Error('Could not fetch maps');
    }
}

export const getMapById = async (id: number ) => {
    try {
        const map = await db.Map.findByPk(id);  // Find map by primary key (id)
        if (!map) {
            throw new Error(`Map with ID ${id} not found`);
        }
        return map;
    } catch (error) {
        console.error('Error fetching map by ID:', error);
        throw new Error('Could not fetch map');
    }
}