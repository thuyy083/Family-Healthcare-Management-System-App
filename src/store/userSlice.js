import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload
    },
    logout: (state) => {
      state.currentUser = null
    },
    updateUser(state, action) {
      state.currentUser = {
        ...state.currentUser,
        ...action.payload
      }
    }
  }
})

export const { setUser, logout, updateUser } = userSlice.actions
export default userSlice.reducer
