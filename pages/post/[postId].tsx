// /postId/1
import { useMutation, useQuery } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import Post from '../../components/Post'
import { GET_ALL_POSTS_BY_ID } from '../../graphql/queries'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ADD_COMMENT } from '../../graphql/mutations'
import toast from 'react-hot-toast'
import { Avatar } from '../../components/Avatar'

import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { MrMiyagi } from '@uiball/loaders'
TimeAgo.addDefaultLocale(en)

type FormData = {
    comment: string
}

const PostPage = () => {
    const { data: session } = useSession()

    const router = useRouter()

    const [addComment] = useMutation(ADD_COMMENT, {
        refetchQueries: [GET_ALL_POSTS_BY_ID, 'getPostListByPostId']
    })

    const { data } = useQuery(GET_ALL_POSTS_BY_ID, {
        variables: {
            post_id: router.query.postId
        }
    })

    const post: Post = data?.getPostListByPostId

    console.log("PostPage.tsx: ", post);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>()

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        //post comment here..
        const notification = toast.loading('Posting your comment...')
        await addComment({
            variables: {
                post_id: router.query.postId,
                username: session?.user?.name,
                text: data.comment
            }
        })

        setValue('comment', '')

        toast.success('Comment posted!', {
            id: notification
        })
    }

    if (!post) return (
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
        <div className='mx-auto my-7 max-w-5xl'>
            <Post post={post} />
            <div className='mt-1 bg-slate-900 p-5 pl-16'>
                <p className=' mb-1 text-sm text-white'>Comment as <span className='text-red-500  '>{session?.user?.name}</span></p>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-2'>
                    <textarea {...register('comment')} disabled={!session} className='h-24 rounded-md border border-slate-900 p-2 m-2 mt-4 mb-3 pl-4 outline-none bg-slate-800 disabled:bg-slate-600 text-white' placeholder={session ? 'What are your thoughts' : 'Please Sign in to comment'} />
                    <div className="flex items-center justify-center mt-2">
                        <button disabled={!session} type='submit' className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                            <span className="w-full relative px-5 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 font-semibold">
                                Comment
                            </span>
                        </button>
                    </div>
                </form>
            </div>
            <div className='-my-5 rounded-b-md border border-t-0 border-slate-900 bg-slate-900 py-5 px-10'>
                <hr className='py-2 border-slate-800 ' />
                {post?.comments.map((comment) => (
                    <div className='relative flex items-center space-x-2 space-y-5' key={comment.id}>
                        <hr className='absolute top-10 h-12 border z-0 left-7' />
                        <div className='z-50'>
                            <Avatar seed={comment.username} />
                        </div>
                        <div className='flex flex-col'>
                            <p className='py-2 text-xs text-gray-400'>
                                <span className='font-semibold text-white'>{comment.username} </span>•
                                <ReactTimeAgo date={comment.created_at} locale="en-US" />
                            </p>
                            <p className=' text-gray-50'>
                                {comment.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PostPage 