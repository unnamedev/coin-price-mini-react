import React, {useEffect, useState} from "react"
import {motion} from "framer-motion"
import styled from "styled-components"

// 🪜 Styles
import {GlobalStyles} from "./globalStyles"

// 🪜 Component - App
const App = () => {
    const [currency, setCurrency] = useState({code: "USD", rate_float: 0})
    const [currencyList, setCurrencyList] = useState(["USD", "GBP", "EUR"])

    /**
     * Animation params
     * @type {{visible: {y: number, opacity: number}, hidden: {y: number, opacity: number}}}
     */
    const variants = {
        hidden: {opacity: 0, y: 200},
        visible: {opacity: 1, y: 0},
    }

    /**
     * Fetch quote data
     * @returns {Promise<void>}
     */
    const fetchData = async (code = "", element = "") => {
        const response = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
        const data = await response.json()
        setCurrency({code, rate_float: data.bpi[code].rate_float})

        if (element !== "") {
            document.querySelectorAll(".is-active").forEach(el => el.classList.remove("is-active"))
            element.classList.add("is-active")
        }
    }

    useEffect(() => {
        fetchData(currency.code)
    }, [])

    return <>
        <GlobalStyles/>
        <Wrapper>
            <motion.div variants={variants} initial="hidden" animate="visible" transition={{duration: 1}}>
                <Menu>
                    {currencyList.map((item, idx) =>
                        <MenuItem
                            key={idx}
                            className={`${item === currency.code ? "is-active" : ""}`}
                            onClick={(event) => fetchData(item, event.target)}
                        >{item}</MenuItem>
                    )}
                </Menu>
            </motion.div>

            <Inner>
                <motion.div variants={variants} initial="hidden" animate="visible" transition={{duration: 1, delay: 0.4}}>
                    <Title>{currency.rate_float.toFixed(1)}</Title>
                    <Type>{currency.code} per BTC</Type>
                </motion.div>
            </Inner>
        </Wrapper>
    </>
}

export default App

// 🪜 Component
const Wrapper = styled.div`
  background-color: #222;
  color: #ffffff;
  min-height: 100vh;
  font-family: var(--base-font-family);
  padding-left: 10px;
  padding-right: 10px;
  display: grid;
  grid-template-columns: auto minmax(200px, 1920px) auto;
  align-items: flex-start;

  & > * {
    grid-column: 2/3;
  }
`

const Inner = styled.div``

const Menu = styled.ul`
  display: flex;
  max-width: 250px;
  gap: 10px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 20px;
  justify-content: center;

  @media (min-width: 768px) {
    margin-right: 0;
  }
`

const MenuItem = styled.li`
  cursor: pointer;
  transition: color 0.25s;
  position: relative;

  &::after {
    position: absolute;
    content: '';
    width: 0%;
    height: 2px;
    left: 0;
    bottom: -2px;
    background-color: #ffad60;
    transition: width 0.25s;
  }

  &:hover,
  &.is-active {
    color: #ffad60;

    &::after {
      width: 100%;
    }
  }

  &.is-active {
    &::after {
      width: 100%;
    }
  }
`

const Title = styled.h1`
  font-size: calc(60px + (300 - 60) * ((100vw - 300px) / (1920 - 300)));
  line-height: 1.3;
  text-align: center;
  margin-bottom: calc(10px + (30 - 10) * ((100vw - 300px) / (1920 - 300)));
`

const Type = styled.p`
  text-align: center;
  font-size: calc(18px + (30 - 18) * ((100vw - 300px) / (1920 - 300)));
`

const Loading = styled(Title)``
