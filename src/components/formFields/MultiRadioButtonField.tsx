/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from 'react';
import { RegisterOptions, useController } from 'react-hook-form';

import { errorType } from '@/utilities/constants';

/**
 * @property types
 */
interface Options {
  label: string;
  value: number | string;
}

interface Field {
  name: string;
  label: string;
  control: any;
  options: Options[];
  rules?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  defaultValue?: string | number;
  normalize?: any;
  mainClass?: string;
  labelClass?: string;
  inputClass?: string;
  errorClass?: string;
  onChange?: any;
  inputProps?: object;
}

/**
 * @property defaults
 */
const defaultProps = {
  defaultValue: '',
  rules: {},
  mainClass: 'col-sm-4',
  labelClass: 'form-label',
  inputClass: 'form-check-input',
  errorClass: 'error-msg',
  normalize: (value: any) => value,
  onChange: (value: any) => value,
  inputProps: {},
};

/**
 * Multiple radio button field
 * @function {normalize} can modify input value, default return normal value
 * @property {*} props
 * @returns entered input
 */

function MultipleRadioButtonField({
  name,
  label,
  control,
  rules,
  defaultValue,
  options,
  normalize,
  mainClass,
  labelClass,
  inputClass,
  errorClass,
  onChange,
  inputProps,
}: Field & typeof defaultProps) {
  // use hooks
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  // handling input change
  const onInputChange = (value: string | number) => {
    onChange(normalize(value)); // send value to provided func
    field.onChange(normalize(value)); // send value to hook form
  };

  return (
    <div className={mainClass}>
      <label htmlFor={name} className={labelClass}>
        {label}
        {rules?.required ? <span className="forms-req-symbol">*</span> : ' (Optional)'}
      </label>
      <div className="custom-radio">
        {options?.map((op) => (
          <div key={op?.value} className="form-check form-check-inline">
            <input
              id={`${op?.value}`}
              type="radio"
              className={`${inputClass} ${error && 'required-field-error'}`}
              onChange={() => onInputChange(op?.value)}
              checked={field.value !== '' && op?.value === field.value}
              {...inputProps}
            />
            <label htmlFor={`${op?.value}`} className="form-check-label">
              {op?.label}
            </label>
          </div>
        ))}
        {errorType?.map(
          (type) =>
            error?.type === type &&
            error?.message !== '' && (
              <p key={type} className={errorClass}>
                {error?.message}
              </p>
            )
        )}
      </div>
    </div>
  );
}

/**
 * @property defaults
 */
MultipleRadioButtonField.defaultProps = defaultProps;

export default memo(MultipleRadioButtonField);
