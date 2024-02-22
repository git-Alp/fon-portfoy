import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PortfolioDetail() {

  const [isShow, setIsShow] = useState(false)
  const [userPortfolio, setUserPortfolio] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [amount, setAmount] = useState('')
  const [fundName, setFundName] = useState('')
  const [fundKod, setFundKod] = useState('')
  const [price, setPrice] = useState(0)
  const [fundArray, setFundArray] = useState([])
  const [searchFunds, setSearchFunds] = useState([])
  const [startDate, setStartDate] = useState(new Date());

  const params = useParams();
  const portfolioID = params.id
  const userID = "2a4eebd2-caaa-4601-93b6-dcea743a851c"

  useEffect(() => {
    axios.get(`/fund-list/${userID}/${portfolioID}`)
      .then((res) => setUserPortfolio(res.data));
  }, []);

  const tefas = async (kod) => {
    const response = await axios.post(`/tefas/${kod}`);
    return response;
  }

  const getFundList = async () => {
    const response = await axios.get('/all-funds');
    setFundArray(response.data)
  }

  const addFund = async (fund) => {
    const form = {
      userID,
      portfolioID,
      newFund: fund
    }
    const response = await axios.post('/add-fund', form);
    setUserPortfolio(response.data)
  }

  const showForm = () => {
    setIsShow(!isShow)
    getFundList();
  }

  const handleInputChange = async (value) => {
    setInputValue(value)
    const filterFundArray = fundArray.filter(fund => {
      return (
        value && 
        fund && 
        (fund.FONKODU.toLowerCase().includes(value) || 
        fund.FONUNVAN.toLowerCase().includes(value))
      )
    });
    setSearchFunds(filterFundArray);
  }

  const handleAddFund = async (event) => {
    const kod = event.target.getAttribute('kod');
    const name = event.target.getAttribute('name');
    
    const result = await tefas(kod);
    const lastPrice = result.data.fundInfo[0].SONFIYAT

    setFundKod(kod)
    setFundName(name)
    setPrice(lastPrice)
  }

  const handlePickDate = async (date) => {
    const inputDate = new Date(date)
    const inputDateValue = Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate())
    const result = await tefas(fundKod);
    
    setStartDate(inputDateValue)

    const datePrice = result.data.fundPrices1Y.find(item => {
      const fundDate = new Date(item.TARIH)
      const fundDateValue = Date.UTC(fundDate.getFullYear(), fundDate.getMonth(), fundDate.getDate())
      return fundDateValue == inputDateValue
    })

    const fundPrice =  parseFloat(datePrice.FIYAT).toFixed(4)
    setPrice(fundPrice)
  }

  const submitForm = (event) => {
    event.preventDefault();

    const fundID = uuidv4();
    const total = price * amount

    const fund = {
      id: fundID,
      kod: fundKod,
      name: fundName,
      price,
      startDate,
      amount,
      total,
      createDate: new Date().getTime(),
      status: true
    }

    console.log("fund", fund);
    addFund(fund)
    setIsShow(false)
  }

  return (
    <div className="mt-8 flex flex-col items-center justify-start grow min-h-[50vh]">
      <h1>Portfolio Detail Page</h1>
      <div className="cursor-pointer" onClick={showForm}>Yeni Fon eklemek için tıklayın</div>
      {isShow && 
        <form className="w-full max-w-xl mx-auto" onSubmit={submitForm}>
          <input 
            type="text" 
            placeholder="Fon ismini yazın"
            value={inputValue} 
            onChange={e => handleInputChange(e.target.value)} 
            required
          />
          <div className="my-2 w-full max-h-80 bg-gallery shadow-xl rounded-xl overflow-scroll">
            {
              searchFunds.map(fund => {
                return (
                  <div 
                    className="p-2 cursor-pointer hover:bg-silverChalice" 
                    key={fund.FONKODU}
                    kod={fund.FONKODU}
                    name={fund.FONUNVAN}
                    onClick={e => handleAddFund(e)}
                  >
                    {fund.FONUNVAN}
                  </div>
                )
              })
            }
          </div>
          <DatePicker 
            wrapperClassName="w-full"
            selected={startDate} 
            maxDate={new Date()}
            onChange={(date) => handlePickDate(date)} 
            required
          />
          <input 
            type="text" 
            value={price} 
            onChange={e => setAmount(e.target.value)} 
            disabled
          />
          <input 
            type="text" 
            placeholder="Miktar giriniz"
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            required
          />
          <button>Ekle</button>
        </form>
      }

      <div className="flex flex-col my-2 w-full max-w-xl">
        <div className="flex flex-row justify-between w-full p-2 my-2 cursor-pointer bg-gallery shadow-lg rounded-xl hover:bg-silverChalice">
          <div className="w-2/4 mx-4">Fon İsmi</div>
          <div className="w-1/4 mx-4">Fon Alış Fiyatı</div>
          <div className="w-1/4">Maliyet</div>
        </div>

        {userPortfolio &&
          userPortfolio.funds.map(fund => {
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
    </div>
  );
}