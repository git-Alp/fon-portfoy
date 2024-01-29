import './App.css'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:4000'

function App() {
  const testServer = (event) => {
    event.preventDefault();
    axios.get('/test');
  }

  return (
    <>
      <h1 className='bg-red-500'>Fon Portföy</h1>
      <form onSubmit={testServer}>
        <button>test</button>
      </form>
    </>
  )
}

export default App
