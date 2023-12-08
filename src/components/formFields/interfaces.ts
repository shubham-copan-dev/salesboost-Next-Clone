export declare interface Rule {
  required?: { value: boolean; message: string };
  maxLength?: { value: number; message: string };
  minLength?: { value: number; message: string };
  max?: { value: number; message: string };
  min?: { value: number; message: string };
  pattern?: { value: string; message: string };
  validate?: unknown;
  valueAsNumber?: boolean;
  valueAsDate?: boolean;
  setValueAs?: () => void;
  disabled?: boolean;
  shouldUnregister?: boolean;
  deps?: string[];
}
