import { useQuery } from '@apollo/client'
import { MrMiyagi } from '@uiball/loaders'
import type { NextPage } from 'next'
import Head from 'next/head'
import Feed from '../components/Feed'
import PostBox from '../components/PostBox'
import SubredditRow from '../components/SubredditRow'
import { GET_SUBREDDIT_WITH_LIMIT } from '../graphql/queries'


const Home: NextPage = () => {

  const { data } = useQuery(GET_SUBREDDIT_WITH_LIMIT, {
    variables: {
      limit: 10
    }
  })

  const subreddit: Subreddit[] = data?.getSubredditListLimit

  console.log("subreddit", subreddit)

  return (
    <div className="font-sans max-w-5xl my-5 mx-auto">
      <Head>
        <title>Devify.io</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Postbox */}
      <PostBox />

      <div className='flex'>
        {/* Feed */}
        <Feed />
        <div className='sticky top-40 mx-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-slate-700 bg-slate-900 lg:inline'>
          <p className='text-md mb-1 p-4 pb-3 font-bold text-white'>Top Communities</p>
          {subreddit ? (<div>
            {/* List subreddits */}
            {subreddit?.map((subreddit, i) => (
              <SubredditRow key={subreddit.id} topic={subreddit.topic as string} index={i} />
            ))}
          </div>) : (<div className='flex w-full items-center justify-center p-10'>
            <MrMiyagi
              size={30}
              lineWeight={3.5}
              speed={1.5}
              color="#FB7185"
            />
          </div>)}

        </div>
      </div>
    </div>
  )
}

export default Home
