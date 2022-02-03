export const initialAuthState = {
    isAuth: false,
    user: null,
    isLoading: true,
};

export const authReducer = (prevState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                isAuth: action.payload !== null,
                user: action.payload,
                isLoading: false,
            };

        case 'LOGOUT':
            return {
                ...initialAuthState,
                isLoading: false
            };

        default:
            return prevState;
    }
};
