/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      time
      url
      title
      desc
      imgUrl
      channelCode
      caption
      type
      createdAt
      updatedAt
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        time
        url
        title
        desc
        imgUrl
        channelCode
        caption
        type
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listPostsByTime = /* GraphQL */ `
  query ListPostsByTime(
    $type: String
    $time: ModelFloatKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPostsByTime(
      type: $type
      time: $time
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        time
        url
        title
        desc
        imgUrl
        channelCode
        caption
        type
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listPostsByChannel = /* GraphQL */ `
  query ListPostsByChannel(
    $channelCode: String
    $time: ModelFloatKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPostsByChannel(
      channelCode: $channelCode
      time: $time
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        time
        url
        title
        desc
        imgUrl
        channelCode
        caption
        type
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
