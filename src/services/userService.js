import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = 'http://10.0.2.2:7060/api/User/me'
const API_BASE = 'http://10.0.2.2:7060/api/User'

export const getUserProfile = async () => {
  console.log('Gọi API:', API_URL)
  try{
    const token = await AsyncStorage.getItem('token')
    console.log(token)
    const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
  } catch(error){
    console.log('Lỗi khi gọi API', error)
    throw error
  }
}

export const updateUserProfile = async (formData) => {
  const token = await AsyncStorage.getItem('token')
  console.log("formData: ", formData)
  const res = await axios.put(`${API_BASE}/updateProfile`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  return res.data
}