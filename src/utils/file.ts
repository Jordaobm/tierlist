import { IFile } from "../App";

export const fileToBase64 = async (file: File) => {
  const p = new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });

  return await p;
};

export const base64ToFile = (
  base64String: string,
  filename: string,
  mimeType: string
) => {
  mimeType = mimeType || (base64String.match(/^data:([^;]+);/) || "")[1];
  var byteString = atob(base64String.split(",")[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  var blob = new Blob([ab], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
};

export const fileToBase64Array = async (files: IFile[]) => {
  return await Promise.all(
    files?.map(async (e) => {
      const r = await fileToBase64(e?.file);
      return { ...e, base64: String(r), base64FileName: e?.file?.name };
    })
  );
};
