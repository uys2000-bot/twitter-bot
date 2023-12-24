import { deleteDoc, listenDocs } from "./service/firestoreService";
import { TASKS } from "./contant";
import { runForUsers } from "./bot/browserService";
import { BrowserTaskClass } from "./types/browser";
import { logError, logInfo } from "./service/analyticsService";
logInfo({
  name: "runFor",
  data: { timestamp: Date.now(), time: new Date().toLocaleDateString("tr") },
});
listenDocs(
  TASKS,
  async (snapShots) => {
    if (snapShots.docs.length > 0) {
      for (let index = 0; index < snapShots.docs.length; index++) {
        const snapShot = snapShots.docs[index];
        const data = snapShot.data() as BrowserTaskClass;
        const taskInfo = {
          name: "runForUsers",
          data: {
            taskID: snapShot.id,
            runType: data.browserRunType,
            users: data.userCount,
            tweets: Object.keys(data.tweets).length,
          },
        };
        logInfo(taskInfo);
        try {
          await runForUsers(data.browserRunType, data.userCount, data.tweets);
          deleteDoc(TASKS, snapShot.id);
        } catch (err) {
          logError({ name: taskInfo.name, err });
        }
      }
    }
  },
  (err) => {
    logError({ name: "runtime", err });
  }
);
