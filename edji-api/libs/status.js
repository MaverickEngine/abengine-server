const count_users = async (User) => {
    try {
        const count = await User.countDocuments();
        return count;
    } catch(err) {
        console.error(err);
        throw err;
    }
}

const check_status = async (User) => {
    try {
        const count = await count_users(User);
        console.log({ count });
        if (count === 0) {
            return {
                state: "setup",
                message: "No users found. Please run setup."
            }
        }
        return {
            state: "ok",
            message: "EDJI API is running."
        }
    } catch(err) {
        return {
            state: "error",
            message: err.toString()
        }
    }
}

module.exports = {
    check_status
}