import {
  DocumentData,
  FieldValue,
  QueryDocumentSnapshot,
} from "firebase/firestore";

export interface Heist {
  id: string;
  createdAt: Date;
  title: string;
  description: string;
  createdBy: string;
  createdByCodename: string;
  assignedTo: string;
  assignedToCodename: string;
  deadline: Date;
  finalStatus: "success" | "failure" | null;
}

export interface CreateHeistInput {
  createdAt: FieldValue;
  title: string;
  description: string;
  createdBy: string;
  createdByCodename: string;
  assignedTo: string;
  assignedToCodename: string;
  deadline: Date;
  finalStatus: null;
}

export interface UpdateHeistInput {
  title?: string;
  description?: string;
  assignedTo?: string;
  assignedToCodename?: string;
  deadline?: Date;
  finalStatus?: "success" | "failure" | null;
}

export const heistConverter = {
  toFirestore: (data: Partial<Heist>): DocumentData => data,

  fromFirestore: (snapshot: QueryDocumentSnapshot): Heist =>
    ({
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate(),
      deadline: snapshot.data().deadline?.toDate(),
    }) as Heist,
};
