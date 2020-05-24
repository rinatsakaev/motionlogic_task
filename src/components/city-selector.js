import React, {useContext, useEffect, useRef, useState} from 'react';
import {SelectorContext} from '../App';
import useSessionState from '../hooks/session-state';

function CitySelector() {
    const cities = useContext(SelectorContext);
    const [selectedCitiesList, changeSelectedCitiesList] = useSessionState('list', []);
    const [inputData, setInputData] = useState('');
    const [activeCity, setActiveCity] = useState(undefined);
    const [predictedCities, setPredictedCities] = useState([]);

    const addCityToList = () => {
        if (!activeCity || selectedCitiesList.findIndex(x => x.id === activeCity.id) !== -1)
            return;

        changeSelectedCitiesList((prevState) => [...prevState, activeCity]);
        setPredictedCities([]);
        setInputData('');
    };

    const selectCity = (id, name) => {
        setActiveCity({id, name});
        setInputData(name);
    };

    useEffect(() => {
        if (inputData.length < 3) {
            if (predictedCities.length)
                setPredictedCities([]);
            if (activeCity)
                setActiveCity(undefined);
            return;
        }

        setPredictedCities(cities.filter(x => x.name.startsWith(inputData)));
    }, [inputData]);

    const handleKeyDown = (e) => {
        if (predictedCities.length === 0 ||
            (e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && e.key !== 'Enter'))
            return;

        if (!activeCity) {
            setActiveCity(predictedCities[0]);
            return;
        }

        if (e.key === 'Enter')
            addCityToList();

        const selectedCityIndex = predictedCities.findIndex(x => x.id === activeCity.id);
        if (e.key === 'ArrowUp' && selectedCityIndex > 0)
            setActiveCity(predictedCities[selectedCityIndex - 1]);

        if (e.key === 'ArrowDown' && selectedCityIndex < predictedCities.length - 1)
            setActiveCity(predictedCities[selectedCityIndex + 1]);
    };

    const selectedCities = selectedCitiesList.map(x =>
        <li key={x.id}
            className={
                `selected-cities__item ${activeCity && x.id === activeCity.id ? 'selected-cities__item_highlited'
                    : null}`
            }
        >{x.name}</li>);

    const citiesItems = predictedCities.map(x =>
        <li key={x.id}
            className={
                `city-selector__item ${activeCity && activeCity.id === x.id ? 'city-selector__item_hovered'
                    : null}`
            }
            onClick={() => selectCity(x.id, x.name)}>{x.name}</li>
    );

    return (
        <React.Fragment>
            <div className="city-selector">
                <div className="city-selector__form">
                    <input className="city-selector__input"
                           placeholder="Select city"
                           value={inputData}
                           onInput={(e) => setInputData(e.target.value)}
                           onKeyDown={(e) => handleKeyDown(e)}
                    />
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
