import React, { useMemo } from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import { CardButton } from '~/components/CardButton';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import HeaderIcons from '~/components/HeaderIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isLandscape = width > height;
  const numColumns = isLandscape ? 3 : 2;

  const ITEM_HEIGHT = useMemo(() => {
    // Total vertical padding/margin: safe areas + top bar + inter-item gaps
    const verticalPadding = insets.top + insets.bottom + 50; // adjust if header is larger
    const rows = Math.ceil(data.length / numColumns);
    return (height - verticalPadding) / rows - 16; // 16 for inter-row margin
  }, [height, width, insets, numColumns]);

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
        numColumns={numColumns}
        key={numColumns} // ensures re-render on rotation
        contentContainerStyle={{
          backgroundColor: colors.background,
          // paddingBottom: insets.bottom + 20,
          // paddingTop: insets.top + 10,
        }}
        renderItem={({ item }) => (
          <View style={{ flex: 1, margin: 8, height: ITEM_HEIGHT }}>
            <CardButton
              icon={item.icon}
              title={item.title}
              description={item.description}
              onPress={() =>
                // @ts-expect-error: Dynamic router.push path causes type mismatch, safe in this context
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
