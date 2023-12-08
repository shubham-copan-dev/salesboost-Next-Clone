export declare interface CommonState {
  fullscreen: boolean;
}

export declare interface TenantInterface {
  _id: string;
  organizationId: string;
  orgSpecificConfigurationLock: boolean;
  clientId: string;
  label: string;
  name: string;
  loginUri: string;
  responseType: string;
  state: string;
}

export declare interface NavInterface {
  _id: string;
  objectType: string;
  user: string;
  tenant: string;
  isDefaultSelected: boolean;
  label: string;
  isActive: boolean;
  visibility: string;
}
