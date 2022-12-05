import { withAuth } from "../../auth_context";
import { users, posts } from "../../data";

export default withAuth((req, res) => {
    const { userId } = req.auth.user;

    const userPosts = posts.filter(post => {
         return post.userId == userId
     })
 
     res.status(200).json(userPosts)
})