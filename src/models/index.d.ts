import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Post {
  readonly id: string;
  readonly time?: number;
  readonly url: string;
  readonly title?: string;
  readonly desc?: string;
  readonly imgUrl?: string;
  readonly channelCode?: string;
  readonly caption?: string;
  readonly type?: string;
  constructor(init: ModelInit<Post>);
  static copyOf(source: Post, mutator: (draft: MutableModel<Post>) => MutableModel<Post> | void): Post;
}