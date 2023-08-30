import { get_collections } from "$lib/api/edji.js"

export async function load() {
    let collections = []
    try {
        collections = await get_collections()
    } catch(err) {
        console.error(err);
        throw "Error getting collections - API could be down.";
    }
    return {
        collections
    };
}