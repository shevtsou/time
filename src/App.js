import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  font-size: 80px;
  font-weight: 700;
  color: #50535d;
  background-color: #f0eedc;
`
const Indicators = styled.div`
  margin-top: 100px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`

const RateInput = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`

const Title = styled.div`
  margin-bottom: 50px;
  font-size: 40px;
`
function paddZeros(value, amount) {
  if (value < 0) {
    let result = ""
    for (let i = 0; i < amount; i++) {
      result += 'x'
    }
    return result
  }
  value = value.toString()
  while (value.length < amount) {
    value = '0' + value;
  }
  return value;
} 
function format(time) {

  const seconds = time % 60
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600) % 24
  const days = Math.floor(time / (3600 * 24)) % (30)
  const months = Math.floor(time / (3600 * 24 * 30)) % (12)
  // const years = Math.floor(time / (3600 * 24 * 30 * 12))
  // ${paddZeros(years, 5)}:
  // return `${paddZeros(months, 2)}:${paddZeros(days, 2)}:${paddZeros(hours, 2)}:${paddZeros(minutes, 2)}:${paddZeros(seconds, 2)}`
  return `${paddZeros(hours, 2)}:${paddZeros(minutes, 2)}:${paddZeros(seconds, 2)}`
}


class App extends React.Component {
  state = {
    seconds: 300,
    target: undefined,
    rate: 0,
    counting: 'normal',
    dead: false,
  }
  componentDidMount() {
    let timePass = 0
    setInterval(()=> {
      const { counting, target, seconds, rate} = this.state
      if (counting === 'normal' && timePass >= 1000) {
        this.setState((state) => ({seconds: state.seconds - 1}))
        timePass = 0
        if (seconds <= 0) {
          this.setState({dead: true})
        }
      }
      if (counting === 'fastdown' && timePass >= 10) {
        if (target !== seconds) {
          this.setState((state) => ({seconds: state.seconds + Math.floor((state.target - state.seconds) / 100)}))
        } else {
          this.setState({
            target: undefined,
            counting: 'waiting'
          })
        }
        timePass = 0
      }
      if (counting === 'fastup' && timePass >= 10) {
        if (target !== seconds) {
          this.setState((state) => ({seconds: state.seconds + Math.ceil((state.target - state.seconds) / 100)}))
        } else {
          this.setState({
            target: undefined,
            counting: 'normal'
          })
        }
        timePass = 0
      }
      if (counting === 'waiting' && timePass >= 1000) {
        if (Math.random() > 0.4) {
          this.setState((state) => ({counting: 'fastup', target: +state.seconds + 2 * state.rate, rate: 0 }))
        } else {
          this.setState({counting: 'normal', rate: 0})
        }
        timePass = 0

      }
      timePass += 10
    }, 10)
  }
  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const rate = +e.target.value;
      if (rate + 10 < this.state.seconds) {
        const target = this.state.seconds - rate;
        const counting = 'fastdown'
        this.setState({
          target,
          counting,
          rate
        })      
      }
    }
  }

  render() {
    return (
      <>
        {!this.state.dead ? <>
          <Wrapper>
            <Indicators>
              <Title>It's just time.</Title>
              <div>{format(this.state.seconds)}</div>
            </Indicators>
            <RateInput>
              <TextField
                id="standard-number"
                label="RATE"
                type="number"
                onKeyDown={this._handleKeyDown}
                style={{fontSize: "50px"}}
              />
            </RateInput>
          </Wrapper>
        </> : <>
          Your time is out
        </>}

      </>
    );

  }
}

export default App;
