import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_ROWS } from "./config/constantes";

export interface IFile {
  id?: string;
  name?: string;
  file?: File | {};
  urlToShow?: string;
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

  const handleSelectFiles = (receivedFiles: FileList | null) => {
    if (!receivedFiles) return;

    const fs: IFile[] = [];

    for (let i = 0; i <= receivedFiles?.length; i++) {
      const file = receivedFiles?.item(i);
      if (file) {
        fs?.push({ file, urlToShow: URL.createObjectURL(file), id: uuidv4() });
      }
    }

    setFiles(fs);
  };

  const handleMoveFile = (e: React.DragEvent<HTMLDivElement>, row: IRow) => {
    e.preventDefault();
    e.stopPropagation();
    const fileId = e.dataTransfer.getData("text/html");
    const file = files?.find((e) => e?.id === fileId);
    if (!file || !fileId) return;

    setRows((prev) =>
      prev?.map((prevRow) => {
        if (prevRow?.id === row?.id) {
          if (prevRow?.files?.find((e) => e?.id === file?.id)) {
            return { ...prevRow, files: prevRow?.files };
          }

          return { ...prevRow, files: [...prevRow?.files, file] };
        }

        return prevRow;
      })
    );
  };

  const preventDefault = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
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
              className="w-full border-slate-100 border-2 rounded h-28 cursor-pointer flex"
            >
              <label
                htmlFor={`color-${row?.id}`}
                style={{ background: row?.color }}
                className="w-28 h-full flex flex-col justify-center align-middle"
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
                className="w-full bg-black flex overflow-x-auto"
                onDrop={(e) => handleMoveFile(e, row)}
                onDragOver={preventDefault}
                onDragEnter={preventDefault}
                onDragLeave={preventDefault}
              >
                {row?.files?.map((file) => (
                  <img key={file?.id} src={file?.urlToShow} />
                ))}
              </div>
              <div className="bg-slate-700 flex flex-col h-full justify-between p-4">
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

      <div>
        <p>Adicione as imagens!</p>

        <input
          type="file"
          name="filefield"
          multiple
          onChange={(e) => {
            handleSelectFiles(e?.target?.files);
          }}
        ></input>
      </div>

      {files?.map((file) => (
        <img
          key={file?.id}
          src={file?.urlToShow}
          draggable
          onDragStart={(e: any) =>
            e.dataTransfer.setData("Text/html", e.target.id)
          }
          id={file?.id}
        />
      ))}
    </div>
  );
};
