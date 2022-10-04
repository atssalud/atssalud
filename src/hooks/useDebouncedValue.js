import {useEffect,useState} from 'react';

export const useDebouncedValue = (input) => {

    const [debouncedValue,setDebouncedValue] = useState(input);

    useEffect(() => {

        const timeout = setTimeout(() => {
            setDebouncedValue(input);
        },10);

      return () => {
        clearTimeout(timeout);
      };
      // setDebouncedValue(input)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input]);

    return debouncedValue;


};
