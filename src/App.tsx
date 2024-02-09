import { useState } from "react";
import { v4 } from "uuid";
import { DEFAULT_ROWS } from "./config/constantes";
import { Image } from "./components/Image";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface IFile {
  id?: string;
  file: File;
  urlToShow?: string;
  used?: boolean;
}
export interface IRow {
  id: string;
  name: string;
  color?: string;
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

  const handleChangeOrder = (row: IRow, to: "UP" | "DOWN") => {
    const newRows = rows?.map((e) => {
      if (to === "UP") {
        if (e?.order === row?.order - 1) {
          return { ...e, order: e?.order + 1 };
        }

        if (e?.id === row?.id) {
          return { ...e, order: e?.order - 1 };
        }
      }

      if (to === "DOWN") {
        if (e?.order === row?.order + 1) {
          return { ...e, order: e?.order - 1 };
        }

        if (e?.id === row?.id) {
          return { ...e, order: e?.order + 1 };
        }
      }

      return e;
    });

    setRows(newRows);
  };

  const handleChangeName = (row: IRow, name: string) => {
    setRows((prev) =>
      prev?.map((e) => (e?.id === row?.id ? { ...e, name } : e))
    );
  };

  const handleChangeColor = (row: IRow, color: string) => {
    setRows((prev) =>
      prev?.map((e) => (e?.id === row?.id ? { ...e, color } : e))
    );
  };

  return (
    <div className="w-full flex flex-col h-[100vh] p-4">
      <div
        id="content"
        className="w-full flex flex-col h-[75vh] gap-2 overflow-y-auto"
      >
        <button onClick={addRow} className="bg-lime-700 p-2 rounded ">
          Adicionar linha
        </button>

        {rows
          ?.sort((a, b) => (a?.order > b?.order ? 1 : -1))
          ?.map((row, index) => (
            <div
              key={row?.id}
              id={row?.id}
              className="border-2 border-black flex row"
            >
              <label
                className="bg-slate-500 h-[100%] w-24 flex items-center justify-center"
                style={{ backgroundColor: row?.color }}
                htmlFor={`color-${row?.id}`}
              >
                <input
                  type="text"
                  className="bg-transparent outline-none text-center"
                  value={row?.name}
                  onChange={(event) =>
                    handleChangeName(row, event?.target?.value)
                  }
                />

                <input
                  className="opacity-0 border-none h-0"
                  id={`color-${row?.id}`}
                  type="color"
                  value={row?.color}
                  onChange={(event) =>
                    handleChangeColor(row, event?.target?.value)
                  }
                />
              </label>
              <div className="bg-slate-900 w-[100%] min-h-32 flex flex-wrap">
                {row?.files?.map((file) => (
                  <Image
                    key={file?.id}
                    file={file}
                    setFiles={setFiles}
                    setRows={setRows}
                  />
                ))}
              </div>
              <div className="bg-slate-500 w-20 min-h-32 flex flex-col justify-center gap-4">
                <button
                  disabled={index === 0}
                  className="flex items-center justify-center"
                  onClick={() => handleChangeOrder(row, "UP")}
                >
                  <ChevronUp />
                </button>
                <button
                  disabled={rows?.length === index + 1}
                  className="flex items-center justify-center"
                  onClick={() => handleChangeOrder(row, "DOWN")}
                >
                  <ChevronDown />
                </button>
              </div>
            </div>
          ))}
      </div>

      <div id="images" className="w-full flex flex-col h-[25vh] border-2">
        <input type="file" multiple onChange={addFiles}></input>

        <div className="w-full flex overflow-x-auto h-[100%]">
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
