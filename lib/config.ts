export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5292";

// Endpoint path constants
export const GET_PROPERTIES = "/api/properties";
export const GET_FAVORITES = "/api/Favorites";
export const GET_USERS = "/api/users";

// Dynamic endpoint helpers
export const GET_USER_BY_ID = (id: number | string) => `/api/users/${id}`;
export const GET_USER_FAVORITES_PROPERTIES = (userId: number | string) => `/api/Favorites/user/${userId}/properties`;

// Optionally group if desired
export const ENDPOINTS = {
	GET_PROPERTIES,
	GET_FAVORITES,
	GET_USERS,
	GET_USER_BY_ID,
	GET_USER_FAVORITES_PROPERTIES,
};
