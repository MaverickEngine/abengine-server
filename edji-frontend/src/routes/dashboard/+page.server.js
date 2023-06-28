import { redirect }  from "@sveltejs/kit"
import { check_status } from "$lib/api/edji.js"

export async function load({ cookies }) {
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
		throw redirect(307, "/dashboard/setup")
	}
    // Check login
    let logged_in = false;
    if (status.state === "ok") {
        const token = cookies.get("token");
        if (token) {
            logged_in = true;
        }
        if (!logged_in) {
            throw redirect(307, "/dashboard/login")
        }
    }
    return {
        status,
        logged_in
    };
};