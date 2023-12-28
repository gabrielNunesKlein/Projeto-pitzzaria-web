import { createContext, ReactNode , useState, useEffect} from "react";
import { destroyCookie } from 'nookies';
import Router from "next/router";
import { api } from "../services/apiClient";

import { setCookie, parseCookies } from 'nookies';
import { toast } from "react-toastify";

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credential: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credential: SignUpProps) => Promise<void>
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode
}

type SignUpProps = {
    name: string;
    email: string;
    password: string
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    try {
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    } catch {
        console.log('Error, logout')
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    
    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user;

    useEffect(() => {
        const { '@nextauth.token': token } = parseCookies();

        if(token){

            api.get('/detail').then((response) => {
                console.log('reponse ', response);
                const { id, name, email } = response.data;

                setUser({
                    id,
                    name,
                    email
                });

            }).catch(() => {
                signOut();
            })

        }

    }, [])
    
    
    async function signIn({ email, password }: SignInProps){

        try {
            const response = await api.post('/session', {
                email,
                password
            })
    
            //console.log(response)
            const { id, name, token } = response.data;

            setCookie(undefined, '@nextauth.token', token , {
                maxAge: 60 * 60 * 24 * 30,
                path: '/'
            });

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            toast.success("Logado sucesso")
            Router.push('/dashboard');

        } catch(err){
            toast.error("Falha ao realizar o login")
            console.log('Error ', err);
        }

    }

    async function signUp({ name, email, password}: SignUpProps){
        try {
            await api.post('/users', {
                name,
                email,
                password
            });

            

            console.log('Cadastrado com sucesso');
            toast.success("Cadastro realizado com sucesso");
            Router.push('/')
        } catch(err){
            toast.error("Erro ao realizar o cadastro")
            console.log('Error ', err);
        }
    }


    
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            { children }
        </AuthContext.Provider>
    )
}