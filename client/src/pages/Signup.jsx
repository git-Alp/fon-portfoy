import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import axios from 'axios'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState('')
  const [isFailed, setIsFailed] = useState('')

  const registerUser = (event) => {
    event.preventDefault();

    const form = {
      name,
      surname,
      mail,
      password
    }

    axios.post('/register', form)
      .then(res => setRedirect(true))
      .catch(error => setIsFailed(true));
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }

  return(
    <div className="mt-8 flex flex-col items-center justify-start grow min-h-screen">
      <h1 className="text-4xl mb-16 text-center">Kayıt Oluşturma</h1>
      <span className={"text-radicalRed mb-4 text-center " + (isFailed ? 'block' : 'hidden')}>
        İşlem başarısız! Lütfen tekrar deneyin.
      </span>
      <form onSubmit={registerUser} className="max-w-xl mx-auto">
        <input 
          type="text" 
          placeholder="İsim" 
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Soyisim" 
          value={surname}
          onChange={e => setSurname(e.target.value)}
        />
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
        <button>Kayıt Ol</button>
        <div className="text-center py-2">
          Hesabınız var mı? <Link className="underline text-black" to={'/login'}>Giriş yap</Link>
        </div>
      </form>
    </div>
  );
}