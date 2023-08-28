import { get_collection } from "$lib/api/edji.js"

export async function load({ params }) {
    let collection = {}
    try {
        collection = await get_collection(params.collection)
        console.log(collection)
    } catch(err) {
        console.error(err);
        throw "Error getting collection - API could be down.";
    }
    return {
        name: params.collection,
        collection
    };
}