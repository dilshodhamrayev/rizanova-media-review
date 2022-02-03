export const initialThemeState = "theme-white";

export const WHITE_THEME = 'theme-white';
export const DARK_THEME = 'theme-dark';

export const themeReducer = (prevState, action) => {
    if (action.type === WHITE_THEME || action.type === DARK_THEME)
        return action.type;

    return prevState;
};
