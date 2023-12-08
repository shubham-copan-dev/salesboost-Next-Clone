/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, memo, useEffect } from 'react';
import { useState } from 'react';
import { Controller, RegisterOptions } from 'react-hook-form';

import { Editor } from '@tinymce/tinymce-react';

import { errorType } from '@/utilities/constants';

/**
 * @property types
 */
interface Field {
  name: string;
  label?: string;
  control: any;
  rules?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  defaultValue?: string | number;
}

/**
 * @property defaults
 */
const defaultProps = {
  defaultValue: '',
  label: '',
  rules: {},
};

function EditorField({ control, rules, name, defaultValue }: Field & typeof defaultProps) {
  const [val, setVal] = useState('');

  // function example_image_upload_handler(blobInfo, success, failure, progress) {
  //   var xhr, formData;

  //   xhr = new XMLHttpRequest();
  //   xhr.withCredentials = false;
  //   xhr.open('POST', `${BASE_URL}/attachment/upload`);

  //   xhr.upload.onprogress = function (e) {
  //     progress((e.loaded / e.total) * 100);
  //   };

  //   xhr.onload = function () {
  //     var json;

  //     if (xhr.status === 403) {
  //       failure('HTTP Error: ' + xhr.status, { remove: true });
  //       return;
  //     }

  //     if (xhr.status < 200 || xhr.status >= 300) {
  //       failure('HTTP Error: ' + xhr.status);
  //       return;
  //     }

  //     json = JSON.parse(xhr.responseText);

  //     // if (!json || typeof json.location != 'string') {
  //     //   failure('Invalid JSON: ' + xhr.responseText);
  //     //   return;
  //     // }

  //     success(`${BASE_URL}/${json.responseData?.[0]?.path}`);
  //   };

  //   xhr.onerror = function () {
  //     failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
  //   };

  //   formData = new FormData();
  //   formData.append('files', blobInfo.blob(), blobInfo.filename());

  //   xhr.send(formData);
  // }

  useEffect(() => {
    setVal(defaultValue);
  }, [defaultValue]);

  return (
    <>
      <Controller
        control={control}
        rules={rules}
        defaultValue={defaultValue !== undefined ? defaultValue : ''}
        name={name}
        render={({ field: { onChange }, fieldState: { error } }) => {
          return (
            <>
              <Editor
                apiKey="qn3g1knv5co2rx5rupi6ivhjhr0x6f3qo6qlmloesxq442rs"
                initialValue={defaultValue !== undefined ? defaultValue : ''}
                value={val}
                onEditorChange={(newValue) => {
                  setVal(newValue);
                  onChange(newValue);
                }}
                init={{
                  height: 600,
                  branding: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount',
                  ],
                  toolbar:
                    'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  // images_upload_handler: example_image_upload_handler,
                }}
              />
              {errorType?.map((type) => {
                return (
                  <Fragment key={type}>
                    {error?.type === type && error?.message !== '' ? (
                      <span className="error">{error?.message}</span>
                    ) : null}
                  </Fragment>
                );
              })}
            </>
          );
        }}
      />
    </>
  );
}

/**
 * @property defaults
 */
EditorField.defaultProps = defaultProps;

export default memo(EditorField);
