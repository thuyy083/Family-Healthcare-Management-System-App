import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const BASE_URL = 'http://10.0.2.2:7060/api/BookServices'

export const getAllBookService = async (thang = '', nam = '', trangThai ='') => {
    try {
        const token = await AsyncStorage.getItem('token')
        const url = `${BASE_URL}?thang=${thang}&nam=${nam}&trangThai=${trangThai}`
        console.log("url: ", url)
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log('respone: ', response)
        return response.data
    } catch (error) {
        console.log('Lỗi khi gọi API', error)
        throw error
    }
}

export const getBookServiceById = async(maDon) => {
    try{
        console.log('maDOn: ', maDon)
        const token = await AsyncStorage.getItem('token')
        const respone = await axios.get(`${BASE_URL}/${maDon}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return respone.data
    }catch(error){
        console.log('Lỗi khi gọi API', error)
        throw error
    }
}

export const bookService = async (id, formData) => {
  const token = await AsyncStorage.getItem('token')
  console.log("formData:", formData)

  const res = await axios.post(`${BASE_URL}/${id}/book`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  return res.data
}

export const getStaff = async () => {
    const url = `${BASE_URL}/staff`
    const response = await axios.get(url)
    return response.data
}