const initialState = {
  flightsData: [],
};

const ActionType = {
  LOAD_FLIGHTS_DATA: 'LOAD_FLIGHTS_DATA',
};

const ActionCreator = {
  loadFlightsData: (flights) => ({
    type: ActionType.LOAD_FLIGHTS_DATA,
    payload: flights,
  }),
};

const Operation = {
  getFlightsData: () => (dispatch) => {
    fetch('http://localhost:3004/flights')
      .then((res) => res.json())
      .then((data) => dispatch(ActionCreator.loadFlightsData(data)))
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.LOAD_FLIGHTS_DATA: {
      return { ...state, flightsData: action.payload }
    }
    default:
      return state
  }
};

export { reducer, Operation }
