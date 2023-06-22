const BACKEND = "http://localhost:4001";

export async function check_status() {
    const res = await fetch(`${BACKEND}/status`);
    return await res.json();
}