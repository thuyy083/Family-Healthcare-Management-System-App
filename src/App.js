import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Provider as ReduxProvider, useDispatch } from 'react-redux'
import { Provider as PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import LoginScreen from './screens/Auth/LoginScreen'
import HomeScreen from './screens/Home/HomeScreen'
import ProfileScreen from './screens/Auth/ProfileScreen'
import ContactInfo from './screens/Contact/ContactInfo'
import EditContact from './screens/Contact/EditContact'
import ChangePassword from './screens/Auth/ChangePassword'
import ResetPassword from './screens/Auth/ResetPassword'
import DoctorListScreen from './screens/Doctor/DoctorList'
import DoctorDetailScreen from './screens/Doctor/DoctorDetail'
import MedicalServiceListScreen from './screens/MedicalService/MedicalServiceList'
import MedicalServiceDetailScreen from './screens/MedicalService/MedicalServiceDetail'
import BookServiceListScreen from './screens/BookService/BookServiceList'
import BookServiceDetailScreen from './screens/BookService/BookServiceDetailScreen'
import BookServiceForm from './screens/BookService/BookServiceForm'
import BookServiceByIdScreen from './screens/BookService/BookServiceById'
import store from './store/store'
import { isLoggedIn } from './services/authService'
import { setUser } from './store/userSlice'
import { Omega } from 'lucide-react-native'

const Stack = createNativeStackNavigator()

const MainApp = () => {
  const [initialRoute, setInitialRoute] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('token')
      const userJson = await AsyncStorage.getItem('user')

      if (token && userJson) {
        dispatch(setUser(JSON.parse(userJson)))
        setInitialRoute('Home')
      } else {
        setInitialRoute('Login')
      }
    }
    init()
  }, [])

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        setInitialRoute('Login')
      } else {
        try {
          // Gọi một API để test token
          await axios.get('/User/me', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setInitialRoute('Home')
        } catch (err) {
          setInitialRoute('Login') // nếu token sai/hết hạn
        }
      }
    }

    checkToken()
  }, [])

  if (!initialRoute) return null

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name='Profile' component={ProfileScreen} />
        <Stack.Screen name='ContactInfo' component={ContactInfo} />
        <Stack.Screen name='EditContact' component={EditContact} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name='DoctorList' component={DoctorListScreen} />
        <Stack.Screen name='DoctorDetail' component={DoctorDetailScreen} />
        <Stack.Screen name='MedicalServiceList' component={MedicalServiceListScreen} />
        <Stack.Screen name='MedicalServiceDetail' component={MedicalServiceDetailScreen} />
        <Stack.Screen name='BookServiceList' component={BookServiceListScreen} />
        <Stack.Screen name='BookServiceDetail' component={BookServiceDetailScreen} />
        <Stack.Screen name='BookServiceForm' component={BookServiceForm} />
        <Stack.Screen name='BookServiceById' component={BookServiceByIdScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <SafeAreaProvider>
          <MainApp />
          <Toast />
        </SafeAreaProvider>
      </PaperProvider>
    </ReduxProvider>
  )
}