import React, {useContext, useEffect, useRef, useState} from 'react';
import {SelectorContext} from '../App';
import useSessionState from '../hooks/session-state';

function CitySelector() {
    const cities = useContext(SelectorContext);
    const [selectedCitiesList, changeSelectedCitiesList] = useSessionState('list', []);

    const [activeCity, _setActiveCity] = useState(undefined);
    const activeCityRef = useRef(activeCity);
    const setActiveCity = (x) => {
        activeCityRef.current = x;
        _setActiveCity(x);
    };

    const [predictedCities, _setPredictedCities] = useState([]);
    const predictedCitiesRef = useRef(predictedCities);
    const setPredictedCities = (x) => {
        predictedCitiesRef.current = x;
        _setPredictedCities(x);
    };

    const inputRef = useRef(null);

    const addCityToList = () => {
        if (!activeCity || selectedCitiesList.findIndex(x => x.id === activeCity.id) !== -1)
            return;
        changeSelectedCitiesList((prevState) => [...prevState, activeCity]);
        setPredictedCities([]);
        inputRef.current.value = '';
    };

    const selectCity = (id, name) => {
        setActiveCity({id, name});
    };

    const handleInput = (e) => {
        if (inputRef.current.value.length < 3) {
            if (predictedCitiesRef.current.length)
                setPredictedCities([]);
            return;
        }

        if (inputRef.current.value.length > 3 && e.inputType === 'insertText') {
            setPredictedCities(predictedCitiesRef.current.filter(x => x.name.startsWith(inputRef.current.value)));
            return;
        }

        setPredictedCities(cities.filter(x => x.name.startsWith(inputRef.current.value)));
    };

    const handleKeyPress = (e) => {
        if (predictedCitiesRef.current.length === 0 || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown'))
            return;

        if (!activeCityRef.current) {
            setActiveCity(predictedCitiesRef.current[0]);
            return;
        }

        const selectedCityIndex = predictedCitiesRef.current.findIndex(x => x.id === activeCityRef.current.id);
        if (e.key === 'ArrowUp' && selectedCityIndex > 0)
            setActiveCity(predictedCitiesRef.current[selectedCityIndex - 1]);

        if (e.key === 'ArrowDown' && selectedCityIndex < predictedCitiesRef.current.length - 1)
            setActiveCity(predictedCitiesRef.current[selectedCityIndex + 1]);
    };

    useEffect(() => {
        inputRef.current.addEventListener('input', (e) => handleInput(e));
        inputRef.current.addEventListener('keydown', (e) => handleKeyPress(e));
    }, []);


    useEffect(() => {
        if (activeCity)
            inputRef.current.value = activeCity.name;
    }, [activeCity]);

    const selectedCities = selectedCitiesList.map(x =>
        <li key={x.id} className="selected-cities__item">{x.name}</li>);

    const citiesItems = predictedCities.map(x =>
        <li key={x.id} className={`city-selector__item ${activeCity && activeCity.id === x.id ? 'hover' : null}`}
            onClick={() => selectCity(x.id, x.name)}>{x.name}</li>
    );

    return (
        <React.Fragment>
            <div className="city-selector">
                <div className="city-selector__form">
                    <input className="city-selector__input" placeholder="Select city" ref={inputRef}/>
                    <button className="city-selector__button" onClick={() => addCityToList()}>Добавить</button>
                </div>
                {
                    citiesItems.length ?
                        <ul className="city-selector__list">
                            {citiesItems}
                        </ul>
                        : null
                }
            </div>
            <ul className="selected-cities">
                {selectedCities}
            </ul>
        </React.Fragment>
    );
}

export default CitySelector;
