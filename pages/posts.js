import { useEffect, useState } from "react";

export default function Posts() {
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        async function fetchPosts() {
            const res = await fetch("http://localhost:3000/api/posts");
            const postsList = await res.json();
            setPosts(postsList);
        }
        fetchPosts()
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