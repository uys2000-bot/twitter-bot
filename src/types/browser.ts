import { TweetClass } from "./twitter";

export type BrowserRunType = "like" | "rt" | "like+rt";

export class BrowserTaskClass {
  browserRunType!: BrowserRunType;
  userCount!: number;
  tweets!: TweetClass[];
  constructor(
    browserRunType = "like" as BrowserRunType,
    userCount = 0,
    tweets = []
  ) {
    this.browserRunType = browserRunType;
    this.userCount = userCount;
    this.tweets = tweets;
  }
}
