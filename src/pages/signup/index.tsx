import { FormEvent, useState, useContext } from "react";
import Head from "next/head";
import styles from '../../../styles/home.module.scss'

import logoImg from '../../../public/logo.svg';
import Image from "next/image";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/AuthContext";

export default function SignUp() {

    const { signUp } = useContext(AuthContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleSinup(event: FormEvent) {
        event.preventDefault();
        if(name == '' || email == '' || password == ''){
            toast.warning("Preencha todos os campos")
            return;
        }



        setLoading(true);

        let data = {
            name,
            email,
            password
        }

        await signUp(data);

        setLoading(false);
    }

  return (
    <>
      <Head>
        <title>
          SujeitoPitzza - Faça seu login
        </title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo" />
        <div className={styles.login}>
            <h1>Criando uma conta</h1>
          <form onSubmit={handleSinup}>
          <Input 
              placeholder="Digite seu nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input 
              placeholder="Digite seu E-mail"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder="Sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              loading={loading}
            >Cadatrar</Button>
          </form>
          <Link href="/" legacyBehavior>
            <a className={styles.text}>
              Já possuo cadastro
            </a>        
          </Link>
  
        </div>
      </div>
    </>
  )
}
