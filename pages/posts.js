import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../auth_context";

export default function Posts() {
    const [posts, setPosts] = useState(null);
    const { user, logout } = useAuth()
    console.log(user)
    useEffect(() => {
        async function fetchPosts() {
            const { data: postsList } = await api.get("api/posts");
            setPosts(postsList);
            console.log(postsList);
        }
        if(user) fetchPosts()
    }, [user]);

    const onClick = async () => {
        await logout()
    }
    return (
        <>
        <ul>
            {posts?.map(post => {
                return (<li key={post.id}>{post.text}</li>)
            })}
        </ul>
            <button onClick={logout}>Logout</button>
        </>
    )
}