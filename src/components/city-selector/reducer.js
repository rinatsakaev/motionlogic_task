export function reducer(state, action) {
    switch (action.type) {
        case 'SELECT_CITY': {
            const {activeCity} = action.payload;
            return {
                ...state,
                activeCity: activeCity,
                inputValue: activeCity.name
            };
        }
        case 'SET_ACTIVE_CITY': {
            const {activeCity} = action.payload;
            return {
                ...state,
                activeCity
            };
        }
        case 'ADD_CITY': {
            const selectedCities = [...state.selectedCities, state.activeCity];
            sessionStorage.setItem('selectedCities', JSON.stringify(selectedCities));
            return {
                ...state,
                selectedCities,
                inputValue: '',
                predictedCities: []
            };
        }
        case 'CHANGE_INPUT':
            const {inputValue} = action.payload;
            return {
                ...state,
                inputValue
            };
        case 'PREDICT_CITIES':
            const {predictedCities} = action.payload;
            return {
                ...state,
                predictedCities: predictedCities
            };
        case 'REMOVE_CITY': {
            const index = state.selectedCities.findIndex(x => x.id === action.payload.id);
            const selectedCities = [...state.selectedCities.slice(0, index), ...state.selectedCities.slice(index + 1)];
            sessionStorage.setItem('selectedCities', JSON.stringify(selectedCities));
            return {
                ...state,
                selectedCities
            };
        }
        case 'RESET':
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
