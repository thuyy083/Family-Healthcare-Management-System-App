import React, { useEffect, useState, useCallback } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Avatar, Card, Text, ActivityIndicator, Appbar, Button } from 'react-native-paper'
import { getUserProfile } from '../../services/userService'
import { useNavigation,  useFocusEffect } from '@react-navigation/native'

const ContactInfo = () => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation()
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
            try {
                setLoading(true)
                const data = await getUserProfile()
                setProfile(data)
            } catch (err) {
                console.error('Error fetching user profile:', err)
            } finally {
                setLoading(false)
            }
            }
            fetchData()
        }, [])
    )
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile()
                setProfile(data)
            } catch (error) {
                console.log('Lỗi khi lấy thông tin người dùng:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    if (loading) {
        return <ActivityIndicator animating={true} size="large" style={{ marginTop: 40 }} />
    }

    if (!profile) {
        return <Text>Không thể tải thông tin liên lạc</Text>
    }

    const avatarUri = `http://10.0.2.2:7060/images/khachhang/${profile.hinhAnh}`

    console.log("avatar: " ,avatarUri)
    return (
        <>
            {/* Header giống hình */}
            <Appbar.Header style={{ backgroundColor: '#0077aa' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
                <Appbar.Content title="Xem thông tin cá nhân" titleStyle={{ color: '#fff' }} />
            </Appbar.Header>
            <ScrollView contentContainerStyle={styles.container}>
                <Avatar.Image source={{ uri: avatarUri }} size={100} style={{ marginBottom: 16 }} />

                <Card style={styles.card}>
                    <Card.Title title="Thông tin liên lạc" />
                    <Card.Content>
                        <Text style={styles.label}>Họ tên:</Text>
                        <Text>{profile.hoTen}</Text>

                        <Text style={styles.label}>Số điện thoại:</Text>
                        <Text>{profile.soDienThoai}</Text>

                        <Text style={styles.label}>Email:</Text>
                        <Text>{profile.diaChiEmail}</Text>

                        <Text style={styles.label}>CCCD:</Text>
                        <Text>{profile.soCccd}</Text>

                        <Text style={styles.label}>Giới tính:</Text>
                        <Text>{profile.gioiTinh === 0 ? 'Nữ' : 'Nam'}</Text>

                        <Text style={styles.label}>Ngày sinh:</Text>
                        <Text>{formatDate(profile.ngaySinh)}</Text>


                        <Text style={styles.label}>Địa chỉ:</Text>
                        <Text>{profile.diaChi}</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Title title="Người liên hệ khẩn cấp" />
                    <Card.Content>
                        <Text style={styles.label}>Tên:</Text>
                        <Text>{profile.tenNguoiLienHeKhanCap}</Text>

                        <Text style={styles.label}>SĐT:</Text>
                        <Text>{profile.sdtNguoiLienHeKhanCap}</Text>
                    </Card.Content>
                </Card>
                <Button
                    mode="contained"
                    icon="account-edit"
                    onPress={() => navigation.navigate('EditContact')}
                    style={styles.editButton}
                    buttonColor="#0077aa"
                    textColor="#fff"
                >
                    Chỉnh sửa thông tin
                </Button>

            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f0f9ff',
    },
    card: {
        width: '100%',
        marginBottom: 20
    },
    label: {
        fontWeight: 'bold',
        marginTop: 8
    },
    editButton: {
        marginTop: 10,
        width: '100%',
        borderRadius: 8
    }

})

export default ContactInfo
