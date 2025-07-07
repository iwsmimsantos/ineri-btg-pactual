import React, { useState, useContext } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useNavigationState } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useAuth } from "@clerk/clerk-expo"
import { MainStackParamList } from "../App"
import { Colors } from '../theme/colors'
import { Fonts } from '../theme/fonts'
import { useResponsive } from '../hooks/useResponsive'
import { useUser } from '../hooks/useUser'

const { width, height } = Dimensions.get("window")
const HEADER_HEIGHT = 60

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  userRole?: string
}

type NavigationProp = StackNavigationProp<MainStackParamList>

const Sidebar = ({ isOpen, onClose, userRole = "Administrador" }: SidebarProps) => {
  const slideAnim = React.useRef(new Animated.Value(width)).current
  const navigation = useNavigation<NavigationProp>()
  const { responsiveSize, isSmallScreen } = useResponsive()
  const { fullName, initials, isAuthenticated } = useUser()
  const { signOut } = useAuth()

  const currentRoute = useNavigationState(state => {
    const route = state?.routes[state?.index]
    return route?.name || 'Home'
  })

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : width,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [isOpen, slideAnim])

  const userName = isAuthenticated && fullName ? fullName : "Usuário"
  const userInitial = initials || userName.charAt(0).toUpperCase()

  const menuItems = [
    { id: "Home", label: "Home", icon: "home-outline" },
    { id: "Clients", label: "Clientes", icon: "people-outline" },
    { id: "Settings", label: "Ajustes", icon: "settings-outline" },
    { id: "Logout", label: "Sair", icon: "log-out-outline" },
  ]

  const handleMenuPress = (screenName: keyof MainStackParamList | 'Logout') => {
    if (screenName === 'Logout') {
      handleExit();
    } else if (screenName === 'Home' || screenName === 'Clients' || screenName === 'Settings') {
      navigation.navigate(screenName)
    }
    onClose()
  }

  const handleExit = async () => {
    try {
      await signOut()
      onClose()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.')
    }
  }

  // Responsive sidebar width
  const sidebarWidth = isSmallScreen ? width * 0.85 : Math.min(width * 0.7, 280)

  // Calculate proper positioning for iPhone
  const sidebarTop =  0
  const sidebarHeight = height

  return (
    <>
      <Animated.View style={[
        styles.sidebar,
        {
          transform: [{ translateX: slideAnim }],
          width: sidebarWidth,
          top: sidebarTop,
          height: sidebarHeight,
        }
      ]}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={[styles.avatarContainer, {
            width: responsiveSize(35, 40, 45),
            height: responsiveSize(35, 40, 45),
            borderRadius: responsiveSize(17.5, 20, 22.5),
          }]}>
            <Text style={[styles.avatarText, {
              fontSize: responsiveSize(14, 16, 18)
            }]}>{userInitial}</Text>
          </View>
          <Text style={[styles.userName, {
            fontSize: responsiveSize(14, 16, 18)
          }]}>{userName}</Text>
          <Text style={[styles.userRole, {
            fontSize: responsiveSize(12, 14, 16)
          }]}>{userRole}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, currentRoute === item.id && styles.activeMenuItem]}
              onPress={() => handleMenuPress(item.id as keyof MainStackParamList | 'Logout')}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={item.icon as any}
                  size={responsiveSize(20, 22, 24)}
                  color={currentRoute === item.id ? Colors.azul : Colors.cinzaTexto}
                />
              </View>
              <Text style={[
                styles.menuItemText,
                currentRoute === item.id && styles.activeMenuItemText,
                { fontSize: responsiveSize(13, 15, 17) }
              ]}>
                {item.label}
              </Text>
              {currentRoute === item.id && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {isOpen && <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />}
    </>
  )
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    right: 0,
    backgroundColor: Colors.branco,
    zIndex: 2,
    shadowColor: Colors.preto,
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  profileSection: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: Colors.cinzaContraste,
  },
  avatarContainer: {
    backgroundColor: Colors.azul,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarText: {
    color: Colors.branco,
    fontFamily: Fonts.bold,
  },
  userName: {
    fontFamily: Fonts.semiBold,
    color: Colors.azul,
    marginBottom: 2,
  },
  userRole: {
    color: Colors.cinzaTexto,
    fontFamily: Fonts.regular,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
    position: "relative",
  },
  activeMenuItem: {
    backgroundColor: Colors.cinzaFundo,
    borderLeftColor: Colors.azul,
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    fontFamily: Fonts.medium,
    color: Colors.cinzaTexto,
  },
  activeMenuItemText: {
    color: Colors.azul,
    fontFamily: Fonts.semiBold,
  },
  activeIndicator: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.azul,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
})

export default Sidebar
