import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { getUserProfile } from '../services/userService'
import { SafeAreaView } from 'react-native-safe-area-context'
import Layout from '../components/Layout'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Images from '../assets/images/index'
import { useDispatch } from 'react-redux'
import { logout } from '../store/userSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { logout as logoutService } from '../services/authService'

const ProfileScreen = () => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()
    const navigation = useNavigation()

    useEffect(() => {
        const fetchData = async () => {
            try {
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

    const handleLogout = () => {
        Alert.alert(
            'Xác nhận đăng xuất',
            'Bạn có chắc chắn muốn đăng xuất không?',
            [
                { text: 'Huỷ', style: 'cancel' },
                {
                    text: 'Đăng xuất',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logoutService()
                            dispatch(logout())
                            navigation.replace('Login')
                        } catch (error) {
                            console.log('Lỗi khi đăng xuất:', error)
                        }
                    }
                }
            ]
        )
    }


    if (loading) {
        return <ActivityIndicator size="large" color="#0077aa" style={{ flex: 1 }} />
    }

    if (!profile) {
        return <Text>Không thể tải thông tin người dùng</Text>
    }
    const options = [
        {
            label: 'Hồ sơ y tế',
            icon: 'menu-book',
            screen: 'PersonalInfo'
        },
        {
            label: 'Thông tin cá nhân',
            icon: 'contact-phone',
            screen: 'ContactInfo'
        },
        {
            label: 'Đổi mật khẩu',
            icon: 'lock',
            screen: 'ChangePassword'
        },
        {
            label: 'Thông tin gia đình',
            icon: 'groups',
            screen: 'FamilyInfo'
        }
    ]
    const avatarUri = `http://192.168.1.3:7060/images/khachhang/${profile.hinhAnh}`

    return (
        <Layout>
            <SafeAreaView>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Thông tin khách hàng</Text>
                    </View>

                    <View style={styles.profileBox}>
                        <Image source={{ uri: avatarUri }} style={styles.avatar} />
                        <Text style={styles.name}>{profile.hoTen}</Text>
                        <Text style={styles.phone}>{profile.soDienThoai}</Text>
                    </View>

                    <View style={styles.optionsBox}>
                        {options.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.optionItem}
                                onPress={() => navigation.navigate(item.screen)}
                            >
                                <View style={styles.optionLeft}>
                                    <Icon name={item.icon} size={24} color="#0077aa" />
                                    <Text style={styles.optionLabel}>{item.label}</Text>
                                </View>
                                <Icon name="chevron-right" size={24} color="#999" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Đăng xuất</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </Layout>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0f9ff',
        padding: 20,
        paddingBottom: 40
    },
    header: {
        marginBottom: 16
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0077aa'
    },
    profileBox: {
        alignItems: 'center',
        marginBottom: 20
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12
    },
    name: {
        fontSize: 18,
        fontWeight: '600'
    },
    phone: {
        fontSize: 14,
        color: '#666'
    },
    optionsBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        marginBottom: 20
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    optionLabel: {
        marginLeft: 10,
        fontSize: 16
    },
    logoutButton: {
        backgroundColor: '#ff4d4f',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center'
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
})


export default ProfileScreen
