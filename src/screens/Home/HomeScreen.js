import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useSelector } from 'react-redux'
import Images from '../../assets/images/index'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList } from 'react-native'
import Layout from '../../components/Layout'

export default function HomeScreen() {
  const navigation = useNavigation()
  const user = useSelector(state => state.user.currentUser)
  console.log(user)
  const menuItems = [
    { label: 'Đặt dịch vụ y tế', screen: 'BookServiceForm', icon: 'medical-services' },
    { label: 'Dịch vụ đã đặt', screen: 'BookServiceList', icon: 'event-note' },
    { label: 'Thông tin bác sĩ', screen: 'DoctorList', icon: 'person-search' },
    { label: 'Thông tin nhân viên y tế', screen: 'StaffInfo', icon: 'groups' },
    { label: 'Dịch vụ y tế', screen: 'MedicalServiceList', icon: 'local-hospital' },
    { label: 'Trợ giúp', screen: 'Help', icon: 'help-outline' }
  ]


  return (
    <Layout>
      <SafeAreaView>
        {/* Header */}
        <View style={styles.header}>
          <Image source={Images.logo} style={styles.logo} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.hoTen || 'Khách'}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image
                source={{ uri: `http://10.0.2.2:7060/images/khachhang/${user?.hinhAnh}` }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Grid menu */}
        <FlatList
          data={menuItems}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.menuContainer}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Icon name={item.icon} size={36} color="#0077aa" style={styles.menuIcon} />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb'
  },
  logo: {
    width: 140,
    height: 70,
    resizeMode: 'contain',
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userName: { marginRight: 8, fontWeight: '500' },
  menuItem: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: '#e6f7ff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    elevation: 3,
    shadowColor: '#0099cc'
  },
  menuIcon: {
    marginBottom: 8
  },
  menuLabel: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500'
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90
  },
  menuIconPlaceholder: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    borderTopWidth: 1,
    borderColor: '#cceeff',
    backgroundColor: '#ffffff'
  },
  navItem: {
    alignItems: 'center'
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#0077aa'
  },
  avatar: {
  width: 36,
  height: 36,
  borderRadius: 18,
  marginLeft: 8
  }

})
