import { redirect }  from "@sveltejs/kit"
import { BACKEND } from "$lib/api/edji.js";

export const actions = {
    default: async ({ request, locals }) => {
        const data = await request.formData();
        const email = data.get("email");
        const password = data.get("password");
        const result = await fetch(`${BACKEND}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        const login_result = await result.json();
        if (login_result.token) {
            await locals.session.set({ token: login_result.token });
            throw redirect(303, "/dashboard");
        } else {
            return {
                login_error: "Invalid email or password."
            }
        }
    }
}