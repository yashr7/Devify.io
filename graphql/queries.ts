import { gql } from "@apollo/client";

export const GET_ALL_POSTS = gql`
  query MyQuery {
    getPostList {
      body
      id
      created_at
      image
      title
      subreddit_id
      username
      comments {
        created_at
        id
        post_id
        username
        text
      }
      subreddit {
        id
        topic
        created_at
      }
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`;

export const GET_ALL_POSTS_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getPostListByTopic(topic: $topic) {
      body
      id
      created_at
      image
      title
      subreddit_id
      username
      comments {
        created_at
        id
        post_id
        username
        text
      }
      subreddit {
        id
        topic
        created_at
      }
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`;

export const GET_SUBREDDIT_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;
