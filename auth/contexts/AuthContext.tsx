import { createContext, ReactNode, useEffect, useState } from "react";
import Router from 'next/router'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { api } from "../services/apiClient";


type User = {
    email: string;
    permissions: string;
    roles: string;
}

type SignInCrendemtials = {
    email: string,
    password: string
}

type AuthContextData = {
    signIn(credentials: SignInCrendemtials): Promise<void>;
    user: User;
    isAuthenticated: boolean;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function  signOut() {
    destroyCookie(undefined, 'nextauth.token' )
    destroyCookie(undefined, 'nextauth.refreshToken' )

    Router.push('/')
}

export function AuthProvider({ children }: AuthProviderProps) {


    // Armazenando os dados do usuário
    const [user, setUser] = useState<User>();

    const isAuthenticated = !!user;

    //Carregar user novamente 

    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies()

        if (token) {
            api.get('/me').then(response => {

            const { email, permissions, roles } = response.data

            setUser({ email, permissions, roles })
                
            })
            .catch(() => {
                signOut()
            })
        }
    }, [])


    async function signIn({ email, password }: SignInCrendemtials) {
        //chamada de autenticação 

        try {
            const response = await api.post('sessions', {
                email,
                password
            })

            const { token, refreshToken, permissions, roles } = response.data;

            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 *24 * 30, // 30 dias
                path: '/', // Global
            })
            setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
                maxAge: 60 * 60 *24 * 30, // 30 dias
                path: '/', // Global
            })
            // sessionStorage
            // LocalStorage
            // cookies

            setUser({
                email,
                permissions,
                roles
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            Router.push('/dashboard')

        } catch (err) {
            console.log(err);
            
        }
}

    return (

        <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    )
}