import React, { createContext, useState, useContext, useEffect } from 'react'
import Cookies from 'js-cookie'
import api from './api';
import jwt from "jsonwebtoken";

const JWT_KEY = process.env.JWT_SECRET_KEY;
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchUserFromCookie() {
            const token = Cookies.get('token')
            if (token) {
                api.defaults.headers.Authorization = `Bearer ${token}`
                const { data: user } = await api.get('api/users/me')
                if (user) setUser(user);
            }
            setIsLoading(false)
        }
        fetchUserFromCookie()
    }, [])

    const login = async (username, password) => {
        const { data: {token } } = await api.post('api/auth/login', { username, password })
        console.log("TOKEN ", token)
        if (token) {
            Cookies.set('token', token, { expires: 60 })
            api.defaults.headers.Authorization = `Bearer ${token}`
            const { data: user } = await api.get('api/users/me')
            setUser(user)
        }
    }

    const logout = () => {
        Cookies.remove('token')
        setUser(null)
        delete api.defaults.headers.Authorization
        window.location.pathname = '/login'
    }


    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, loading: isLoading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}



export const useAuth = () => useContext(AuthContext)

export const withAuth = (handler) => {
    return (req, res) => {
        const { authorization } = req.headers;
        if(!authorization) return res.status(401).json({ error: "The authorization header is required" });
        const token = authorization.split(' ')[1];
        
        jwt.verify(token, JWT_KEY, (err, payload) => {
            if(err) return res.status(401).json({ error: "Unauthorized" });
            req.auth = { user: payload };
            handler(req, res);
        });
    }
}