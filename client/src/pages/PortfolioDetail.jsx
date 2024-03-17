import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

import Form from "./PortfolioDetail/Form"
import FundList from "./PortfolioDetail/FundList";

export default function PortfolioDetail() {
  const [userPortfolio, setUserPortfolio] = useState('')
  const [amount, setAmount] = useState('')
  const [fundName, setFundName] = useState('')
  const [fundKod, setFundKod] = useState('')
  const [price, setPrice] = useState(0)
  const [startDate, setStartDate] = useState(new Date());

  const params = useParams();
  const portfolioID = params.id
  const userID = "2ba0b51d-6bbd-4f8a-8299-2ad3a4cc7cfd"

  useEffect(() => {
    axios.get(`/funds/fund-list/${userID}/${portfolioID}`)
      .then((res) => setUserPortfolio(res.data));
  }, []);

  const tefas = async (kod) => {
    const response = await axios.post(`/funds/tefas/${kod}`);
    return response;
  }

  const addFund = async (fund) => {
    const form = {
      userID,
      portfolioID,
      newFund: fund
    }
    const response = await axios.post('/funds/add-fund', form);
    setUserPortfolio(response.data)
  }

  const handleAddFund = async (event) => {
    const kod = event.target.getAttribute('kod');
    const name = event.target.getAttribute('name');
    
    const result = await tefas(kod);
    const lastPrice = result.data.fundInfo[0].SONFIYAT
    //işlem bitince fon listesini gizle
    setFundKod(kod)
    setFundName(name)
    setPrice(lastPrice)
  }

  const handlePickDate = async (date) => {
    console.log("date", date);
    const inputDate = new Date(date)
    const inputDateValue = Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate())
    // burda tekrar istek atma öncekini usestate ile kullan
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

  const submitForm = () => {
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
    // submitten sonra inputu sıfırla
    console.log("fund", fund);
    addFund(fund)
  }

  return (
    <div className="mt-8 flex flex-col items-center justify-start grow min-h-[50vh]">
      <h1>Portfolio Detail Page</h1>
      <Form
        submitForm = {submitForm}
        handleAddFund = {handleAddFund}
        handlePickDate = {handlePickDate}
        startDate = {startDate}
        setAmount = {setAmount}
        price = {price}
        amount = {amount}
      />
      <FundList userPortfolio = {userPortfolio} />
    </div>
  );
}