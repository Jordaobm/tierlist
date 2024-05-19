import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import { IFile, IRow } from "../App";
import { MAX_LIMIT_FIRESTORE } from "../config/constantes";

export interface TierList {
  rows: IRow[];
  files: IFile[];
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_APP_ID,
};

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
  if (JSON.stringify(tierlist).length >= MAX_LIMIT_FIRESTORE) {
    alert(
      `Não foi possível persistir sua tierlist no firestore pois seus arquivos somam mais de ${MAX_LIMIT_FIRESTORE} bytes`
    );
    return;
  }
  try {
    await addDoc(cll, { data: JSON.stringify(tierlist) })
      .then((docRef) => {
        id = docRef.id;
      })
      .catch((error) => {
        console.error("Erro ao adicionar documento: ", error);
      });
  } catch (error) {
    console.log(error);
  }
  return id;
};
