import { IFile, IRow } from "../../App";

export interface ImageProps {
  file: IFile;
  setRows: React.Dispatch<React.SetStateAction<IRow[]>>;
  setFiles: React.Dispatch<React.SetStateAction<IFile[]>>;
}

export const Item = ({ file, setFiles, setRows }: ImageProps) => {
  return (
    <div
      title={file?.file?.name}
      draggable
      key={file?.id}
      id={file?.id}
      className="border-2 min-h-20 flex h-32 max-h-32"
      onTouchStart={(e: any) => {
        const { pageX, pageY } = e?.touches[0];
        const { clientWidth, clientHeight } = e?.target;

        let newItem = document.createElement("img");
        newItem.id = `fake-${file?.id}`;
        newItem.src = file?.urlToShow || "";
        newItem.className = "w-40 min-w-40";
        newItem.style.position = "absolute";
        newItem.style.left = `${pageX - clientWidth / 2}px`;
        newItem.style.top = `${pageY - clientHeight / 2}px`;

        document.body.append(newItem);
      }}
      onTouchMove={(e: any) => {
        const { pageX, pageY } = e?.touches[0];
        const { clientWidth, clientHeight } = e?.target;

        let element = document?.getElementById(`fake-${file?.id}`);
        if (!element) return;
        element.style.left = `${pageX - clientWidth / 2}px`;
        element.style.top = `${pageY - clientHeight / 2}px`;
      }}
      onTouchEnd={(e: any) => {
        const { pageX, pageY } = e?.changedTouches[0];

        const rowId = document
          .elementsFromPoint(pageX, pageY)
          ?.find((e) => e?.className?.includes("row"))?.id;

        let element = document?.getElementById(`fake-${file?.id}`);
        if (!element) return;

        const fileId = e?.target?.id?.split("file-")[1];

        let used = false;

        setRows((prev) =>
          prev?.map((row) => {
            if (row?.id === rowId) {
              if (!row?.files?.find((e) => e?.id === fileId)) {
                used = true;
                return { ...row, files: [...row?.files, file] };
              }
              used = true;
              return row;
            } else {
              return {
                ...row,
                files: row?.files?.filter((e) => e?.id !== fileId),
              };
            }
          })
        );

        setFiles((prev) =>
          prev?.map((file) => (file?.id === fileId ? { ...file, used } : file))
        );

        element?.remove();
      }}
      onDragEnd={(e: any) => {
        const { pageX, pageY } = e;

        const rowId = document
          .elementsFromPoint(pageX, pageY)
          ?.find((e) => e?.className?.includes("row"))?.id;

        // let element = document?.getElementById(`fake-${file?.id}`);
        // if (!element) return;

        const fileId = e?.target?.id?.split("file-")[1];

        let used = false;

        setRows((prev) =>
          prev?.map((row) => {
            if (row?.id === rowId) {
              if (!row?.files?.find((e) => e?.id === fileId)) {
                used = true;
                return { ...row, files: [...row?.files, file] };
              }
              used = true;
              return row;
            } else {
              return {
                ...row,
                files: row?.files?.filter((e) => e?.id !== fileId),
              };
            }
          })
        );

        setFiles((prev) =>
          prev?.map((file) => (file?.id === fileId ? { ...file, used } : file))
        );

        // element?.remove();
      }}
    >
      <img
        id={`file-${file?.id}`}
        className="w-40 min-w-40 object-contain"
        src={file?.urlToShow}
      />
    </div>
  );
};
