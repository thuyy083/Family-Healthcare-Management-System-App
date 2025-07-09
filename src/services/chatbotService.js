// services/chatBotService.js
import axios from 'axios'

const BASE_URL = 'http://10.0.2.2:7060/api/ChatBot'

export const askChatBot = async (question) => {
  try {
    console.log('Qus: ', question)
    const { data } = await axios.post(`${BASE_URL}/ask`, { question })
    return data.response
  } catch (err) {
    console.error('askChatBot - error:', err?.response?.data ?? err.message)
    throw err
  }
}
