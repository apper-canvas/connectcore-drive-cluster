import { createContext, useContext, useReducer } from 'react';
import { crmInitialState } from '../constants/crmData';

const CRMContext = createContext();

const crmReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_CONTACT':
      return {
        ...state,
        contacts: [...state.contacts, { ...action.payload, id: Date.now().toString() }]
      };
    
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(contact =>
          contact.id === action.payload.id ? { ...contact, ...action.payload } : contact
        )
      };
    
    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter(contact => contact.id !== action.payload)
      };
    
    case 'ADD_DEAL':
      return {
        ...state,
        deals: [...state.deals, { ...action.payload, id: Date.now().toString() }]
      };
    
    case 'UPDATE_DEAL':
      return {
        ...state,
        deals: state.deals.map(deal =>
          deal.id === action.payload.id ? { ...deal, ...action.payload } : deal
        )
      };
    
    case 'DELETE_DEAL':
      return {
        ...state,
        deals: state.deals.filter(deal => deal.id !== action.payload)
      };
    
    case 'ADD_ACTIVITY':
      return {
        ...state,
        activities: [...state.activities, { ...action.payload, id: Date.now().toString() }]
      };
    
    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.map(activity =>
          activity.id === action.payload.id ? { ...activity, ...action.payload } : activity
        )
      };
    
    case 'DELETE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.filter(activity => activity.id !== action.payload)
      };
    
    default:
      return state;
  }
};

export const CRMProvider = ({ children }) => {
  const [state, dispatch] = useReducer(crmReducer, crmInitialState);

  return (
    <CRMContext.Provider value={{ state, dispatch }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};