import axios from 'axios'

export default function HomePage() {

  const tefas = async (event) => {
    event.preventDefault();
    const kod = 'BUY'
    const response = await axios.post(`/tefas/${kod}`);
    console.log("response.data", response.data);
  }

  return (
    <>
      <h1>Home Page</h1>
      <form onSubmit={tefas}>
        <button>test</button>
      </form>
    </>
  );
}