export enum ResourceType {
  Customer = 'customer',
  Product = 'product',
  Order = 'order',
  Shop = 'shop',
  Variant = 'variant',
  Collection = 'collection',
}

export interface MetaFieldRequest {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

export interface CustomerRequest {
  email: string;
  shop: string;
  namespace?: string;
  key?: string;
  value?: string;
  metafields: MetaFieldRequest;
}

export interface CustomerResponse {
  id?: number;
  verified_email?: boolean;
  status: boolean;
  message: string;
}

export interface MetaFieldResponse {
  status: boolean;
  message: string;
  data?: any;
}
