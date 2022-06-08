import { useQuery } from '@apollo/client'
import React from 'react'
import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC } from '../graphql/queries'
import Post from './Post'
import { MrMiyagi } from '@uiball/loaders'

type Props = {
    topic?: string;
}

const Feed = ({ topic }: Props) => {
    console.log(topic || "Getting post List (Post.tsx)")
    const { data, error } = !topic ? useQuery(GET_ALL_POSTS) : useQuery(GET_ALL_POSTS_BY_TOPIC, { variables: { topic: topic } });

    const posts: Post[] = !topic ? data?.getPostList : data?.getPostListByTopic;
    console.log(posts);

    if (!posts) return (
        <div className='flex w-full items-center justify-center p-10'>
            <MrMiyagi
                size={80}
                lineWeight={3.5}
                speed={1.5}
                color="#FB7185"
            />
        </div>
    )
    return (
        <div className='mt-5 space-y-4'>
            {posts?.map(post => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    )
}

export default Feed