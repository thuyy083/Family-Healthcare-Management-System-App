import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Provider } from 'react-redux'
import { useDispatch } from 'react-redux'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import ProfileScreen from './screens/ProfileScreen'
import ContactInfo from './screens/ContactInfo'
import EditContact from './screens/EditContact'
import ChangePassword from './screens/ChangePassword'
import ResetPassword from './screens/ResetPassword'
import store from './store/store'
import { isLoggedIn } from './services/authService'
import { setUser } from './store/userSlice'

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

  // useEffect(() => {
  //   const checkToken = async () => {
  //     const token = await AsyncStorage.getItem('token')
  //     if (!token) {
  //       setInitialRoute('Login')
  //     } else {
  //       try {
  //         // Gọi một API để test token (ví dụ: /User/me)
  //         await axios.get('/User/me', {
  //           headers: { Authorization: `Bearer ${token}` }
  //         })
  //         setInitialRoute('Home')
  //       } catch (err) {
  //         setInitialRoute('Login') // nếu token sai/hết hạn
  //       }
  //     }
  //   }

  //   checkToken()
  // }, [])

  if (!initialRoute) return null

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name='Profile' component={ProfileScreen} />
            <Stack.Screen name='ContactInfo' component={ContactInfo} />
            <Stack.Screen name='EditContact' component={EditContact} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />

          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <MainApp />
      </SafeAreaProvider>
    </Provider>
  )
}