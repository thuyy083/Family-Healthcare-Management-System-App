import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const BASE_URL = 'http://10.0.2.2:7060/api/Medical'

export const getAllMedicalService = async (search = '') => {
    try {
        const url = `${BASE_URL}?search=${encodeURIComponent(search)}`
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        console.log('Lỗi khi gọi API', error)
        throw error
    }
}

export const getMedicalServiceById = async(maDV) => {
    try{
        const respone = await axios.get(`${BASE_URL}/${maDV}`)
        return respone.data
    }catch(error){
        console.log('Lỗi khi gọi API', error)
        throw error
    }
}