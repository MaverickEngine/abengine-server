import { redirect }  from "@sveltejs/kit"
import { check_status } from "$lib/api/edji.js"

export async function load() {
    // Check status
    let status = {
        state: "unknown",
        message: "Unknown state."
    }
    try {
        status = (await check_status()).status;
    } catch(err) {
        console.error(err);
        status.state = "error";
        status.message = err.toString();
    }
    if (status.state === "setup") {
		throw redirect(307, "/setup")
	}
    if (status.state === "ok") {
        // Do some more checks here
    }
    return {
        status
    };
};