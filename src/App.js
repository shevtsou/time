import React from 'react';
import './App.css';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components'
import Confetti from 'react-confetti'

const Wrapper = styled.div`
  .body {
    background-color: #f0eedc;
  }
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  font-size: 80px;
  font-weight: 700;
  color: #50535d;
  background-color: #f0eedc;
  @media (max-width: 425px) {
    font-size: 60px;
  }
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
  @media (max-width: 425px) {
    margin-bottom: 25px;
    font-size: 30px;
  }
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
  const years = Math.floor(time / (3600 * 24 * 30 * 12))
  // return `${paddZeros(months, 2)}:${paddZeros(days, 2)}:${paddZeros(hours, 2)}:${paddZeros(minutes, 2)}:${paddZeros(seconds, 2)}`
  return `${paddZeros(hours, 2)}:${paddZeros(minutes, 2)}:${paddZeros(seconds, 2)}`
}


class App extends React.Component {
  state = {
    seconds: 24*3600,
    target: undefined,
    rate: 0,
    counting: 'normal',
    dead: false,
    luck: false,
    win: false,
  }
  componentDidMount() {
    let timePass = 0
    setInterval(()=> {
      const { counting, target, seconds} = this.state
      if (counting === 'normal' && timePass >= 1000) {
        if (this.state.seconds > 24*3600) {
          this.setState({win: true, counting: 'win'})
        }
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
        let hardness = 0.5
        // if (this.state.luck) {
        //   hardness = 0
        //   this.setState({luck: false})
        // }
        // if (this.state.seconds < 120) {
        //   hardness = 0.1
        // } else if (this.state.seconds < 300) {
        //   hardness = 0.2
        // } else if (this.state.seconds < 400) {
        //   hardness = 0.3
        // } else if (this.state.seconds < 600) {
        //   hardness = 0.5
        // } else if (this.state.seconds < 1200) {
        //   hardness = 0.6
        // } else if (this.state.seconds < 1800) {
        //   hardness = 0.7
        // } else if (this.state.seconds < 2400) {
        //   hardness = 0.8
        // } else if (this.state.seconds < 3000) {
        //   hardness = 0.9
        // }
        if (Math.random() > hardness) {
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
    console.log(e.key)
    if (e.key === 'Enter') {
      const rate = +e.target.value;
      if (this.state.counting === 'normal' && rate + 10 < this.state.seconds) {
        const target = this.state.seconds - rate;
        const counting = 'fastdown'
        this.setState({
          target,
          counting,
          rate,
          luck: false,
        })      
      }
    }
  }

  render() {
    
    return (
      <div style={{backgroundColor: '#f0eedc'}}>
        {!this.state.dead ? <>
          <Confetti run={this.state.win} 
          />
          <Wrapper>
            <Indicators>
              {this.state.win ? (
                <Title>You are win</Title>
              ) : (
                <Title>It's just time.</Title>
              )}

              <div>{format(this.state.seconds)}</div>
            </Indicators>
            <RateInput>
              <TextField
                id="standard-number"
                label="RATE"
                onKeyDown={this._handleKeyDown}
                style={{fontSize: "50px"}}
              />
            </RateInput>
          </Wrapper>
        </> : <>
          Your time is out
        </>}

      </div>
    );

  }
}

export default App;
