import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const Layout = ({ children }) => {
  const navigation = useNavigation()
  const route = useRoute()
  const currentRoute = route.name
  return (
    <SafeAreaView style={styles.container}>
      {/* Page Content */}
      <View style={styles.content}>{children}</View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.navItem}
        >
          <Icon
            name="home"
            size={24}
            color={currentRoute === 'Home' ? '#0077aa' : '#999'}
          />
          <Text
            style={[
              styles.navLabel,
              currentRoute === 'Home' && styles.activeLabel
            ]}
          >
            Trang chủ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.navItem}
        >
          <Icon
            name="notifications"
            size={24}
            color={currentRoute === 'Notifications' ? '#0077aa' : '#999'}
          />
          <Text
            style={[
              styles.navLabel,
              currentRoute === 'Notifications' && styles.activeLabel
            ]}
          >
            Thông báo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.navItem}
        >
          <Icon
            name="person"
            size={24}
            color={currentRoute === 'Profile' ? '#0077aa' : '#999'}
          />
          <Text
            style={[
              styles.navLabel,
              currentRoute === 'Profile' && styles.activeLabel
            ]}
          >
            Cá nhân
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f9ff' },
  content: { flex: 1 },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    borderTopWidth: 1,
    borderColor: '#cceeff',
    backgroundColor: '#ffffff'
  },
  navItem: { alignItems: 'center' },
  navLabel: { fontSize: 12, marginTop: 4, color: '#0077aa' },
  activeLabel: {
  color: '#0077aa',
  fontWeight: 'bold'
}

})

export default Layout

