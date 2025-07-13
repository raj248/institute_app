import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Text } from '~/components/nativewindui/Text'
import { getFcmToken } from '~/firebase/notificationService'
import { useColorScheme } from '~/lib/useColorScheme'
const Home = () => {
  const { colors } = useColorScheme()
  const [token, setToken] = useState('Not Fetched')
  useEffect(() => {
    getFcmToken().then(res => setToken(res || 'No Token'))
  }, [])
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text className='items-center bg-background p-5'>Home</Text>
      <Text>{token}</Text>
    </View>
  )
}

export default Home
