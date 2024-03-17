import { Link } from "react-router-dom"

export default function PortfolioList(props) {
  return (
    <div className="flex flex-col my-2 w-full max-w-xl">
    {props.userInfo &&
      props.userInfo.portfolios.map(portfolio => {
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
  )
}