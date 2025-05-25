import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { logout } from '../services/authService'

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await logout()
    navigation.replace('Login')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chào mừng bạn đến Home</Text>
      <Button title="Đăng xuất" onPress={handleLogout} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 }
})

export default HomeScreen
