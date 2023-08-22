export const BACKEND = "http://api:4001";

export async function check_status() {
    try {
        const res = await fetch(`${BACKEND}/status`);
        return await res.json();
    } catch(err) {
        console.error(err);
        throw "Error checking status - API could be down.";
    }
}

export async function get_collections() {
    try {
        console.log(`${BACKEND}/model`);
        const res = await fetch(`${BACKEND}/model`);
        return await res.json();
    } catch(err) {
        console.error(err);
        throw "Error getting collections - API could be down.";
    }
}

export async function get_collection(collection) {
    try {
        const res = await fetch(`${BACKEND}/model/${collection}`);
        return await res.json();
    } catch(err) {
        console.error(err);
        throw "Error getting collection - API could be down.";
    }
}