import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native'
import Toast from 'react-native-toast-message'
import { login } from '../services/authService'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/userSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import Images from '../assets/images/index'


const LoginScreen = ({ navigation }) => {
  const [soDienThoai, setSoDienThoai] = useState('')
  const [matKhau, setMatKhau] = useState('')
  const dispatch = useDispatch()

  const handleLogin = async () => {
    console.log('Bắt đầu đăng nhập') // kiểm tra sự kiện đã chạy

    try {
      const user = await login(soDienThoai, matKhau)
      if (user.token) {
        await AsyncStorage.setItem('token', user.token)
      }
      await AsyncStorage.setItem('user', JSON.stringify(user))
      dispatch(setUser(user))
      console.log('Đăng nhập thành công', user)
      Toast.show({
        type: 'success',
        text1: 'Đăng nhập thành công',
        text2: `Xin chào ${user.hoTen}`,
        position: 'bottom'
      })
      console.log('Kết quả từ API:', user)
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
      <Image source={Images.logo} style={styles.logo} />
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
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f0f9ff'
  },
  logo: {
    width: 140,
    height: 70,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 24
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0077aa',
    marginBottom: 24
  },
  input: {
    borderWidth: 1,
    borderColor: '#cceeff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  forgotPassword: {
    color: '#0077aa',
    textAlign: 'right',
    marginBottom: 20,
    textDecorationLine: 'underline'
  },
  button: {
    backgroundColor: '#0077aa',
    padding: 14,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

export default LoginScreen