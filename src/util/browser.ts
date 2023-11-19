import puppeteer from "puppeteer-extra";
import StealthPlugin = require("puppeteer-extra-plugin-stealth");
import { executablePath, Page, Browser, Protocol } from "puppeteer";

import { UserClass } from "../types/account";
import { TweetClass } from "../types/twitter";

export type Cookies = Protocol.Network.CookieParam[];

const getDelay = function () {
  return Math.random() * 150 + 50;
};

export const setDebugger = function (page: Page, debug: boolean) {
  let count = 0;
  const takeSS = () => {
    if (true)
      page.screenshot({
        path: `img/ss${count}.jpg`,
      });
    count++;
  };
  if (debug) {
    return setInterval(takeSS, 1000);
  } else return setInterval(() => "", 1000);
};

export const getBrowser = async function () {
  puppeteer.use(StealthPlugin()); // Stealth plugin to avoid detection

  return await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
  });
};

export const getPage = async function (browser: Browser) {
  const pages = await browser.pages();
  if (pages.length > 0) return pages[0];
  else return await browser.newPage();
};

export const saveCookies = async function (
  page: Page,
  callback: (cookies: object) => Promise<void>
) {
  const cookies = await page.cookies();
  await callback(cookies);
  return;
};

export const setCookies = async function (page: Page, cookies: Cookies) {
  await page
    .setCookie(...cookies)
    .catch((err) => console.log("Failed to set cookie", err));
};

export const enterUsername = async function (page: Page, user: UserClass) {
  const target = 'input[autocomplete="on"]';
  const e = await page.waitForSelector(target, { visible: true });
  if (e) {
    await page.type(target, user.username, { delay: getDelay() });
    await page.keyboard.press("Enter");
  }
};
export const enterMail = async function (page: Page, user: UserClass) {
  const target = 'input[autocomplete="username"]';
  const e = await page
    .waitForSelector(target, { visible: true })
    .catch(async () => {
      page.reload();
      return await page.waitForSelector(target, { visible: true });
    });
  if (e) {
    await page.type(target, user.usermail, { delay: getDelay() });
    await page.keyboard.press("Enter");
  }
};
export const enterPassword = async function (page: Page, user: UserClass) {
  const target = 'input[autocomplete="current-password"]';
  const e = await page.waitForSelector(target, { visible: true });
  if (e) {
    await page.type(target, user.password, { delay: getDelay() });
    await page.keyboard.press("Enter");
  }
};

export const isLogged = async function (page: Page) {
  const target = '[aria-autocomplete="list"]';
  const e = await page.waitForSelector(target, { visible: true });
  if (e) return true;
  return false;
};

export const isNotLogged = async function (page: Page) {
  const target = '[data-testid="login"]';
  const e = await page.$(target);
  if (e) return true;
  return false;
};

export const closePopup = async function (page: Page) {
  const target = '[data-testid="app-bar-close"]';
  const e = await page.$(target);
  if (e) await page.click(target);
};
export const loginFormEnter = async function (page: Page, user: UserClass) {
  await enterMail(page, user);
  await enterUsername(page, user);
  await enterPassword(page, user);
};
export const loginToTwitter = async function (page: Page, user: UserClass) {
  try {
    const loginUrl = "https://twitter.com/i/flow/login";
    await page.goto(loginUrl, { waitUntil: "networkidle2" });
    do {
      loginFormEnter(page, user);
    } while (!(await isLogged(page)));
  } catch {
    return false;
  }
};

export const goToHome = async function (page: Page) {
  const tweetUrl = `https://twitter.com/home`;
  await page.goto(tweetUrl, { waitUntil: "networkidle2" });
};

export const goToTweet = async function (page: Page, tweet: TweetClass) {
  const tweetUrl = `https://twitter.com/${tweet.username}/status/${tweet.tweetId}`;
  await page.goto(tweetUrl, { waitUntil: "networkidle2" });
};

export const isTweetExists = async function (page: Page) {
  const target = '[data-testid="reply"]';
  const e = await page.waitForSelector(target, { visible: true });
  if (e) return true;
  return false;
};
export const likeTweet = async function (page: Page) {
  try {
    await page.waitForSelector('article [role="group"] div:nth-child(3) div', {
      visible: true,
    });
    await page.click('article [role="group"] div:nth-child(3) div');
    return true;
  } catch {
    return false;
  }
};
export const reTweet = async function (page: Page) {
  try {
    await page.waitForSelector('article [role="group"] div:nth-child(2) div', {
      visible: true,
    });
    await page.click('article [role="group"] div:nth-child(2) div');
    await page.click('[role="menu"] [role="menuitem"]');
    return true;
  } catch {
    return false;
  }
};

export const closeBrowser = async function (
  browser: Browser,
  page: Page,
  callback: (cookies: object) => Promise<void>
) {
  await saveCookies(page, callback);
  await browser.close();
};

export { Page, Browser };
