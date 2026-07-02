const BASE_URL = "http://localhost:8000";

export async function api(endpoint, options = {}) {

    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${BASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    if (!response.ok) {

        let message = "Something went wrong";

        try {
            const error = await response.json();
            message = error.detail || message;
        } catch {}

        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}