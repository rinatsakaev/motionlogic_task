import React, {useContext, useEffect, useRef, useState} from 'react';
import {SelectorContext} from '../App';
import useSessionState from '../hooks/session-state';

function CitySelector() {
    const cities = useContext(SelectorContext);
    const [selectedCities, setSelectedCities] = useSessionState('list', []);
    const [inputValue, setInputValue] = useState('');
    const [activeCity, setActiveCity] = useState(undefined);
    const [predictedCities, setPredictedCities] = useState([]);

    const addCityToList = () => {
        if (!activeCity || selectedCities.findIndex(x => x.id === activeCity.id) !== -1)
            return;

        setSelectedCities((prevState) => [...prevState, activeCity]);
        setPredictedCities([]);
        setInputValue('');
    };

    const selectCity = (id, name) => {
        setActiveCity({id, name});
        setInputValue(name);
    };

    useEffect(() => {
        if (inputValue.length < 3) {
            if (predictedCities.length)
                setPredictedCities([]);
            if (activeCity)
                setActiveCity(undefined);
        } else
            setPredictedCities(cities.filter(x => x.name.startsWith(inputValue)));
    }, [inputValue]);

    const handleKeyDown = (e) => {
        if (predictedCities.length === 0)
            return;

        if (!activeCity) {
            setActiveCity(predictedCities[0]);
            return;
        }

        const activeCityIndex = predictedCities.findIndex(x => x.id === activeCity.id);
        switch (e.key) {
            case 'Enter':
                addCityToList();
                break;
            case 'ArrowUp':
                if (activeCityIndex > 0)
                    setActiveCity(predictedCities[activeCityIndex - 1]);
                break;
            case 'ArrowDown':
                if (activeCityIndex < predictedCities.length - 1)
                    setActiveCity(predictedCities[activeCityIndex + 1]);
                break;
            default:
                return;
        }
    };

    const removeFromList = (id) => {
        setSelectedCities((prevState) => {
            const index = prevState.findIndex(x => x.id === id);
            return [...prevState.slice(0, index), ...prevState.slice(index + 1)]
        })
    };

    const selectedCitiesItems = selectedCities.map(x =>
        <li key={x.id}
            className={
                `selected-cities__item ${activeCity && x.id === activeCity.id ? 'selected-cities__item_highlited'
                    : null}`
            }>
            <img src={'close.svg'} className='selected-cities__remove-icon' alt='Удалить'
                 onClick={() => removeFromList(x.id)} />
            {x.name}
        </li>);


    const predictedCitiesItems = predictedCities.map(x =>
        <li key={x.id}
            className={
                `city-selector__item ${activeCity && activeCity.id === x.id ? 'city-selector__item_hovered'
                    : null}`
            }
            onClick={() => selectCity(x.id, x.name)}>
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
                           onInput={(e) => setInputValue(e.target.value)}
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
