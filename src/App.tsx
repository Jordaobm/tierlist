import { useState } from "react";
import { v4 } from "uuid";
import { DEFAULT_ROWS } from "./config/constantes";
import { Image } from "./components/Image";

export interface IFile {
  id?: string;
  file: File;
  urlToShow?: string;
  used?: boolean;
}
export interface IRow {
  id: string;
  name: string;
  order: number;
  files: IFile[];
}

export const App = () => {
  const [rows, setRows] = useState<IRow[]>(DEFAULT_ROWS);
  const [files, setFiles] = useState<IFile[]>([]);

  const addRow = () => {
    setRows((prev) => {
      const lastRow = prev?.reduce(
        (acc, item) => {
          if (item?.order > acc?.order) {
            return (acc = item);
          }

          return acc;
        },
        {
          id: "0",
          name: "0",
          order: 0,
        } as IRow
      );

      return [
        ...prev,
        {
          id: v4(),
          name: "Item",
          order: lastRow?.order + 1,
          files: [],
        },
      ];
    });
  };

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const receivedFiles = e?.target?.files;

    if (!receivedFiles || !receivedFiles?.length) return;

    const fs: IFile[] = [];

    for (let i = 0; i <= receivedFiles?.length; i++) {
      const file = receivedFiles?.item(i);
      if (file) {
        fs?.push({ file, urlToShow: URL.createObjectURL(file), id: v4() });
      }
    }

    setFiles((prev) => [...prev, ...fs]);

    e.target.value = "";
  };

  return (
    <div className="w-full flex flex-col h-[100vh]">
      <div
        id="content"
        className="w-full flex flex-col h-[75vh] gap-2 overflow-y-auto"
      >
        <button onClick={addRow} className="bg-lime-700 p-2 rounded">
          Adicionar linha
        </button>

        {rows?.map((row) => (
          <div key={row?.id} id={row?.id} className="border-2  flex row">
            <div className="bg-slate-500 h-[100%] w-20">{row?.name}</div>
            <div className="bg-slate-900 w-[100%] min-h-32 flex flex-wrap">
              {row?.files?.map((file) => (
                <img
                  id={`file-${file?.id}`}
                  className="w-40 min-w-40 h-32 max-h-32"
                  src={file?.urlToShow}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div id="images" className="w-full flex flex-col h-[25vh]">
        <input type="file" multiple onChange={addFiles}></input>

        <div className="w-full flex overflow-x-auto bg-red-500 h-[100%]">
          {files
            ?.filter((e) => !e?.used)
            ?.map((file) => (
              <Image
                key={file?.id}
                file={file}
                setFiles={setFiles}
                setRows={setRows}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
