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

const PostBox = () => {
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
                    topic: formData.subreddit,
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
            className="stick top-16 z-50 bg-white border border-gray-300 rounded-md p-2"
        >
            <div className="flex items-center space-x-3">
                {/* Avatar */}
                <Avatar />

                <input
                    {...register("postTitle", { required: true })}
                    disabled={!session}
                    className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
                    type="text"
                    placeholder={
                        session ? "Create a post by entering a title" : "Sign in to post"
                    }
                />

                {/* Icons */}
                <PhotographIcon
                    onClick={() => setImageBoxOpen(!imageBoxOpen)}
                    className={`h-6 text-gray-300 cursor-pointer ${imageBoxOpen && "text-blue-300"
                        }`}
                />
                <LinkIcon className="h-6 text-gray-300" />
            </div>
            {!!watch("postTitle") && (
                <div className="flex flex-col py-2">
                    {/* Body */}
                    <div className="flex items-center px-2">
                        <p className="min-w-[90px]">Body: </p>
                        <input
                            className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                            {...register("postBody")}
                            type="text"
                            placeholder="Text (optional)"
                        />
                    </div>

                    {/* Subreddit */}
                    <div className="flex items-center px-2">
                        <p className="min-w-[90px]">Subreddit: </p>
                        <input
                            className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                            {...register("subreddit", { required: true })}
                            type="text"
                            placeholder="i.e NextJs"
                        />
                    </div>

                    {/* Image */}
                    {imageBoxOpen && (
                        <div className="flex items-center px-2">
                            <p className="min-w-[90px]">Image URL: </p>
                            <input
                                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                                {...register("postImage")}
                                type="text"
                                placeholder="Optional..."
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
                        <button
                            type="submit"
                            className="w-full rounded-full bg-blue-400 p-2 text-white"
                        >
                            Create Post
                        </button>
                    )}
                </div>
            )}
        </form>
    );
};

export default PostBox;
