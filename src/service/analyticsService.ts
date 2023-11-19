import { db } from "../util/firebase";

export const logError = function (params: object) {
  db.collection("logs").add({ error: params, timestamp: Date.now() });
};

export const logWarn = function (params: object) {
  db.collection("logs").add({ warn: params, timestamp: Date.now() });
};

export const logInfo = function (params: object) {
  db.collection("logs").add({ info: params, timestamp: Date.now() });
};
