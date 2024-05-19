export const DEFAULT_ROWS = [
  {
    id: "aadf863d-bad6-4c57-91ff-a09b2c989e20",
    name: "A",
    order: 1,
    files: [],
    color: "#8cff00",
  },
  {
    id: "c39da217-3d4b-4577-8461-0744a2375960",
    name: "B",
    order: 2,
    files: [],
    color: "#d6cf00",
  },
  {
    id: "c045644f-e54b-44f0-a120-f71a1e561f78",
    name: "C",
    order: 3,
    files: [],
    color: "#ffbb00",
  },
  {
    id: "ef1571b8-67ca-45f5-940d-f433ed8743de",
    name: "D",
    order: 4,
    files: [],
    color: "#ff7b00",
  },
  {
    id: "d2082a63-32d1-4c3f-8996-24334322a5f3",
    name: "E",
    order: 5,
    files: [],
    color: "#ff0000",
  },
  {
    id: "ebf56019-30a7-4987-b469-58aef00fdf39",
    name: "F",
    order: 6,
    files: [],
    color: "#000000",
  },
];

export const STYLES = {
  container: "w-full flex flex-col h-[100vh] p-4 max-w-screen-xl m-auto",
  containerForPrint: "w-full flex flex-col p-4 max-w-screen-xl m-auto",

  content: "w-full flex flex-col gap-2 overflow-y-auto h-[80vh]",
  contentForPrint: "w-full flex flex-col gap-2 overflow-y-auto",

  images: "w-full flex flex-col h-[20vh] border-2 bg-slate-500",
  imagesForPrint: "w-full flex flex-col border-2 bg-slate-500",

  contentImages: "w-full flex overflow-x-auto h-[100%]",
  contentImagesForPrint: "w-full flex h-[100%] flex-wrap",
};

export const MAX_LIMIT_FIRESTORE = 1048487;
