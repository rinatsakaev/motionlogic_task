import ActionTypes from './types'
export function reducer(state, action) {
    switch (action.type) {
        case ActionTypes.SELECT_CITY: {
            const {activeCity} = action.payload;
            return {
                ...state,
                activeCity: activeCity,
                inputValue: activeCity.name
            };
        }
        case ActionTypes.SET_ACTIVE_CITY: {
            const {activeCity} = action.payload;
            return {
                ...state,
                activeCity
            };
        }
        case ActionTypes.ADD_CITY: {
            const selectedCities = [...state.selectedCities, state.activeCity];
            sessionStorage.setItem('selectedCities', JSON.stringify(selectedCities));
            return {
                ...state,
                selectedCities,
                inputValue: '',
                predictedCities: []
            };
        }
        case ActionTypes.CHANGE_INPUT:
            const {inputValue} = action.payload;
            return {
                ...state,
                inputValue
            };
        case ActionTypes.PREDICT_CITIES:
            const {predictedCities} = action.payload;
            return {
                ...state,
                predictedCities: predictedCities
            };
        case ActionTypes.REMOVE_CITY: {
            const index = state.selectedCities.findIndex(x => x.id === action.payload.id);
            const selectedCities = [...state.selectedCities.slice(0, index), ...state.selectedCities.slice(index + 1)];
            sessionStorage.setItem('selectedCities', JSON.stringify(selectedCities));
            return {
                ...state,
                selectedCities
            };
        }
        case ActionTypes.RESET:
            return {
                ...state,
                predictedCities: [],
                activeCity: undefined
            };
        default:
            return state;
    }
}

export const initialState = () => {
    let selectedCities = JSON.parse(sessionStorage.getItem('selectedCities'));
    if (!selectedCities)
        selectedCities = [];
    return {selectedCities, predictedCities: [], inputValue: ''};
};
