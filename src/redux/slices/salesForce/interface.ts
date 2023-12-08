export declare interface TabInterface {
  _id: string;
  isActive: boolean;
  columnDetails: {
    name: string;
    isVisible: boolean;
    columnOrder: number;
  }[];
  user: string;
  isDefault: boolean;
  view: string;
  visibility: string;
  tenant: string;
  sfObject: string;
  name: string;
  description: string;
  filter: unknown;
  label: string;
  defaultFieldUIData: {
    name: string;
    isVisible: boolean;
    columnOrder: unknown;
  };
  query: {
    type: string;
    fields: {
      name: string;
      columnOrder: number;
      isVisible: boolean;
    }[];
    object: string;
    filter: {
      type: string;
      expression: {
        field: string;
        operator: string;
        value: string;
      }[];
    };
    limit: number;
  };
}

export declare interface ColumnMetaInterface {
  aggregatable: boolean;
  name: string;
  sortable: boolean;
  label: string;
  picklistValues: {
    active: boolean;
    defaultValue: boolean;
    label: string;
    validFor: unknown;
  }[];
  uiMetadata: {
    name: string;
    columnOrder: number;
    isVisible: boolean;
    isBulkEditable: boolean;
    width: number;
  };
  type: string;
  unique: boolean;
  groupable: boolean;
  filterable: boolean;
  updateable: boolean;
}

export declare interface RecordsInterface {
  attributes: {
    type: string;
    url: string;
  };
  Id: string;
  Name: string;
  StageName: string;
  Description: string;
  Amount: number;
  ExpectedRevenue: number;
  TotalOpportunityQuantity: number;
  CloseDate: string;
  IsClosed: boolean;
  Type: string;
}

export declare interface AddNewTabInterface {
  view: string;
  label: string;
  description: string;
  query: {
    type: string;
    fields: {
      name: string;
      columnOrder: number;
      isVisible: boolean;
    }[];
    object: string;
    filter: {
      type: string;
      expression: {
        field: string;
        operator: string;
        value: string;
      }[];
    };
    limit: number;
  };
}

export declare interface ViewByInterface {
  _id: string;
  isActive: boolean;
  columnDetails: {
    name: string;
    isVisible: boolean;
    columnOrder: number;
  }[];
  user: string;
  isDefault: boolean;
  view: string;
  visibility: string;
  tenant: string;
  sfObject: string;
  label: string;
  name: string;
  description: string;
  defaultFieldUIData: {
    name: string;
    isVisible: boolean;
    columnOrder: number;
  };
  query: {
    type: string;
    fields: {
      name: string;
      columnOrder: number;
      isVisible: boolean;
    }[];
    object: string;
    filter: {
      type: string;
      expression: {
        field: string;
        operator: string;
        value: string;
      }[];
    };
    limit: number;
  };
}

export declare interface AllFieldsInterface {
  aggregatable: boolean;
  aiPredictionField: boolean;
  autoNumber: boolean;
  byteLength: number;
  calculated: boolean;
  calculatedFormula: unknown;
  cascadeDelete: boolean;
  caseSensitive: boolean;
  compoundFieldName: unknown;
  controllerName: unknown;
  createable: boolean;
  custom: boolean;
  defaultValue: unknown;
  defaultValueFormula: unknown;
  defaultedOnCreate: boolean;
  dependentPicklist: boolean;
  deprecatedAndHidden: boolean;
  digits: number;
  displayLocationInDecimal: boolean;
  encrypted: boolean;
  externalId: boolean;
  extraTypeInfo: unknown;
  filterable: boolean;
  filteredLookupInfo: unknown;
  formulaTreatunknownNumberAsZero: boolean;
  groupable: boolean;
  highScaleNumber: false;
  htmlFormatted: false;
  idLookup: boolean;
  inlineHelpText: unknown;
  label: string;
  length: number;
  mask: unknown;
  maskType: unknown;
  name: string;
  nameField: boolean;
  namePointing: boolean;
  nillable: boolean;
  permissionable: boolean;
  picklistValues: {
    active: boolean;
    defaultValue: boolean;
    label: string;
    validFor: unknown;
    value: string;
  }[];
  polymorphicForeignKey: boolean;
  precision: number;
  queryByDistance: boolean;
  referenceTargetField: unknown;
  referenceTo: [];
  relationshipName: unknown;
  relationshipOrder: unknown;
  restrictedDelete: boolean;
  restrictedPicklist: boolean;
  scale: number;
  searchPrefilterable: boolean;
  soapType: string;
  sortable: boolean;
  type: string;
  unique: boolean;
  updateable: boolean;
  writeRequiresMasterRead: boolean;
}
export declare interface SalesForceState {
  gridTabs: TabInterface[] | null;
  panelView: 'grid' | 'kanban';
  columnMeta: ColumnMetaInterface[] | null;
  records: RecordsInterface[] | null;
  allFields: AllFieldsInterface[] | null;
  viewByMeta: ViewByInterface[] | null;
  selectedViewBy: string;
  selectedRows: RecordsInterface[] | null;
  createRecordPopup: boolean;
  fieldUpdateMode: 'instant' | 'submit';
  editedFields:
    | {
        attributes: {
          type: string;
        };
        id: string;
        [key: string]: string | number | object;
      }[]
    | null;
  limit: number;
  reFetchTabs: number;
  reFetchViewBy: number;
}
