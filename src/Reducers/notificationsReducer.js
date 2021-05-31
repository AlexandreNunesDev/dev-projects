import produce from "immer"

const initialState = {
  notifications: [],

}

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return initialState;
    }
    const actualState = JSON.parse(serializedState);
    return actualState.notification;
  } catch (e) {
    return null;
  }
};


const notificationsReducer = produce(
  (draft, action) => {
    switch (action.type) {
      case "LOAD_NOTIFICATIONS":
        const maxNotificationIndex = draft.notifications.length
        draft.notifications.splice(0,maxNotificationIndex,...action.payload)
        break
      case "RESOLVE_NOTIFICATION":
        const indexNotif = draft.notifications.findIndex(notification => notification.id === action.payload)
        if (indexNotif !== -1) draft.notifications.splice(indexNotif, 1)
        break
  
       
    }
    return
  },loadState()
  
)
export default notificationsReducer;