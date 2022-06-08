import React, { useEffect, useState } from 'react'
import { ArrowDownIcon, ArrowUpIcon, BookmarkIcon, ChatAltIcon, DotsHorizontalIcon, GiftIcon, ShareIcon } from '@heroicons/react/outline'
import { Avatar } from './Avatar'

import Link from 'next/link'

import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { GET_ALL_VOTES_BY_POST_ID } from '../graphql/queries'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_VOTE } from '../graphql/mutations'
TimeAgo.addDefaultLocale(en)

type Props = {
    post: Post
}

const Post = ({ post }: Props) => {
    const { data: session } = useSession()
    const [vote, setVote] = useState<boolean>()

    const { data, loading, error } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
        variables: {
            post_id: post?.id
        }
    })

    const [addVote] = useMutation(ADD_VOTE, {
        refetchQueries: [GET_ALL_VOTES_BY_POST_ID, 'getVotesByPostId']
    })

    useEffect(() => {
        const votes: Vote[] = data?.getVotesByPostId

        const vote = votes?.find(vote => vote.username === session?.user?.name)?.upvote
        setVote(vote)
    }, [data])

    const upVote = async (isUpvote: boolean) => {
        if (!session) {
            toast("You need to be logged in to vote!")
            return
        }
        if (vote && isUpvote) return;
        if (vote === false && !isUpvote) return;

        console.log("Voting...", isUpvote);

        await addVote({
            variables: {
                post_id: post.id,
                username: session?.user?.name,
                upvote: isUpvote
            }
        })

        console.log("Placed vote", data);
    }

    const displayVotes = (data: any) => {
        const votes: Vote[] = data?.getVotesByPostId
        const displayNumber = votes?.reduce((total, vote) => (vote.upvote ? (total += 1) : (total -= 1)), 0)
        // if (displayNumber === 0) {
        //     return votes[0]?.upvote ? 1 : -1
        // }
        return displayNumber
    }

    return (
        <Link href={`/post/${post.id}`}>
            <div className='flex cursor-pointer border rounded-md border-slate-700 bg-slate-900 shadow-sm hover:border-slate-900'>
                {/* Votes */}
                <div className='flex flex-col items-center justify-start space-y-1 rounded-l-md bg-slate-800 p-4 text-gray-400'>
                    <ArrowUpIcon onClick={() => upVote(true)} className={`voteButtons hover:text-blue-400 ${vote && 'text-blue-400'}`} />
                    <p className='text-white text-xs font-bold'>{displayVotes(data)}</p>
                    <ArrowDownIcon onClick={() => upVote(false)} className={`voteButtons hover:text-red-400 ${vote === false && 'text-red-400'}`} />
                </div>
                <div className='p-3 pb-1'>
                    {/* Header */}
                    <div className='flex items-center space-x-2'>
                        <Avatar seed={post.subreddit[0]?.topic as string} />
                        <p className='text-xs text-gray-400'>
                            <Link href={`/subreddit/${post.subreddit[0]?.topic}`}>
                                <span className='font-bold text-white hover:text-blue-400 hover:underline '>r/{post.subreddit[0]?.topic} </span>
                            </Link>
                            • Posted by u/{post.username} • <ReactTimeAgo date={post.created_at} locale="en-US" />
                        </p>
                    </div>

                    {/* Body */}
                    <div className='p-4'>
                        <h2 className='text-xl font-semibold text-white'>{post.title}</h2>
                        <p className='mt-2 text-white text-sm font-light '>{post.body}</p>
                    </div>

                    {/* Image */}
                    <img className='w-full mb-1' src={post.image as string} alt="" />

                    {/* Footer */}
                    <div className='flex items-center space-x-4 text-gray-400'>
                        <div className='postButtons'>
                            <ChatAltIcon className='h-5 w-5' />
                            <p className=''>{post.comments.length} Comments</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Post