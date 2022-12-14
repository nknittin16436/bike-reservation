import axios from "axios";
const url = "http://localhost:5000";



export const registerUser = async ({ name, email, password, confirmPassword }) => {
    try {
        const res = await axios.post(`${url}/users/signup`, {
            name: name.trim(),
            email: email.trim(),
            password: password,
            confirmPassword: confirmPassword
        });
        // console.log(res);
        if (res.status === 201) {
            return { success: true };
        }
        else {
            return { success: false }
        }
    } catch (error) {
        // console.log(error);
        throw new Error(error.response.data.message)
    }
}


export const loginUser = async ({ email, password }) => {
    try {
        const res = await axios.post(`${url}/users/login`, {
            email: email,
            password: password,
        });
        return res.data;
    } catch (error) {
        // console.log(error);
        throw new Error(error.response.data.message)
    }
}

export const getUsers = async () => {
    const token = localStorage.getItem('bike-user');
    try {
        const res = await axios.get(`${url}/users`, {
            headers: { authtoken: token }
        });
        // console.log(res);
        return res.data;
    } catch (error) {
        // console.log(error);
        throw new Error(error.response.data.message);
    }
}


export const deleteUser = async (id) => {
    const token = localStorage.getItem('bike-user');
    try {
        const res = await axios.delete(`${url}/users/${id}`, {
            headers: { authtoken: token }
        });
        return res.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}


export const editUser = async (id, editedName, editedEmail, editedRole) => {
    const token = localStorage.getItem('bike-user');
    try {
        const res = await axios.patch(`${url}/users/${id}`, {
            name: editedName.trim(),
            email: editedEmail.trim(),
            role: editedRole
        }, {
            headers: { authtoken: token }
        });
        return res.data;
    } catch (error) {
        // console.log(error);
        throw new Error(error.response.data.message)
    }
}

export const getUserDetails = async (token) => {
    try {
        const res = await axios.get(`${url}/users/${token}`);
        // console.log(res);
        return res.data;
    } catch (error) {
        // console.log(error);
        throw new Error(error.response.data.message);

    }
}