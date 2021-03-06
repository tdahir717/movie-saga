import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
// Provider allows us to use redux within our react app
import { Provider } from 'react-redux';
import logger from 'redux-logger';
// Import saga middleware
import createSagaMiddleware from 'redux-saga';
//import ability to use takeEvery and put with saga
import { takeEvery, put } from "redux-saga/effects";
//import axios so we can make requests from generator functions
import axios from 'axios';



function* getMovies() {
//allMovies is result from db get request, and will be sent to reducer
    const allMovies = yield axios.get('/movies');
//after (not before!) the movies are gotten, dispatch 'em to the reducer!
//.data accesses just the array, which is all we want
    yield put({type: "SET_MOVIES", payload: allMovies.data})
}

function* getDetails(action) {
    //allMovies is result from db get request, and will be sent to reducer
    const selectedMovie = yield axios.get(`/movies/${action.payload}`);
    //after (not before!) the movies are gotten, dispatch 'em to the reducer!
    //.data accesses just the array, which is all we want
    yield put({ type: "SET_DETAILS", payload: selectedMovie.data })
}

function* updateMovie(action){
    console.log('in updateMovie with', action);
    yield axios.put(`/movies/${action.payload.id}`, action.payload);
}

// Create the rootSaga generator function
function* rootSaga() {
    yield takeEvery("GET_MOVIES", getMovies);
    yield takeEvery("GET_DETAILS", getDetails);
    yield takeEvery("UPDATE_MOVIE", updateMovie);
}

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// Used to store movies returned from the server as array of objects
const movies = (state = [], action) => {
    switch (action.type) {
        case 'SET_MOVIES':
            return action.payload;
        default:
            return state;
    }
}

const movie = (state = [], action) => {
    switch (action.type) {
        case 'SET_DETAILS':
            return action.payload;
        default:
            return state;
    }
}

// Used to store the movie genres
const genres = (state = [], action) => {
    switch (action.type) {
        case 'SET_GENRES':
            return action.payload;
        default:
            return state;
    }
}

// Create one store that all components can use
const storeInstance = createStore(
    combineReducers({
        movies,
        movie,
        genres,
    }),
    // Add sagaMiddleware to our store
    applyMiddleware(sagaMiddleware, logger),
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

ReactDOM.render(<Provider store={storeInstance}><App /></Provider>, 
    document.getElementById('root'));
registerServiceWorker();
