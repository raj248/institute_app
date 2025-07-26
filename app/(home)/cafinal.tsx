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
    params: { course: 'CAFinal', pageType: 'mcq' },
  },
  {
    key: 'notes',
    icon: require('~/assets/icons/notes.png'),
    title: 'Notes',
    description: 'Study Notes (includes PDFs)',
    path: '/notes',
    params: { course: 'CAFinal' },
  },
  {
    key: 'rtp',
    icon: require('~/assets/icons/rtp.png'),
    title: 'RTP',
    description: 'Revision Test Papers',
    path: '/topiclistpage',
    params: { course: 'CAFinal', pageType: 'rtp' },
  },
  {
    key: 'mtp',
    icon: require('~/assets/icons/mtp.png'),
    title: 'MTP',
    description: 'Mock Test Papers + Video Notes',
    path: '/topiclistpage',
    params: { course: 'CAFinal', pageType: 'mtp' },
  },
  {
    key: 'revision',
    icon: require('~/assets/icons/revisions.png'),
    title: 'Revisions',
    description: 'Marked Revision Content',
    path: '/topiclistpage',
    params: { course: 'CAFinal', pageType: 'revision' },
  },
  {
    key: 'new',
    icon: require('~/assets/icons/new.png'),
    title: 'Newly Added',
    description: 'Latest Updates',
    path: '/+not-found',
  },
];

const CAFinalScreen = () => {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isLandscape = width > height;
  const numColumns = isLandscape ? 3 : 2;

  const ITEM_HEIGHT = useMemo(() => {
    const verticalPadding = insets.top + insets.bottom + 50; // adjust if needed
    const rows = Math.ceil(data.length / numColumns);
    return (height - verticalPadding) / rows - 16;
  }, [height, width, insets, numColumns]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'CA Final',
          animation: 'slide_from_right',
          headerRight: () => <HeaderIcons />,
        }}
      />
      <FlatList
        data={data}
        numColumns={numColumns}
        key={numColumns}
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

export default CAFinalScreen;
