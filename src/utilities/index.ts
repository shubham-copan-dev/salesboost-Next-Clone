/* eslint-disable @typescript-eslint/no-explicit-any */
export const capsLetter = (value: string) => {
  return value?.toUpperCase();
};

export const getDirtyFields = (formFields: any, dirtyFields: any) => {
  const newValidFields: any = {};
  Object.keys(formFields)?.map((ke) => {
    if (dirtyFields[ke]) {
      newValidFields[ke] = formFields?.[ke];
    }
  });
  return newValidFields;
};

export function CurrencyFormatter({ value }: { value: number }) {
  const formatter = new Intl.NumberFormat(`en-${'US'}`, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  return formatter.format(value);
}

export function removeEmptyFields(data: { [key: string]: any }) {
  Object.keys(data).forEach((key) => {
    if (data[key] === '' || data[key] == null || data[key]?.length === 0 || data[key] === false) {
      delete data[key];
    }
  });
  return data;
}
