/* eslint-disable @typescript-eslint/no-explicit-any */

export interface FieldDefinition {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'date';
  }
  
  export interface MetaSchemaDocument {
    _id: string;
    collectionName: string;
    fields: FieldDefinition[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
  export interface CreateSchemaRequest {
    collectionName: string;
    fields: FieldDefinition[];
  }
  
  export interface FetchSchemaRequest {
    collectionName: string;
  }
  
  export interface FetchSchemaResponse extends ApiResponse {
    data?: {
      schema: MetaSchemaDocument;
      collectionData: any[];
    };
  }

  export interface ApiError {
    message: string;
    code?: number;
    details?: Record<string, any>;
  }