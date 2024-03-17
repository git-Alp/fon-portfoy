import { useState, useEffect } from "react"
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

import Form from "./Portfolios/Form";
import PortfolioList from "./Portfolios/PortfolioList";

export default function Portfolios() {

  const [isShow, setIsShow] = useState(false)
  const [userInfo, setUserInfo] = useState('')
  const [portfolioName, setPortfolioName] = useState('')

  const userID = "2ba0b51d-6bbd-4f8a-8299-2ad3a4cc7cfd"

  useEffect(() => {
    axios.get(`/portfolios/portfolio-list/${userID}`)
      .then((res) => setUserInfo(res.data));
  }, []);

  const addPortfolio = async (portfolio) => {
    const form = {
      userID,
      newPortfolio: portfolio
    }
    const response = await axios.post('/portfolios/add-portfolio', form);
    setUserInfo(response.data)
  }

  const showForm = (value) => setIsShow(value)

  const handlePortfolioName = (event) => setPortfolioName(event.target.value)

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
      <Form 
        isShow = {isShow}
        showForm = {showForm}
        submitForm = {submitForm}
        handlePortfolioName = {handlePortfolioName}
      />
      <PortfolioList userInfo = {userInfo} />
    </div>
  );
}