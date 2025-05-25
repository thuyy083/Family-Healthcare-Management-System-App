import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { login } from '../services/authService'

const LoginScreen = ({ navigation }) => {
  const [soDienThoai, setSoDienThoai] = useState('')
  const [matKhau, setMatKhau] = useState('')

  const handleLogin = async () => {
    console.log('👉 Bắt đầu đăng nhập') // kiểm tra sự kiện đã chạy

    try {
      const user = await login(soDienThoai, matKhau)
      console.log('Đăng nhập thành công', user)
      Alert.alert('Thành công', `Xin chào ${user.hoTen}`)
      navigation.replace('Home')
    } catch (error) {
      console.log('Lỗi đăng nhập', error)

      if (error.response) {
        Alert.alert('Đăng nhập thất bại', error.response.data.message || 'Lỗi xác thực')
      } else {
        Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ')
      }
    }
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={soDienThoai}
        onChangeText={setSoDienThoai}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={matKhau}
        onChangeText={setMatKhau}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#007bff', padding: 14, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' }
})

export default LoginScreen