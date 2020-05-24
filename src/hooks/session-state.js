import {useState} from 'react';

function useSessionState(key, defaultValue) {
    const [storedValue, setStoredValue] = useState(() => {
        const item = sessionStorage.getItem(key);

        return item ? JSON.parse(item):defaultValue;
    });

    const setValue = (newValue) => {
        let actualValue = newValue;
        if (typeof newValue === 'function')
            actualValue = newValue(storedValue);

        setStoredValue(actualValue);
        sessionStorage.setItem(key, JSON.stringify(actualValue));
    };

    return [storedValue, setValue];
}

export default useSessionState;
