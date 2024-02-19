import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import { IFile, IRow } from "../App";

export interface TierList {
  rows: IRow[];
  files: IFile[];
}

const firebaseConfig = {
  apiKey: "AIzaSyC3CpwiYnRmanNFwy6dSE7qS7ndATIGAqE",
  authDomain: "tierlist-d941c.firebaseapp.com",
  projectId: "tierlist-d941c",
  storageBucket: "tierlist-d941c.appspot.com",
  messagingSenderId: "151490505452",
  appId: "1:151490505452:web:2973775fd96d89e5f853c9",
};

// const firebaseConfig = {
//   apiKey: "1",
//   authDomain: "1",
//   projectId: "1",
//   storageBucket: "1",
//   messagingSenderId: "1",
//   appId: "1",
// };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getTierlistById = async (tierlistId: string) => {
  if (tierlistId?.length !== 20) return;

  let result: any = {};
  const docRef = doc(db, "tierlist", tierlistId);

  await getDoc(docRef)
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        result = { ...docSnapshot.data(), id: docSnapshot.id };
      }
    })
    .catch((error) => {
      console.error("Erro ao obter documento: ", error);
    });
  return result;
};

export const addTierList = async (tierlist: TierList) => {
  let id = "";
  const cll = collection(db, "tierlist");
  await addDoc(cll, { data: JSON.stringify(tierlist) })
    .then((docRef) => {
      id = docRef.id;
    })
    .catch((error) => {
      console.error("Erro ao adicionar documento: ", error);
    });

  return id;
};
