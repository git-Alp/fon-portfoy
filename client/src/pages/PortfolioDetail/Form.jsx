import { useState} from "react"
import axios from 'axios'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Form(props) {
  const [isShow, setIsShow] = useState(false)
  const [fundArray, setFundArray] = useState([])
  const [searchFunds, setSearchFunds] = useState([])
  const [inputValue, setInputValue] = useState('')

  const getFundList = async () => {
    const response = await axios.get('/funds/all-funds');
    setFundArray(response.data)
  }
  const showForm = (event) => {
    event.preventDefault();
    setIsShow(!isShow)
    getFundList();
  }
  const handleInputChange = async (value) => {
    // büyük harf arama yapmıyo
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

  const submitForm = () => {
    setIsShow(false)
    props.submitForm()
  }

  return (
    <div>
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
                    onClick={e => props.handleAddFund(e)}
                  >
                    {fund.FONUNVAN}
                  </div>
                )
              })
            }
          </div>
          <DatePicker 
            wrapperClassName="w-full"
            selected={props.startDate} 
            maxDate={new Date()}
            onChange={(date) => props.handlePickDate(date)} 
            required
          />
          <input 
            type="text" 
            value={props.price} 
            onChange={e => props.setAmount(e.target.value)} 
            disabled
          />
          <input 
            type="text" 
            placeholder="Miktar giriniz"
            value={props.amount} 
            onChange={e => props.setAmount(e.target.value)} 
            required
          />
          {/* anlık olarak toplam maaliyeti gösteren input ekle */}
          <button type="submit">Ekle</button>
        </form>
      }
    </div>
  )

}