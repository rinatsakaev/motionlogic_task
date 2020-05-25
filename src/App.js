import React from 'react';
import CitySelector from './components/city-selector/city-selector';

const data = [
    {
        id: 0,
        name: 'Екатеринбург'
    },
    {
        id: 1,
        name: 'Москва'
    },
    {
        id: 2,
        name: 'Санкт-Петербург'
    },
    {
        id: 3,
        name: 'Новосибирск'
    },
    {
        id: 4,
        name: 'Александровск-Сахалинский'
    },
    {
        id: 5,
        name: 'Абаза'
    },
    {
        id: 6,
        name: 'Абакан'
    },
    {
        id: 7,
        name: 'Абакан-1'
    },
    {
        id: 8,
        name: 'Абдулино'
    },
    {
        id: 9,
        name: 'Абинск'
    },
    {
        id: 10,
        name: 'Агидель'
    },
    {
        id: 11,
        name: 'Агрыз'
    }
];

export const SelectorContext = React.createContext(data);

function App() {
    return (
        <div className="App">
            <SelectorContext.Provider value={data}>
                <CitySelector/>
            </SelectorContext.Provider>
        </div>
    );
}

export default App;
