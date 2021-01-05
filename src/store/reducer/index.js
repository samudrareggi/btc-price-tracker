const initState = {
  rateUsd: {},
  rateEur: {},
  rateGbp: {}
}

export default function reducer(state = initState, action) {
  switch (action.type) {
    case 'UPDATE_RATE_USD':
      return { ...state, rateUsd: action.payload }
    case 'UPDATE_RATE_EUR':
      return { ...state, rateEur: action.payload }
    case 'UPDATE_RATE_GPB':
      return { ...state, rateGbp: action.payload }
  
    default:
      return state
  }
}