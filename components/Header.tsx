import Image from "next/image";
import React from "react";
import {
  ChevronDownIcon,
  HomeIcon,
  SearchIcon,
  MenuIcon,

} from "@heroicons/react/solid";
import {
  BellIcon,
  ChatIcon,
  GlobeIcon,
  PlusIcon,
  SparklesIcon,
  SpeakerphoneIcon,
  VideoCameraIcon,
  UserIcon,
  UserAddIcon,
  ArrowCircleRightIcon,
} from "@heroicons/react/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();

  return (
    <div className="sticky items-center s justify-between top-0 z-50 flex bg-gradient-to-r to-gray-800 via-gray-900 from-black px-4 py-2 shadow-sm">
      <div className="relative ml-5 h-10 w-30 flex-shrink-0 cursor-pointer ">
        <Link href="/" >
          <h1
            className="font-bold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 hover:bg-gradient-to-r hover:from-white hover:via-fuchsia-300 hover:to-slate-400"
          >
            DEVIFY.IO
          </h1>
        </Link>
      </div>


      {/* Search */}

      {/* <form className="flex flex-1 items-center space-x-2 border rounded-lg px-3 py-1 bg-gray-100 border-gray-100">
        <SearchIcon className="h-5 w-6 text-gray-400" />
        <input
          className="flex-1 bg-transparent outline-none"
          type="text"
          placeholder="Search"
        />
        <button type="submit" hidden></button>
      </form>

      <div className="mx-5 hidden text-gray-500 space-x-2 items-center lg:inline-flex">
        <SparklesIcon className="icon" />
        <GlobeIcon className="icon" />
        <VideoCameraIcon className="icon" />
        <hr className="h-10 border border-green-100" />
        <ChatIcon className="icon" />
        <BellIcon className="icon" />
        <PlusIcon className="icon" />
        <SpeakerphoneIcon className="icon" />
      </div>
      <div className="ml-5 flex items-center lg:hidden">
        <MenuIcon className="icon" />
      </div> */}


      {/* Sign In / Sign Out button */}

      {
        session ? (
          <div
            onClick={() => signOut()}
            className="flex mr-5 p-2 items-center space-x-2 cursor-pointer border-2 border-pink-500/50 text-transparent bg-clip-text bg-gradient-to-tr from-rose-400 via-red-300 to-cyan-400 hover:bg-gradient-to-r hover:from-white hover:via-fuchsia-300 hover:to-slate-400 rounded-md"
          >
            <div className="relative h-5 w-5 flex-shrink-0 ">
              <UserIcon className="text-emerald-400 " />
            </div>
            <div className="flex space-x-1 flex-1 text-xs items-center">
              <p className="text-x font-bold truncate">{session?.user?.name}</p>
              <p className="font-semibold text-sm">
                <ArrowCircleRightIcon className="text-rose-400 w-5 h-5" />
              </p>
            </div>
          </div>
        ) : (
          <div
            onClick={() => signIn()}
            className="flex mr-5 p-2 items-center space-x-2 cursor-pointer border-2 border-pink-500/50 text-transparent bg-clip-text bg-gradient-to-tr from-rose-400 via-red-300 to-cyan-400 hover:bg-gradient-to-r hover:from-white hover:via-fuchsia-300 hover:to-slate-400 rounded-md"
          >
            <div className="relative h-5 w-5 flex-shrink-0">
              <UserAddIcon className="text-rose-400" />
            </div>
            <p className="text-xs font-semibold">Sign In</p>
            <ArrowCircleRightIcon className="text-emerald-300 w-5 h-5" />
          </div>
        )
      }
    </div >
  );
};

export default Header;
