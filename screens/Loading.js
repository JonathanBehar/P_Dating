import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loading = ({ backgroundColor = "rgba(0,0,0,0.5)", }) => {
    return (
        <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2
    },
});

export default Loading;
