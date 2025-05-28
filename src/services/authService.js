import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

//const API_URL = 'http://localhost:7060/api/AccountApi/Login'
const API_URL = 'http://10.0.2.2:7060/api/AccountApi/Login'

export const login = async (soDienThoai, matKhau) => {
  console.log('Gọi API:', API_URL)

  try {
    const response = await axios.post(API_URL, { soDienThoai, matKhau })
    await AsyncStorage.setItem('token', response.data.token)
    //console.log('Dữ liệu trả về:', response.data)
    return response.data
  } catch (error) {
    console.log('Lỗi khi gọi API', error)
    throw error
  }
}

export const logout = async () => {
  await AsyncStorage.removeItem('token')
  await AsyncStorage.removeItem('expiresAt')
  await AsyncStorage.removeItem('user')
}

export const isLoggedIn = async () => {
  const token = await AsyncStorage.getItem('token')
  if (token) {
    return true
  }
  return false
}
