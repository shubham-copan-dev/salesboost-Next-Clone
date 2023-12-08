/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from 'react';
import { Control, RegisterOptions, useController } from 'react-hook-form';

/**
 * @property types
 */
interface Field {
  name: string;
  control: Control | any;
  rules?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  defaultValue?: string | number;
}

/**
 * @property defaults
 */
const defaultProps = {
  defaultValue: '',
  rules: {},
};

/**
 * Hidden field
 * @property {*} props
 * @returns entered input
 */

function HiddenField({ name, control, rules, defaultValue }: Field & typeof defaultProps) {
  // use hooks
  const { field } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  return <input {...field} type="hidden" />;
}

/**
 * @property defaults
 */
HiddenField.defaultProps = defaultProps;

export default memo(HiddenField);
