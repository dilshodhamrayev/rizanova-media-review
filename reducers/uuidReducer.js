export const initialUuidState = "";

export const CHANGE_UUID = "CHANGE_UUID";

export const uuidReducer = (prevState = initialUuidState, action) => {
    if (action.type === CHANGE_UUID)
        return action.payload;

    return prevState;
};
