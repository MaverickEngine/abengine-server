import { redirect }  from "@sveltejs/kit"

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get("email");
        const password = data.get("password");
        const result = await fetch("http://backend:4001/login", {
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
        console.log(login_result.token);
        if (login_result.token) {
            cookies.set("token", login_result.token);
            console.log("redirecting")
            throw redirect(307, "/dashboard");
        } else {
            return {
                login_error: "Invalid email or password."
            }
        }
    }
}