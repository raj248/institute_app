import React from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import { CardButton } from '~/components/CardButton';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import HeaderIcons from '~/components/HeaderIcons';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const data = [
  {
    key: 'mcq',
    icon: require('~/assets/icons/mcq.png'),
    title: 'MCQ Test',
    description: 'Practice Multiple Choice Questions',
    path: '/topiclistpage',
    params: { course: 'CAInter' },
  },
  {
    key: 'notes',
    icon: require('~/assets/icons/notes.png'),
    title: 'Notes',
    description: 'Study Notes (includes PDFs)',
    path: '/+not-found',
  },
  {
    key: 'rtp',
    icon: require('~/assets/icons/rtp.png'),
    title: 'RTP',
    description: 'Revision Test Papers',
    path: '/+not-found',
  },
  {
    key: 'mtp',
    icon: require('~/assets/icons/mtp.png'),
    title: 'MTP',
    description: 'Mock Test Papers + Video Notes',
    path: '/+not-found',
  },
  {
    key: 'revisions',
    icon: require('~/assets/icons/revisions.png'),
    title: 'Revisions',
    description: 'Marked Revision Content',
    path: '/+not-found',
  },
  {
    key: 'new',
    icon: require('~/assets/icons/new.png'),
    title: 'Newly Added',
    description: 'Latest Updates',
    path: '/+not-found',
  },
];

const CAInterScreen = () => {
  const router = useRouter();
  const { colors } = useColorScheme();

  const ITEM_HEIGHT = SCREEN_HEIGHT / 3 - 50; // 3 rows, adjust for padding/margin
  return (
    <>
      <Stack.Screen
        options={{
          title: 'CA Inter',
          animation: 'slide_from_right',
          headerRight: () => <HeaderIcons />,
        }}
      />
      <FlatList
        data={data}
        numColumns={2}
        contentContainerStyle={{
          backgroundColor: colors.background,
        }}
        renderItem={({ item }) => (
          <View style={{ flex: 1, margin: 8, height: ITEM_HEIGHT }}>
            <CardButton
              icon={item.icon}
              title={item.title}
              description={item.description}
              onPress={() =>
                router.push(item.params ? { pathname: item.path, params: item.params } : item.path)
              }
            />
          </View>
        )}
      />
    </>
  );
};

export default CAInterScreen;
