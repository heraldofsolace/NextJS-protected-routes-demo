import { users } from "../../../data";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_KEY = process.env.JWT_SECRET_KEY;

export default async function handler(req, res) {
    if(req.method !== 'POST') return res.status(405).json({ error: "Method not allowed"});

    const { username, password } = req.body;
    if(!username || !password) return res.status(400).json({ error: "Username and password are required"});

    const user = users.find(user => {
        return user.username === username;
    });

    if(!user) return res.status(404).json({ error: "User not found "});

    const { password: userPassword, id, location, name } = user;
    const match = await bcrypt.compare(password, userPassword);
    if(!match) return res.status(401).json({ error: "Wrong password" });

    const payload = { userId: id, location, name };
    jwt.sign(payload, JWT_KEY, { expiresIn: 24 * 3600 }, (err, token) => {
        res.status(200).json({ token });
    });
}