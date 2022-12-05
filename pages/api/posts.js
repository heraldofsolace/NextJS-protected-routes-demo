import { posts } from "../../data";
import { getAuth } from "@clerk/nextjs/server";

export default function handler(req, res) {
    const { userId } = getAuth(req);
    const userPosts = posts.filter(post => {
        return post.userId == userId
    })

    res.status(200).json(userPosts)
}