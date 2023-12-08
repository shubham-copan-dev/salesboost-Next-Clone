// - - form fields - - - -
export const errorType: string[] = [
  'manual',
  'required',
  'pattern',
  'validate',
  'minLength',
  'maxLength',
  'max',
  'min',
  'positive',
  'lessThanTen',
  'greaterThan',
  'checkUrl',
];

// ag grid field types
export const fieldTypes = {
  REFERENCE: 'reference',
  BOOLEAN: 'boolean',
  STRING: 'string', // done
  TEXTAREA: 'textarea', // done
  PICKLIST: 'picklist', // done
  CURRENCY: 'currency', // done
  PERCENT: 'percent',
  DOUBLE: 'double',
  DATE: 'date',
  DATETIME: 'datetime',
  EDITFORM: 'editForm',
  INT: 'int',
};

export const operators = [
  { id: '1', label: '=', value: '=' },
  { id: '2', label: '!=', value: '!=' },
  { id: '3', label: '>', value: '>' },
  { id: '4', label: '>=', value: '>=' },
  { id: '5', label: '<=', value: '<=' },
  { id: '6', label: 'like', value: 'like' },
  { id: '7', label: 'in', value: 'in' },
  { id: '8', label: 'not', value: 'not' },
  { id: '9', label: 'includes', value: 'includes' },
  { id: '10', label: 'excludes', value: 'excludes' },
];
