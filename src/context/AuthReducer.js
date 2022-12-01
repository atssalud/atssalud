

export const AuthReducer = (state,action)=>{
    switch (action.type) {
        case 'addError':
            return {
                ...state,
                errorMessage:action.payload,
                user:{},
                status:'not-authenticated',
                token:null
            };

        case 'removeError':
            return {
                ...state,
                errorMessage:'',
            };

        case 'signUp':
            return {
                ...state,
                errorMessage:'',
                // user:action.payload.user,
                user:{},
                status:'authenticated',
                token:action.payload.token,
            };
        case 'logout':
        case 'notAuthenticated':
            return {
                ...state,
                user:null,
                status:'not-authenticated',
                token:null,
            };
        case 'isNotConnected':
            return {
                ...state,
                status:'isNotConnected',
            };
    
        default:
            return state;
    }
}