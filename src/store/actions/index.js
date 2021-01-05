export function UpdateUsd() {
  return (dispatch) => {
    fetch('https://api.cryptonator.com/api/ticker/btc-usd')
      .then(res=>res.json())
      .then(({ticker})=>{
        dispatch({
          type: 'UPDATE_RATE_USD',
          payload: ticker
        })
      })
      .catch(err => console.log(err))
  }
}

export function UpdateEur() {
  return (dispatch) => {
    fetch('https://api.cryptonator.com/api/ticker/btc-eur')
      .then(res=>res.json())
      .then(({ticker})=>{
        dispatch({
          type: 'UPDATE_RATE_EUR',
          payload: ticker
        })
      })
      .catch(err => console.log(err))
  }
}

export function UpdateGbp() {
  return (dispatch) => {
    fetch('https://api.cryptonator.com/api/ticker/btc-gbp')
      .then(res=>res.json())
      .then(({ticker})=>{
        dispatch({
          type: 'UPDATE_RATE_GBP',
          payload: ticker
        })
      })
      .catch(err => console.log(err))
  }
}