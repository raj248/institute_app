import { View, Text } from 'react-native'
import React from 'react'
import { Drawer as PaperDrawer, TextInput } from 'react-native-paper'
import { Drawer } from 'react-native-drawer-layout'
import { Button } from '~/components/Button'

const debug = () => {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);
  console.log('rightDrawerOpen', rightDrawerOpen);

  return (

    <Drawer
      open={rightDrawerOpen}
      onOpen={() => setRightDrawerOpen(true)}
      onClose={() => setRightDrawerOpen(false)}
      drawerPosition="right"
      renderDrawerContent={() => {
        return (<>
          <PaperDrawer.Item
            // style={{ backgroundColor: '#6495ed' }}
            icon="star"
            label="First Item"
            onPress={() => {
              alert('First Item Pressed');
            }}
          />
        </>)
      }}
    >
      <Button onPress={() => setRightDrawerOpen(true)} icon='menu' />
    </Drawer>

  )
}

export default debug