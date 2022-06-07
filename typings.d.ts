// typings defination file

type Comment = {
  created_at: DateTime;
  id: !ID;
  post_id: ID;
  text: String;
  username: String;
};

type Vote = {
  created_at: DateTime;
  id: !ID;
  post_id: ID;
  upvote: Int;
  username: String;
};

type Subreddit = {
  created_at: DateTime;
  id: !ID;
  topic: String;
};

type Post = {
  body: String;
  created_at: DateTime;
  id: !ID;
  image: String;
  subreddit_id: ID;
  title: String;
  username: String;
  votes: [];
  comments: [];
  subreddit: [];
};
