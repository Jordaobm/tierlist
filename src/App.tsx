import { ChevronDown, ChevronUp, XCircle } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_ROWS } from "./config/constantes";

export interface IFile {
  id?: string;
  file?: File;
  urlToShow?: string;
  used?: boolean;
}

export interface IRow {
  id: string;
  name: string;
  color: string;
  files: IFile[];
  order: number;
}

export const App = () => {
  const [rows, setRows] = useState<IRow[]>(DEFAULT_ROWS);
  const [files, setFiles] = useState<IFile[]>([]);

  const handleAddRow = () => {
    setRows((prev) => {
      const lastRowOrder = prev?.reduce((acc, row) => {
        if (row?.order > acc?.order) {
          return (acc = row);
        }

        return acc;
      }, rows[0]);

      return [
        ...prev,
        {
          order: lastRowOrder?.order + 1,
          id: uuidv4(),
          name: "Novo item",
          color: "#d19900",
          files: [],
        },
      ];
    });
  };

  const handleChangeColor = (row: IRow, color: string) => {
    setRows((prev) =>
      prev?.map((e) => (e?.id === row?.id ? { ...e, color } : e))
    );
  };

  const handleChangeName = (row: IRow, name: string) => {
    setRows((prev) =>
      prev?.map((e) => (e?.id === row?.id ? { ...e, name } : e))
    );
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

  const handleSelectFiles = (e: any) => {
    const receivedFiles = e?.target?.files;

    if (!receivedFiles || !receivedFiles?.length) return;

    const fs: IFile[] = [];

    for (let i = 0; i <= receivedFiles?.length; i++) {
      const file = receivedFiles?.item(i);
      if (file) {
        fs?.push({ file, urlToShow: URL.createObjectURL(file), id: uuidv4() });
      }
    }

    setFiles((prev) => [...prev, ...fs]);

    e.target.value = "";
  };

  const handleMoveFile = (e: React.DragEvent<HTMLDivElement>, row: IRow) => {
    e.preventDefault();
    e.stopPropagation();

    const data = JSON.parse(e.dataTransfer.getData("application/json") || "");
    const fileId = data?.fileId;
    const oldRowId = data?.oldRowId;
    const file = files?.find((e) => e?.id === fileId);
    if (!file || !fileId) return;

    setRows((prev) =>
      prev?.map((prevRow) => {
        if (oldRowId === row?.id) return prevRow;

        if (prevRow?.id === oldRowId) {
          return {
            ...prevRow,
            files: prevRow?.files?.filter((e) => e?.id !== fileId),
          };
        }

        if (prevRow?.id === row?.id) {
          if (prevRow?.files?.find((e) => e?.id === file?.id)) {
            return { ...prevRow, files: prevRow?.files };
          }

          return { ...prevRow, files: [...prevRow?.files, file] };
        }

        return prevRow;
      })
    );

    setFiles((prev) =>
      prev?.map((prevFile) =>
        prevFile?.id === fileId ? { ...prevFile, used: true } : prevFile
      )
    );
  };

  const handleRemoveFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const data = JSON.parse(e.dataTransfer.getData("application/json") || "");
    const fileId = data?.fileId;
    const file = files?.find((e) => e?.id === fileId);
    if (!file || !fileId) return;

    setRows((prev) =>
      prev?.map((prevRow) => {
        return {
          ...prevRow,
          files: prevRow?.files?.filter((e) => e?.id !== fileId),
        };
      })
    );

    setFiles((prev) =>
      prev?.map((prevFile) =>
        prevFile?.id === fileId ? { ...prevFile, used: false } : prevFile
      )
    );
  };

  const preventDefault = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onRemoveImage = (
    event: React.MouseEvent<HTMLButtonElement>,
    fileId: string
  ) => {
    event.preventDefault();
    setFiles((prev) => prev?.filter((e) => e?.id !== fileId));
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <button onClick={handleAddRow}>Adicionar linha</button>

      <div className="flex flex-col gap-4">
        {rows
          ?.sort((a, b) => (a?.order > b?.order ? 1 : -1))
          ?.map((row, index) => (
            <div
              key={index}
              className="w-full min-h-28 border-slate-100 border-2 rounded cursor-pointer flex"
            >
              <label
                htmlFor={`color-${row?.id}`}
                style={{ background: row?.color }}
                className="w-28 flex flex-col justify-center align-middle cursor-pointer"
              >
                <input
                  className="opacity-0 border-none h-0"
                  id={`color-${row?.id}`}
                  type="color"
                  value={row?.color}
                  onChange={(event) =>
                    handleChangeColor(row, event?.target?.value)
                  }
                />

                <input
                  type="text"
                  className="bg-transparent outline-none text-center"
                  value={row?.name}
                  onChange={(event) =>
                    handleChangeName(row, event?.target?.value)
                  }
                />
              </label>

              <div
                className="w-full bg-black flex gap-2 flex-wrap "
                onDrop={(e) => handleMoveFile(e, row)}
                onDragOver={preventDefault}
                onDragEnter={preventDefault}
                onDragLeave={preventDefault}
              >
                {row?.files?.map((file) => (
                  <img
                    className="w-40 object-contain"
                    title={file?.file?.name}
                    key={file?.id}
                    src={file?.urlToShow}
                    draggable
                    onDragStart={(e: any) => {
                      e.dataTransfer.setData(
                        "application/json",
                        JSON.stringify({ fileId: file?.id, oldRowId: row?.id })
                      );
                    }}
                  />
                ))}
              </div>
              <div className="bg-slate-700 flex flex-col justify-between p-4">
                <button
                  disabled={index === 0}
                  onClick={() => handleChangeOrder(row, "UP")}
                  className={
                    index === 0 ? `cursor-not-allowed` : `cursor-pointer`
                  }
                >
                  <ChevronUp />
                </button>
                <button
                  disabled={rows?.length === index + 1}
                  onClick={() => handleChangeOrder(row, "DOWN")}
                  className={
                    rows?.length === index + 1
                      ? `cursor-not-allowed`
                      : `cursor-pointer`
                  }
                >
                  <ChevronDown />
                </button>
              </div>
            </div>
          ))}
      </div>

      <div
        className="mt-4"
        onDrop={(e) => handleRemoveFile(e)}
        onDragOver={preventDefault}
        onDragEnter={preventDefault}
        onDragLeave={preventDefault}
      >
        <label
          htmlFor="addImages"
          className="flex gap-2 flex-wrap border-2 rounded min-h-36"
        >
          {!files?.length && (
            <div className="flex flex-1 text-center cursor-pointer">
              Adicione os arquivos
            </div>
          )}

          {files
            ?.filter((e) => !e?.used)
            ?.map((file) => (
              <div
                key={file?.id}
                className="w-40 object-contain cursor-pointer relative"
              >
                <img
                  className="w-full object-contain cursor-pointer "
                  title={file?.file?.name}
                  src={file?.urlToShow}
                  draggable
                  onDragStart={(e: any) => {
                    e.dataTransfer.setData(
                      "application/json",
                      JSON.stringify({ fileId: file?.id })
                    );
                  }}
                  id={file?.id}
                />

                <button
                  className="absolute top-1 right-1 "
                  onClick={(e) => onRemoveImage(e, String(file?.id))}
                >
                  <XCircle />
                </button>
              </div>
            ))}
        </label>

        <input
          id="addImages"
          className="opacity-0"
          type="file"
          multiple
          onChange={handleSelectFiles}
        ></input>
      </div>
    </div>
  );
};
