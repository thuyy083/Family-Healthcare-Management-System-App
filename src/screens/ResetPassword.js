import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ToastAndroid
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { resetPasswordWithOtp } from '../services/authService'
import { Appbar } from 'react-native-paper'

const ResetPassword = () => {
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const navigation = useNavigation()
  const route = useRoute()
  const { soDienThoai } = route.params

  const handleReset = async () => {
    try {
        if (!otp || !newPassword) {
  ToastAndroid.show('Vui lòng nhập đầy đủ mã OTP và mật khẩu mới', ToastAndroid.SHORT)
  return
}

      const result = await resetPasswordWithOtp({ soDienThoai, otp, newPassword })
      ToastAndroid.show(result.message || 'Đổi mật khẩu thành công', ToastAndroid.LONG)

      // ✅ Chuyển về trang đăng nhập hoặc trang khác
      navigation.navigate('Login')
    } catch (error) {
      const message =
        error.response?.data?.message || 'Đổi mật khẩu thất bại!'
        console.log('DEBUG dữ liệu gửi:', { soDienThoai, otp, newPassword })
console.log('Lỗi chi tiết:', error.response?.status, error.response?.data)

      ToastAndroid.show(message, ToastAndroid.LONG)
    }
  }

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#0077aa' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="Nhập OTP và mật khẩu mới" titleStyle={{ color: '#fff' }} />
      </Appbar.Header>

      <View style={styles.container}>
        <Text style={styles.label}>Mã OTP:</Text>
        <TextInput
          style={styles.input}
          placeholder="Mã OTP"
          keyboardType="numeric"
          value={otp}
          onChangeText={setOtp}
        />

        <Text style={styles.label}>Mật khẩu mới:</Text>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <Button title="Đặt lại mật khẩu" onPress={handleReset} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f9ff',
    flex: 1
  },
  label: {
    marginBottom: 8,
    fontSize: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff'
  }
})

export default ResetPassword
