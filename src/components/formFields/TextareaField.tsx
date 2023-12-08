/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from 'react';
import { Control, RegisterOptions, useController } from 'react-hook-form';

import { errorType } from '@/utilities/constants';

/**
 * @property types
 */
interface Field {
  name: string;
  label?: string;
  control: Control | any;
  rules?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  defaultValue?: string;
  normalize?: any;
  mainClass?: string;
  mainStyle?: object;
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
  label: '',
  rules: {},
  mainClass: 'col-sm-4',
  labelClass: 'form-label',
  inputClass: 'form-control',
  errorClass: 'required-error',
  mainStyle: {},
  normalize: (value: any) => value,
  onChange: (value: any) => value,
  inputProps: {},
};

/**
 * Textarea field
 * @function {normalize} can modify input value, default return normal value
 * @property {*} props
 * @returns entered input
 */
function TextareaField({
  name,
  label,
  control,
  rules,
  defaultValue,
  normalize,
  mainClass,
  mainStyle,
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
  } = useController({ name, control, rules, defaultValue });

  // handling input change
  const onInputChange = (e: any) => {
    const { value } = e.target;
    const { valid } = e.target.validity;

    if (valid) {
      onChange(normalize(value)); // send value to provided func
      field.onChange(normalize(value)); // send value to hook form
    }
  };

  // trimming value on blur
  const onInputBlur = (e: any) => {
    const value = e.target.value.trim();
    onChange(normalize(value)); // send value to provided func
    field.onChange(normalize(value)); // send value to hook form
  };

  return (
    <div className={mainClass} style={mainStyle}>
      {label !== '' && (
        <label htmlFor={name} className={labelClass}>
          {label}
          {rules?.required ? <span className="forms-req-symbol">*</span> : ' (Optional)'}
        </label>
      )}
      <textarea
        {...field}
        id={name}
        className={`${inputClass} ${error && 'required-field-error'}`}
        onChange={onInputChange}
        {...inputProps}
        onBlur={onInputBlur}
      />
      {errorType?.map(
        (err) =>
          error?.type === err &&
          error?.message !== '' && (
            <div key={err} className={errorClass}>
              {error?.message}
            </div>
          )
      )}
    </div>
  );
}

/**
 * @property defaults
 */
TextareaField.defaultProps = defaultProps;

export default memo(TextareaField);
