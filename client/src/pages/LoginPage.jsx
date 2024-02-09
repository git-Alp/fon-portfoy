import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import axios from 'axios'

export default function LoginPage() {
  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState('')
  const [isFailed, setIsFailed] = useState('')

  const signInUser = (event) => {
    event.preventDefault();

    const form = {
      mail,
      password
    }

    axios.post('/sign-in', form)
      .then(res => setRedirect(true))
      .catch(error => setIsFailed(true));
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }

  return(
    <div className="mt-8 flex flex-col items-center justify-start grow min-h-screen">
      <h1 className="text-4xl mb-16 text-center">Kullanıcı Bilgileri</h1>
      <span className={"text-radicalRed mb-4 text-center " + (isFailed ? 'block' : 'hidden')}>
        Girdiğiniz bilgiler hatalı! Lütfen tekrar deneyin.
      </span>
      <form className="max-w-xl mx-auto" onSubmit={signInUser}>
        <input 
          type="email" 
          placeholder="E-posta"
          value={mail}
          onChange={e => setMail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Şifre" 
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button>Giriş Yap</button>
        <div className="text-center py-2">
          Üye olmak için <Link className="underline text-black" to={'/signup'}>tıklayın</Link>
        </div>
      </form>
    </div>
  );
}