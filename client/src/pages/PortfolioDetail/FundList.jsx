
export default function FundList(props) {
  return (
    <div className="flex flex-col my-2 w-full max-w-xl">
      <div className="flex flex-row justify-between w-full p-2 my-2 cursor-pointer bg-gallery shadow-lg rounded-xl hover:bg-silverChalice">
        <div className="w-2/4 mx-4">Fon İsmi</div>
        <div className="w-1/4 mx-4">Fon Alış Fiyatı</div>
        <div className="w-1/4">Maliyet</div>
      </div>

      {props.userPortfolio &&
        props.userPortfolio.funds.map(fund => {
          return (
            <div
              className="flex flex-row justify-between p-2 my-2 cursor-pointer bg-gallery shadow-lg rounded-xl hover:bg-silverChalice"
              key={fund.id}
            >
              <div className="w-2/4 mx-4">{fund.name} - ({fund.kod})</div>
              <div className="w-1/4 mx-4">{fund.price}</div>
              <div className="w-1/4">{fund.total}</div>
              
            </div>
          )
        })
      }
    </div>
  )
}