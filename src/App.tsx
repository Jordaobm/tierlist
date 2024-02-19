import html2canvas from "html2canvas";
import {
  ChevronDown,
  ChevronUp,
  Fullscreen,
  ImagePlus,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import { v4 } from "uuid";
import { Item } from "./components/Image";
import { DEFAULT_ROWS, STYLES } from "./config/constantes";

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
          color: "#CBCBCB",
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

  const onScreenShot = () => {
    const root = document.getElementById("root");
    if (!root) return;

    root.children[0].className = STYLES.containerForPrint;
    root.style.width = "1440px";
    root.style.minHeight = `${root?.scrollHeight}px`;

    root.children[0].children[0].className = STYLES.contentForPrint;
    root.children[0].children[1].className = STYLES.contentImages;
    root.children[0].children[1].children[0].className =
      STYLES.contentImagesForPrint;

    html2canvas(root).then(function (canvas) {
      const link = document.createElement("a");
      link.download = "tierlist.png";
      link.href = canvas.toDataURL();
      link.click();
    });

    root.children[0].className = STYLES.container;
    root.style.width = "100%";
    root.style.minHeight = `auto`;

    root.children[0].children[0].className = STYLES.content;
    root.children[0].children[1].className = STYLES.images;
    root.children[0].children[1].children[0].className = STYLES.contentImages;
  };

  return (
    <div className={STYLES.container} id="container">
      <div id="content" className={STYLES.content}>
        <div className="flex gap-4 h-12">
          <button
            onClick={addRow}
            className="bg-lime-700 p-2 rounded flex items-center gap-2 hover:bg-lime-900"
          >
            <Pencil size="16" />
            Adicionar linha
          </button>

          <div className="h-[100%] flex">
            <input
              type="file"
              multiple
              onChange={addFiles}
              className="opacity-0 hidden"
              id="file"
            ></input>

            <label
              htmlFor="file"
              className="bg-blue-700 p-2 rounded flex items-center gap-2 cursor-pointer hover:bg-blue-900"
            >
              <ImagePlus size="16" />
              Adicionar imagens
            </label>
          </div>

          <button
            onClick={onScreenShot}
            className="bg-yellow-700 p-2 rounded flex items-center gap-2 hover:bg-yellow-900"
          >
            <Fullscreen size="16" />
            Capturar a tela
          </button>
        </div>

        {rows
          ?.sort((a, b) => (a?.order > b?.order ? 1 : -1))
          ?.map((row, index) => (
            <div
              key={row?.id}
              id={row?.id}
              className="border-2 border-black flex row"
              draggable
            >
              <label
                // className="bg-slate-500 h-[100%] w-24 flex items-center justify-center min-h-32"
                className="w-24 flex items-center justify-center"
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
              <div className="bg-slate-800 w-[100%] min-h-32 flex flex-wrap">
                {row?.files?.map((file) => (
                  <Item
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

      <div id="images" className={STYLES.images}>
        <div className={STYLES.contentImages}>
          {!files?.length && (
            <label htmlFor="file">
              Adicione imagens e elas aparecerão por aqui!
            </label>
          )}
          {files
            ?.filter((e) => !e?.used)
            ?.map((file) => (
              <Item
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
