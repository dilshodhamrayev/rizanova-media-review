export const initialRouteStatusdState = false;

export const CHANGE_ROUTE_STATUS = "CHANGE_ROUTE_STATUS";

export const routeStatusReducer = (prevState = initialRouteStatusdState, action) => {
    if (action.type === CHANGE_ROUTE_STATUS)
        return action.payload;

    return prevState;
};