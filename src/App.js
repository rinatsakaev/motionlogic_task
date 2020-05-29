import React from 'react';
import CitySelector from './components/city-selector/city-selector';
import data from './data.json';

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
