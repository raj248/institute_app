import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { router, useLocalSearchParams } from 'expo-router';

export default function Download({ url }: { url?: string }) {
    // const { url } = useLocalSearchParams<{ url?: string }>();

    if (!url) {
        console.log("No URL passed")
        return null;
    }; // No URL passed

    return (
        <View style={{ display: "none" }}>
            <WebView
                source={{ uri: url }}
                style={{ flex: 1 }}
                startInLoadingState={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onLayout={() => {
                    router.back()
                }}
            />
        </View>
    );
};

