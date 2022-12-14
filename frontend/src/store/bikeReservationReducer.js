

import { createReducer } from "@reduxjs/toolkit";
const initialState = {
    loading: false,
    users: [],
    isAuthenticated: false,
    isManager: false,
    loggedInUser: {},
    page: 1,
    isDateFilterAdded: false,
    reservations: [],
    totalBikes: 0,
    filterMode: false,
    fromDate: "0",
    toDate: "0",
    filterName: "",
    filterColor: "",
    filterLocation: "",
    filterRating: "0",
};

export const bikeReservationReducer = createReducer(initialState, {

    restaurants: (state, action) => {
        state.restaurants = action.payload
    },
    loading: (state,) => {
        state.loading = !state.loading
    },
    reviews: (state, action) => {
        state.reviews = action.payload
    },
    highlightedReviews: (state, action) => {
        state.highlightedReviews = action.payload
    },
    allUsers: (state, action) => {
        state.users = action.payload
    },
    filterBook: (state, action) => {
        state.filterBookFetch = true
        state.filterBookArgs = action.payload
        state.page = 1
    },
    isAuthenticated: (state, action) => {
        state.isAuthenticated = action.payload
    },
    isManager: (state, action) => {
        state.isManager = action.payload
    },
    isDateFilterAdded: (state, action) => {
        state.isDateFilterAdded = action.payload
    },
    loggedInUser: (state, action) => {
        state.loggedInUser = action.payload
    },
    reservations: (state, action) => {
        state.reservations = action.payload
    },
    totalBikes: (state, action) => {
        state.totalBikes = action.payload
    },
    filterMode: (state, action) => {
        state.filterMode = action.payload
    },
    fromDate: (state, action) => {
        state.fromDate = action.payload
    },
    toDate: (state, action) => {
        state.toDate = action.payload
    },
    filterName: (state, action) => {
        state.filterName = action.payload
    },
    filterLocation: (state, action) => {
        state.filterLocation = action.payload
    },
    filterColor: (state, action) => {
        state.filterColor = action.payload
    },
    filterRating: (state, action) => {
        state.filterRating = action.payload
    },
})