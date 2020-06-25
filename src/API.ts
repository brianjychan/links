/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreatePostInput = {
  id?: string | null,
  time?: number | null,
  url: string,
  title?: string | null,
  desc?: string | null,
  imgUrl?: string | null,
  channelCode?: string | null,
  caption?: string | null,
  type?: string | null,
};

export type ModelPostConditionInput = {
  time?: ModelFloatInput | null,
  url?: ModelStringInput | null,
  title?: ModelStringInput | null,
  desc?: ModelStringInput | null,
  imgUrl?: ModelStringInput | null,
  channelCode?: ModelStringInput | null,
  caption?: ModelStringInput | null,
  type?: ModelStringInput | null,
  and?: Array< ModelPostConditionInput | null > | null,
  or?: Array< ModelPostConditionInput | null > | null,
  not?: ModelPostConditionInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type UpdatePostInput = {
  id: string,
  time?: number | null,
  url?: string | null,
  title?: string | null,
  desc?: string | null,
  imgUrl?: string | null,
  channelCode?: string | null,
  caption?: string | null,
  type?: string | null,
};

export type DeletePostInput = {
  id?: string | null,
};

export type ModelPostFilterInput = {
  id?: ModelIDInput | null,
  time?: ModelFloatInput | null,
  url?: ModelStringInput | null,
  title?: ModelStringInput | null,
  desc?: ModelStringInput | null,
  imgUrl?: ModelStringInput | null,
  channelCode?: ModelStringInput | null,
  caption?: ModelStringInput | null,
  type?: ModelStringInput | null,
  and?: Array< ModelPostFilterInput | null > | null,
  or?: Array< ModelPostFilterInput | null > | null,
  not?: ModelPostFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelFloatKeyConditionInput = {
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type CreatePostMutationVariables = {
  input: CreatePostInput,
  condition?: ModelPostConditionInput | null,
};

export type CreatePostMutation = {
  createPost:  {
    __typename: "Post",
    id: string,
    time: number | null,
    url: string,
    title: string | null,
    desc: string | null,
    imgUrl: string | null,
    channelCode: string | null,
    caption: string | null,
    type: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePostMutationVariables = {
  input: UpdatePostInput,
  condition?: ModelPostConditionInput | null,
};

export type UpdatePostMutation = {
  updatePost:  {
    __typename: "Post",
    id: string,
    time: number | null,
    url: string,
    title: string | null,
    desc: string | null,
    imgUrl: string | null,
    channelCode: string | null,
    caption: string | null,
    type: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePostMutationVariables = {
  input: DeletePostInput,
  condition?: ModelPostConditionInput | null,
};

export type DeletePostMutation = {
  deletePost:  {
    __typename: "Post",
    id: string,
    time: number | null,
    url: string,
    title: string | null,
    desc: string | null,
    imgUrl: string | null,
    channelCode: string | null,
    caption: string | null,
    type: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetPostQueryVariables = {
  id: string,
};

export type GetPostQuery = {
  getPost:  {
    __typename: "Post",
    id: string,
    time: number | null,
    url: string,
    title: string | null,
    desc: string | null,
    imgUrl: string | null,
    channelCode: string | null,
    caption: string | null,
    type: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPostsQueryVariables = {
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPostsQuery = {
  listPosts:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      id: string,
      time: number | null,
      url: string,
      title: string | null,
      desc: string | null,
      imgUrl: string | null,
      channelCode: string | null,
      caption: string | null,
      type: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type ListPostsByTimeQueryVariables = {
  type?: string | null,
  time?: ModelFloatKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPostsByTimeQuery = {
  listPostsByTime:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      id: string,
      time: number | null,
      url: string,
      title: string | null,
      desc: string | null,
      imgUrl: string | null,
      channelCode: string | null,
      caption: string | null,
      type: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type ListPostsByChannelQueryVariables = {
  channelCode?: string | null,
  time?: ModelFloatKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPostsByChannelQuery = {
  listPostsByChannel:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      id: string,
      time: number | null,
      url: string,
      title: string | null,
      desc: string | null,
      imgUrl: string | null,
      channelCode: string | null,
      caption: string | null,
      type: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreatePostSubscription = {
  onCreatePost:  {
    __typename: "Post",
    id: string,
    time: number | null,
    url: string,
    title: string | null,
    desc: string | null,
    imgUrl: string | null,
    channelCode: string | null,
    caption: string | null,
    type: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePostSubscription = {
  onUpdatePost:  {
    __typename: "Post",
    id: string,
    time: number | null,
    url: string,
    title: string | null,
    desc: string | null,
    imgUrl: string | null,
    channelCode: string | null,
    caption: string | null,
    type: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePostSubscription = {
  onDeletePost:  {
    __typename: "Post",
    id: string,
    time: number | null,
    url: string,
    title: string | null,
    desc: string | null,
    imgUrl: string | null,
    channelCode: string | null,
    caption: string | null,
    type: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
