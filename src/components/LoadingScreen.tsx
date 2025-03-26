import React from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

const LoadingScreen = () => {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    return () => {
      spinValue.setValue(0);
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.overlay}>
      <View style={styles.loaderContainer}>
        <View style={styles.loader}>
          <Animated.View
            style={[
              styles.spinnerBefore,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.spinnerAfter,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loaderContainer: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    width: 48,
    height: 48,
    position: "relative",
  },
  spinnerBefore: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#3C5BFF",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
  },
  spinnerAfter: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#FF3D00",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    opacity: 0.7,
  },
});

export default LoadingScreen;
