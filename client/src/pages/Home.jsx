import { Link } from "react-router-dom"

export default function Home() {

  return (
    <>
      <h1>Home Page</h1>
      <div className="text-center py-2">
        <Link className="underline text-black" to={'/portfolios'}>Portföylerim</Link>
      </div>
    </>
  );
}