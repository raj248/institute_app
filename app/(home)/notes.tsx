import { View, Text, FlatList } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { CardButton } from '~/components/CardButton'
import HeaderIcons from '~/components/HeaderIcons'
import { useColorScheme } from '~/lib/useColorScheme'
import { Button } from '~/components/Button'


const Notes = () => {
  const { course } = useLocalSearchParams()
  const router = useRouter()
  const { colors } = useColorScheme()
  const data = [
    {
      key: 'mtp',
      icon: require('~/assets/icons/mcq.png'),
      title: 'MTP Notes',
      description: 'MTP Notes',
      path: '/topiclistpage',
      params: { course: course, pageType: 'notes_mtp' },
    },
    {
      key: 'rtp',
      icon: require('~/assets/icons/mcq.png'),
      title: 'RTP Notes',
      description: 'RTP Notes',
      path: '/topiclistpage',
      params: { course: course, pageType: 'notes_rtp' },
    },
    {
      key: 'other',
      icon: require('~/assets/icons/mcq.png'),
      title: 'Other Notes',
      description: 'Other Notes',
      path: '/topiclistpage',
      params: { course: course, pageType: 'notes_other' },
    },
  ]


  // onPress={() =>
  //               // @ts-expect-error: Dynamic router.push path causes type mismatch, safe in this context
  //               router.push(item.params ? { pathname: item.path, params: item.params } : item.path)
  //             }
  return (
    <View className='flex-1 items-center justify-center gap-4 px-4'>
      <Stack.Screen
        options={{
          title: 'CA Final',
          animation: 'slide_from_right',
          headerRight: () => <HeaderIcons />,
        }}
      />
      {data.map((item) => {
        return (
          <Button
            title={item.title}
            className="w-[80%]"
            onPress={() =>
              // @ts-expect-error: Dynamic router.push path causes type mismatch, safe in this context
              router.push(item.params ? { pathname: item.path, params: item.params } : item.path)
            }
          />
        )
      })}
    </View>
  )
}

export default Notes