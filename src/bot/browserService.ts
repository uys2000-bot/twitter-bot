import { BrowserRunType } from "../types/browser";
import { UserClass } from "../types/account";
import { TweetClass } from "../types/twitter";
import {
  getBrowser,
  getPage,
  loginToTwitter,
  goToTweet,
  likeTweet,
  reTweet,
  Cookies,
  setCookies,
  closeBrowser,
  isTweetExists,
  isNotLogged,
  goToHome,
  closePopup,
} from "../util/browser";
import { getDocs } from "../service/firestoreService";
import { USER } from "../contant";
import { logError, logInfo } from "../service/analyticsService";

export const runForUser = async function (
  runType: BrowserRunType,
  user: UserClass,
  tweets: TweetClass[],
  cookies?: Cookies
) {
  const logData = {
    name: "runForUser",
    data: {
      runType: runType,
      user: user.username,
      tweets: Object.keys(tweets).length,
    },
  };
  logInfo(logData);
  try {
    const browser = await getBrowser();
    const page = await getPage(browser);
    if (cookies) await setCookies(page, cookies);
    await loginToTwitter(page, user);
    if (await isNotLogged(page)) {
      runForUser(runType, user, tweets, cookies);
      return;
    }
    for (let index = 0; index < Object.keys(tweets).length; index++) {
      const tweet = tweets[index];

      await goToTweet(page, tweet);
      await closePopup(page);
      if (await isTweetExists(page)) {
        if (runType.indexOf("like") != -1) await likeTweet(page);
        if (runType.indexOf("rt") != -1) await reTweet(page);
      }
    }
    await closeBrowser(browser, page, async () => {});
  } catch (err) {
    logError({ name: logData.name, err });
  }
};

export const runForUsers = async function (
  runType: BrowserRunType,
  userCount: number,
  tweets: TweetClass[],
  ts = Date.now()
) {
  const snapShots = await getDocs(USER, ts);
  if (snapShots.docs.length > 0) {
    for (let index = 0; index < snapShots.docs.length; index++) {
      if (index < userCount) {
        const snapShot = snapShots.docs[index];
        const user = snapShot.data() as UserClass;
        await runForUser(runType, user, tweets);
      }
    }

    if (snapShots.docs.length <= userCount)
      runForUsers(
        runType,
        userCount - snapShots.docs.length,
        tweets,
        snapShots.docs[snapShots.docs.length - 1].data().timestamp
      );
  }
};
