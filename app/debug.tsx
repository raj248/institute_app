import { View, Text } from 'react-native'
import React from 'react'
import { Drawer as PaperDrawer, TextInput } from 'react-native-paper'
import { Drawer } from 'react-native-drawer-layout'
import { Button } from '~/components/Button'
import { getMCQForTest } from '~/lib/api'

const debug = () => {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);



  return (
    <View>
      <Button title="Fetch Test" onPress={() => getMCQForTest('cmd9uw9qr000b2q2rumsticfv').then(console.log).catch(console.error)} />
    </View>
  )
}

export default debug