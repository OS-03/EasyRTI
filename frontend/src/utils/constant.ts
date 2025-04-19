export const USER_API_END_POINT = `${(import.meta as any).env.VITE_BACKEND_API_URL}/user` || "http://localhost:5000/api/v1/user";
export const REQUEST_API_END_POINT = `${(import.meta as any).env.VITE_BACKEND_API_URL}/requests` || "http://localhost:5000/api/v1/requests"; // Ensure this matches the backend route
export const APPLICATION_API_END_POINT = `${(import.meta as any).env.VITE_BACKEND_API_URL}/application` || "http://localhost:5000/api/v1/application";
export const DEPARTMENT_API_END_POINT = `${(import.meta as any).env.VITE_BACKEND_API_URL }/department`