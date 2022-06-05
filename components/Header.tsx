import Image from 'next/image'
import React from 'react'
import {ChevronDownIcon, HomeIcon, SearchIcon, MenuIcon} from '@heroicons/react/solid'
import {BellIcon, ChatIcon, GlobeIcon, PlusIcon, SparklesIcon, SpeakerphoneIcon, VideoCameraIcon} from '@heroicons/react/outline'

const Header = () => {
  return (
    <div className='sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm'>
        <div className='relative h-10 w-20 flex-shrink-0 cursor-pointer '>
            <Image objectFit='contain' src="https://www.pngitem.com/pimgs/m/543-5439256_apollo-app-icon-apollo-reddit-app-icon-hd.png" layout='fill'/>
        </div>

        <div className='flex items-center mx-7 xl:min-w-{300px}'>
          <HomeIcon className='h-5 w-5'/>
          <p className='flex-1 ml-2 hidden lg:inline'>Home</p>
          <ChevronDownIcon  className='h-5 w-5'/>
        </div>

        {/* Search */}
        <form className='flex flex-1 items-center space-x-2 border rounded-lg px-3 py-1 bg-gray-100 border-grey-100'>
          <SearchIcon className='h-5 w-6 text-grey-400'/>
          <input className='flex-1 bg-transparent outline-none' type="text" placeholder='Search'/>
          <button type='submit' hidden></button>
        </form>

        <div className='mx-5 hidden text-grey-500 space-x-2 items-center lg:inline-flex'>
          <SparklesIcon className='icon'/>
          <GlobeIcon className='icon'/>
          <VideoCameraIcon className='icon'/>
          <hr className='h-10 border border-green-100'/>
          <ChatIcon className='icon'/>
          <BellIcon className='icon'/>
          <PlusIcon className='icon'/>
          <SpeakerphoneIcon className='icon'/>
        </div>
        <div className='ml-5 flex items-center lg:hidden'>
          <MenuIcon className='icon'/>
        </div>
      {/* Sign In / Sign Out button */}
        <div className='hidden lg:flex items-center space-x-2 border border-grey-100 p-2 cursor-pointer'>
          <div className='relative h-5 w-5 flex-shrink-0'>
          <Image objectFit='contain' src="https://pngset.com/images/reddit-logo-icon-free-download-stencil-pottery-symbol-silhouette-transparent-png-2207129.png" layout='fill' alt="" />
          </div>
          <p className='text-grey-400'>Sign In</p>
        </div>
    </div>
  )
}

export default Header