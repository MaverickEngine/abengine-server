const BACKEND = "http://backend:4001";

export async function check_status() {
    try {
        const res = await fetch(`${BACKEND}/status`);
        return await res.json();
    } catch(err) {
        console.error(err);
        throw "Error checking status - API could be down.";
    }
}