import React from 'react';
import { ScrollView, View } from 'react-native';
import { CardButton } from '~/components/CardButton';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import HeaderIcons from '~/components/HeaderIcons';

const CAFinalScreen = () => {
  const router = useRouter();
  const { colors } = useColorScheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'CA Final',
          animation: 'slide_from_right',
          headerRight: () => <HeaderIcons />,
        }}
      />
      <ScrollView style={{ backgroundColor: colors.background }}>
        <View className="flex flex-row flex-wrap justify-center p-2">
          <CardButton
            icon={require('~/assets/icons/mcq.png')}
            title="MCQ Test"
            description="Practice Multiple Choice Questions"
            onPress={() => router.push('/+not-found')}
          />
          <CardButton
            icon={require('~/assets/icons/notes.png')}
            title="Notes"
            description="Study Notes (includes PDFs)"
            onPress={() => router.push('/+not-found')}
          />
          <CardButton
            icon={require('~/assets/icons/rtp.png')}
            title="RTP"
            description="Revision Test Papers"
            onPress={() => router.push('/+not-found')}
          />
          <CardButton
            icon={require('~/assets/icons/mtp.png')}
            title="MTP"
            description="Mock Test Papers + Video Notes"
            onPress={() => router.push('/+not-found')}
          />
          <CardButton
            icon={require('~/assets/icons/revisions.png')}
            title="Revisions"
            description="Marked Revision Content"
            onPress={() => router.push('/+not-found')}
          />
          <CardButton
            icon={require('~/assets/icons/new.png')}
            title="Newly Added"
            description="Latest Updates"
            onPress={() => router.push('/+not-found')}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default CAFinalScreen;
