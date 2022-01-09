const authReducer = (state = { authData: null }, action) => {
    switch (action.type) {
        case 'AUTH':
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));

            return { ...state, authData: action.data, loading: false, errors: null };
        case 'LOGOUT':
            localStorage.clear();
            return { ...state, authData: null, loading: false, errors: null };
        case 'SETOTP':
            return { ...state, OTP: action?.data };
        case 'SETOTPLOGIN':
            return { ...state, OTPLOGIN: action?.data };
        case 'GETOTPSETUSER':
            return { ...state, UserDetails: action?.data };
        default:
            return state;
    }
};

export default authReducer;
