import { db } from "../util/firebase";
export type FirestoreDoc =
  FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;

export const addDoc = function (c: string, o: object) {
  return db.collection(c).add(o);
};
export const setDoc = function (c: string, d: string, o: object) {
  return db.collection(c).doc(d).set(o);
};
export const updateDoc = function (c: string, d: string, o: object) {
  return db.collection(c).doc(d).update(o);
};
export const getDoc = function (c: string, d: string) {
  return db.collection(c).doc(d).get();
};
export const getDocWithKey = function (c: string, d: string) {
  return db.collection(c).doc(d).get();
};
export const getDocs = function (c: string, ts = Date.now()) {
  return db
    .collection(c)
    .orderBy("timestamp", "desc")
    .startAfter(ts)
    .limit(1)
    .get();
};
export const deleteDoc = function (c: string, d: string) {
  return db.collection(c).doc(d).delete();
};
export const listenDocs = function (
  c: string,
  callback: (querySnapshot: FirestoreDoc) => void,
  errCallBack: (err: Error) => void
) {
  return db.collection(c).onSnapshot(callback, errCallBack);
};
