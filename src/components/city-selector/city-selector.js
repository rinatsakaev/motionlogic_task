import React, {useContext, useEffect, useReducer} from 'react';
import {SelectorContext} from '../../App';
import {reducer, initialState} from './reducer';
import ActionTypes from './types';

function CitySelector() {
    const cities = useContext(SelectorContext);
    const [{activeCity, predictedCities, selectedCities, inputValue}, dispatch] = useReducer(reducer, initialState());

    useEffect(() => {
        if (inputValue.length < 3)
            dispatch({type: ActionTypes.RESET});
        else
            dispatch({
                type: ActionTypes.PREDICT_CITIES,
                payload: {
                    predictedCities: cities.filter(x => x.name.startsWith(inputValue))
                }
            });
    }, [inputValue, cities]);

    const addCityToList = () => {
        if (!activeCity || selectedCities.findIndex(x => x.id === activeCity.id) !== -1)
            return;

        dispatch({type: ActionTypes.ADD_CITY});
    };

    const makeScroll = () => {
        const citySelectorList = document.querySelector('.city-selector__list');
        const selectedCityItem = document.querySelector('.city-selector__item_hovered');
        citySelectorList.scrollTop = selectedCityItem.offsetTop - citySelectorList.clientHeight;
    };

    const handleKeyDown = (e) => {
        if (predictedCities.length === 0 || !['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key))
            return;

        if (!activeCity) {
            dispatch({
                type: ActionTypes.SET_ACTIVE_CITY, payload: {
                    activeCity: predictedCities[0]
                }
            });
            return;
        }

        const activeCityIndex = predictedCities.findIndex(x => x.id === activeCity.id);
        switch (e.key) {
            case 'Enter':
                addCityToList();
                break;
            case 'ArrowUp':
                if (activeCityIndex > 0) {
                    dispatch({
                        type: ActionTypes.SET_ACTIVE_CITY,
                        payload: {
                            activeCity: predictedCities[activeCityIndex - 1]
                        }
                    });
                    makeScroll();
                }
                break;

            case 'ArrowDown':
                if (activeCityIndex < predictedCities.length - 1) {
                    dispatch({
                        type: ActionTypes.SET_ACTIVE_CITY,
                        payload: {
                            activeCity: predictedCities[activeCityIndex + 1]
                        }
                    });
                    makeScroll();
                }
                break;

            default:
                return;
        }
    };

    const selectedCitiesItems = selectedCities.map(x =>
        <li key={x.id}
            className={
                `selected-cities__item ${activeCity && x.id === activeCity.id ? 'selected-cities__item_highlited'
                    : null}`
            }>
            <img src={'close.svg'} className='selected-cities__remove-icon' alt='Удалить'
                 onClick={() => dispatch({type: ActionTypes.REMOVE_CITY, payload: {id: x.id}})}/>
            {x.name}
        </li>);

    const predictedCitiesItems = predictedCities.map(x =>
        <li key={x.id}
            className={
                `city-selector__item ${activeCity && activeCity.id === x.id ? 'city-selector__item_hovered'
                    : null}`
            }
            onClick={() => dispatch({type: ActionTypes.SELECT_CITY, payload: {activeCity: x}})}>
            {x.name}
        </li>
    );

    return (
        <React.Fragment>
            <div className="city-selector">
                <div className="city-selector__form">
                    <input className="city-selector__input"
                           placeholder="Select city"
                           value={inputValue}
                           onInput={(e) => dispatch({
                               type: ActionTypes.CHANGE_INPUT,
                               payload: {
                                   inputValue: e.target.value
                               }
                           })}
                           onKeyDown={(e) => handleKeyDown(e)}
                    />
                    <button className="city-selector__button" onClick={() => addCityToList()}>Добавить</button>
                </div>
                {predictedCitiesItems.length ? <ul className="city-selector__list">{predictedCitiesItems}</ul> : null}
            </div>
            <ul className="selected-cities">
                {selectedCitiesItems}
            </ul>
        </React.Fragment>
    );
}

export default CitySelector;
