// import { configureStore } from '@reduxjs/toolkit';
// import thunk from 'redux-thunk'; //thunk → Middleware jo tumhe async code likhne deta hai (e.g., API calls) Redux actions ke andar.
// import rootReducer from './reducers'; //rootReducer → Tumhare saare reducers ko combine karke ek object banata hai (usually combineReducers se banaya gaya).

// const store = configureStore({
//   //reducer Redux ko batata hai kaunsa reducer function state manage karega.

//   //Tumne rootReducer diya hai jo sab individual reducers ko combine karta hai.
//   reducer: rootReducer,
//   preloadedState: {}, // Agar tum Redux store banate waqt kuch predefined data dalna chahte ho (e.g., localStorage se saved data), to yaha pass karte ho.
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
//   devTools: true, // already default true hai
// });

// export default store;
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
  devTools: true
});

export default store;

