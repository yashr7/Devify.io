import { useMutation } from "@apollo/client";
import { ChevronLeftIcon, LinkIcon, PhotographIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ADD_POST, ADD_SUBREDDIT } from "../graphql/mutations";
import { Avatar } from "./Avatar";
import client from "../apollo-client";
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from "../graphql/queries";
import toast from "react-hot-toast";

type FormData = {
    postTitle: string;
    postBody: string;
    postImage: string;
    subreddit: string;
};

type Props = {
    subreddit?: string;
}

const PostBox = ({ subreddit }: Props) => {
    const { data: session } = useSession();

    const [addPost] = useMutation(ADD_POST, {
        refetchQueries: [GET_ALL_POSTS, 'getPostList'],
    });
    const [addSubreddit] = useMutation(ADD_SUBREDDIT);

    const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false);

    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = handleSubmit(async (formData) => {
        console.log(formData);
        const notifications = toast.loading('Creating new post...')
        try {
            console.log("hello");
            //Query for the subreddit topic
            const {
                data: { getSubredditListByTopic },
            } = await client.query({
                query: GET_SUBREDDIT_BY_TOPIC,
                variables: {
                    topic: subreddit || formData.subreddit,
                },
            });
            console.log(getSubredditListByTopic);

            const subredditExists = getSubredditListByTopic.length > 0;
            if (!subredditExists) {
                // create Subreddit
                console.log("creating a new subreddit");
                const { data: { insertSubreddit: newSubreddit } } = await addSubreddit({ variables: { topic: formData.subreddit } });

                // create Post
                console.log("creating a new post");
                const image = formData.postImage || '';

                const { data: { insertPost: newPost } } = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        subreddit_id: newSubreddit.id,
                        title: formData.postTitle,
                        username: session?.user?.name,
                    }
                })
                console.log("New post added", newPost);
            }
            else {
                // use existing subreddit
                console.log("using existing subreddit");
                console.log(getSubredditListByTopic);
                const image = formData.postImage || '';
                const { data: { insertPost: newPost } } = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        subreddit_id: getSubredditListByTopic[0].id,
                        title: formData.postTitle,
                        username: session?.user?.name,
                    }
                })
                console.log("New post added", newPost);
            }
            //After the post has been added
            setValue("postTitle", "");
            setValue("postBody", "");
            setValue("postImage", "");
            setValue("subreddit", "");

            toast.success("New Post Created!", {
                id: notifications
            });
        } catch (error) {
            toast.error('Whoops! Something went wrong!', {
                id: notifications
            })
        }
    });

    return (
        <form
            onSubmit={onSubmit}
            className="sticky top-16 z-50 bg-slate-900 border border-slate-800 rounded-md p-3"
        >
            <div className="flex p-3 items-center space-x-3">
                {/* Avatar */}
                <Avatar />
                <input
                    {...register("postTitle", { required: true })}
                    disabled={!session}
                    className="flex-1 rounded-md bg-slate-800 p-2 pl-5  text-gray-300 outline-none"
                    type="text"
                    placeholder={
                        session ? subreddit ? `Create a post in r/${subreddit}` : "What's up? ..." : "Sign in to post"
                    }
                />

                {/* Icons */}
                <PhotographIcon
                    onClick={() => setImageBoxOpen(!imageBoxOpen)}
                    className={`h-6 text-gray-300 cursor-pointer ${imageBoxOpen && "text-blue-300"
                        }`}
                />
                {/* <LinkIcon className="h-6 text-gray-300" /> */}
            </div>
            {!!watch("postTitle") && (
                <div className="flex flex-col py-2">
                    {/* Body */}
                    <div className="flex items-center px-2">
                        <p className="min-w-[90px] text-gray-300">Body: </p>
                        <input
                            className="m-2 flex-1 bg-slate-800 p-2 outline-none"
                            {...register("postBody")}
                            type="text"
                            placeholder="Text"
                        />
                    </div>

                    {/* Subreddit */}
                    {!subreddit && (<div className="flex items-center px-2">
                        <p className="min-w-[90px] text-gray-300">Subreddit: </p>
                        <input
                            className="m-2 flex-1 bg-slate-800 p-2 outline-none"
                            {...register("subreddit", { required: true })}
                            type="text"
                            placeholder="e.g. NextJs"
                        />
                    </div>)}

                    {/* Image */}
                    {imageBoxOpen && (
                        <div className="flex items-center px-2">
                            <p className="min-w-[90px] text-gray-300">Image URL: </p>
                            <input
                                className="m-2 flex-1 bg-slate-800 p-2 outline-none"
                                {...register("postImage")}
                                type="text"
                                placeholder="( optional )"
                            />
                        </div>
                    )}

                    {/* Errors */}
                    {Object.keys(errors).length > 0 && (
                        <div className="space-y-2 p-2 text-red-500">
                            {errors.postTitle?.type === "required" && (
                                <p>A Post Title is required</p>
                            )}
                            {errors.subreddit?.type === "required" && (
                                <p>Subreddit is required</p>
                            )}
                        </div>
                    )}

                    {/* Create Post Button */}
                    {!!watch("postTitle") && (
                        <div className="flex items-center justify-center mt-4">
                            <button type="submit" className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                                <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 font-semibold">
                                    Create Post
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            )
            }
        </form >
    );
};

export default PostBox;
