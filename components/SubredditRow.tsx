import { ChevronUpIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'
import { Avatar } from './Avatar'

type Props = {
    topic: string
    index: number
}

const SubredditRow = ({ index, topic }: Props) => {
    return (
        <div className='flex items-center space-x-2 border-t border-slate-700 bg-slate-900 text-white px-4 py-2 last:rounded-b'>
            <p>{index + 1}</p>
            <ChevronUpIcon className='h-4 w-4 flex-shrink-0 text-green-400' />
            <Avatar seed={`/subreddit/${topic}`} />
            <p className='flex-1 truncate'>r/{topic}</p>
            <Link href={`/subreddit/${topic}`}>
                <div className="flex items-center justify-center mt-2">
                    <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                        <span className="w-full relative px-5 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 font-semibold">
                            View
                        </span>
                    </button>
                </div>
                {/* <div className='cursor-pointer rounded-full bg-blue-500 text-white px-3'> View</div> */}
            </Link>
        </div>
    )
}

export default SubredditRow