import { useState } from 'react';

export const useForm = (initState) => {

    const [state, setState] = useState( initState );

    const onChange = ( value,field ) => {
        setState({
            ...state,
            [field]: value
        });
    }
    const onChange2 = ( value,field ) => {
        setState({
            ...state,
            [field]: value
        });
    }

    return {
        ...state,
        form: state,
        onChange,
        onChange2,
    }

}