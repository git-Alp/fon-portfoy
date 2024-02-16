import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

export default function Portfolios() {

  const [isShow, setIsShow] = useState(false)
  const [userInfo, setUserInfo] = useState('')
  const [portfolioName, setPortfolioName] = useState('')

  const userID = "9d49305f-d848-4b69-ab55-f309f08cead3"

  useEffect(() => {
    axios.get(`/portfolio-list/${userID}`)
      .then((res) => setUserInfo(res.data));
  }, []);

  const addPortfolio = async (portfolio) => {
    const form = {
      userID,
      newPortfolio: portfolio
    }
    const response = await axios.post('/add-portfolio', form);
    setUserInfo(response.data)
  }

  const showForm = () => setIsShow(!isShow)

  const submitForm = async (event) => {
    event.preventDefault();
    console.log("userInfo", userInfo);

    const portfolioID = uuidv4();

    const portfolio = {
      id: portfolioID,
      name: portfolioName,
      createDate: new Date().getTime(),
      updateDate: new Date().getTime(),
      status: true,
      funds: []
    }
    addPortfolio(portfolio)

    setIsShow(false)
  }

  return (
    <div className="mt-8 flex flex-col items-center justify-start grow min-h-[50vh]">
      <h1>Portfolios Page</h1>
      <div className="cursor-pointer" onClick={showForm}>Yeni Portföy oluşturmak için tıklayın</div>
      {isShow &&
        <form className="w-full max-w-xl mx-auto" onSubmit={submitForm}>
          <input
            type="text"
            placeholder="Portföy ismini yazın"
            onChange={e => setPortfolioName(e.target.value)}
          />
          <button>test</button>
        </form>
      }
      <div className="flex flex-col my-2 w-full max-w-5xl">
        {userInfo &&
          userInfo.portfolios.map(portfolio => {
            return (
              <Link
                className="p-2 my-2 cursor-pointer bg-gallery shadow-lg rounded-xl hover:bg-silverChalice"
                key={portfolio.id}
                to={`/portfolio/${portfolio.id}`}
              >
                {portfolio.name}
              </Link>
            )
          })
        }
      </div>
    </div>
  );
}