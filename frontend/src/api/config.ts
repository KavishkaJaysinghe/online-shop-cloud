/**
 * Configuration for the microservices API endpoints.
 * Uses Vite environment variables for flexibility between Local and Cloud.
 */

const BASE_GATEWAY = import.meta.env.VITE_API_GATEWAY_URL || "https://api-gateway.jollymeadow-0e869f40.southeastasia.azurecontainerapps.io";

export const API_CONFIG = {
  AUTH_SERVICE: `${BASE_GATEWAY}/auth`,
  PRODUCT_SERVICE: `${BASE_GATEWAY}/products/api`,
  ORDER_SERVICE: `${BASE_GATEWAY}/orders`,
};
