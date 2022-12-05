import { useEffect, useState } from "react";
import { useAuth } from '@clerk/nextjs';

export default function Posts() {
    const [posts, setPosts] = useState(null);
    const { getToken, isLoaded, isSignedIn } = useAuth();

    useEffect(() => {
        async function fetchPosts() {
            const res = await fetch("http://localhost:3000/api/posts");
            const postsList = await res.json();
            setPosts(postsList);
        }
        if(isLoaded && isSignedIn) fetchPosts()
    });

    return (
        <>
        <ul>
            {posts?.map(post => {
                return (<li key={post.id}>{post.text}</li>)
            })}
        </ul>

        </>
    )
}