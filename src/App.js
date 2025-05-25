import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import { isLoggedIn } from './services/authService'

const Stack = createNativeStackNavigator()

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null)

  useEffect(() => {
    const init = async () => {
      const logged = await isLoggedIn()
      setInitialRoute(logged ? 'Home' : 'Login')
    }
    init()
  }, [])

  if (!initialRoute) return null // Loading UI nếu muốn

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
