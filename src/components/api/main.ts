/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldDefinition } from "@/types/schema";
import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

interface CreateSchemaRequest {
  collectionName: string;
  fields: FieldDefinition[];
}

interface MetaSchemaResponse {
  success: boolean;
  data: any;
}

const SchemaService = {
  createSchema: async (
    payload: CreateSchemaRequest
  ): Promise<MetaSchemaResponse> => {
    return api.post("/schema/create", payload);
  },

  fetchAllSchemas: async (): Promise<MetaSchemaResponse> => {
    return api.get("/schema/fetchAll");
  },

  fetchSchema: async (collectionName: string): Promise<MetaSchemaResponse> => {
    return api.get("/schema/fetch", {
      params: { collectionName },
    });
  },
};

export default SchemaService;
