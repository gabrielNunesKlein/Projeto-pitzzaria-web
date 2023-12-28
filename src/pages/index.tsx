import { FormEvent, useContext, useState } from 'react';
import Head from "next/head";
import styles from '../../styles/home.module.scss'

import logoImg from '../../public/logo.svg';
import Image from "next/image";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { toast } from 'react-toastify';

import { AuthContext } from "../context/AuthContext";
import { canSSRGuest } from '../utils/canSSRGuets';

export default function Home() {

  const { signIn } = useContext(AuthContext);

  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ loading, setLoading ] = useState(false);

  async function hadleLogin(event: FormEvent){
    event.preventDefault();
    
    if(email == '' || password == ''){
      toast.warning("Preencha todos os campos")
      return;
    }

    setLoading(true);
    
    let data = {
      email,
      password
    }
    await signIn(data);

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
          <form onSubmit={hadleLogin}>
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
            >Acessar</Button>
          </form>
          <Link href="/signup" legacyBehavior>
            <a className={styles.text}>
              Não possui uma conta ? cadastra-se
            </a>        
          </Link>
  
        </div>
      </div>
    </>
  )
}


export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})