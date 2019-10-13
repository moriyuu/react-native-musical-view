import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
  Animated,
  Dimensions,
  Image,
  SafeAreaView
} from "react-native";

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const MINI_HEIGHT = 64;
const SNAP_POINTS = [
  57,
  // 400
  WINDOW_HEIGHT - MINI_HEIGHT
];

type ModalState =
  | "full"
  //   | "half"
  | "mini";

const PodcastLikeSemiModalView = () => {
  const [modalState, setModalState] = useState<ModalState>("full");

  const translateY = useMemo(() => new Animated.Value(SNAP_POINTS[0]), []);
  const borderRadius = useMemo(
    () =>
      translateY.interpolate({
        inputRange: [SNAP_POINTS[0], SNAP_POINTS[1]],
        outputRange: [10, 0]
      }),
    []
  );
  const miniOpacity = useMemo(
    () =>
      translateY.interpolate({
        inputRange: [SNAP_POINTS[0], SNAP_POINTS[1]],
        outputRange: [0, 1]
      }),
    []
  );
  const fullOpacity = useMemo(
    () =>
      miniOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0]
      }),
    []
  );
  const artworkSize = useMemo(
    () =>
      translateY.interpolate({
        inputRange: [SNAP_POINTS[0], SNAP_POINTS[1]],
        outputRange: [280, 48]
      }),
    []
  );
  const artworkBorderRadius = useMemo(
    () =>
      translateY.interpolate({
        inputRange: [SNAP_POINTS[0], SNAP_POINTS[1]],
        outputRange: [5, 2]
      }),
    []
  );
  const artworkTop = useMemo(
    () =>
      translateY.interpolate({
        inputRange: [SNAP_POINTS[0], SNAP_POINTS[1]],
        outputRange: [67, 8]
      }),
    []
  );
  const artworkLeft = useMemo(
    () =>
      translateY.interpolate({
        inputRange: [SNAP_POINTS[0], SNAP_POINTS[1]],
        outputRange: [(WINDOW_WIDTH - 280) / 2, 20]
      }),
    []
  );
  const fullContentWrapperPaddingTop = useMemo(
    () =>
      translateY.interpolate({
        inputRange: [SNAP_POINTS[0], SNAP_POINTS[1]],
        outputRange: [406, 40]
      }),
    []
  );

  const switchModalState = (state: ModalState) => {
    if (state === modalState) return;

    setModalState(state);

    if (state === "full") {
      Animated.spring(translateY, {
        toValue: SNAP_POINTS[0],
        bounciness: 0,
        useNativeDriver: false
      }).start();
    }
    if (state === "mini") {
      Animated.spring(translateY, {
        toValue: SNAP_POINTS[1],
        bounciness: 5,
        useNativeDriver: false
      }).start();
    }
    // if (state === "mini") {
    //   Animated.spring(top, { toValue: SNAP_POINTS[2], bounciness: 0 }).start();
    // }
  };

  return (
    <>
      <View style={styles.groundwork}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => switchModalState("full")}
          >
            <Text>Full</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            disabled
            style={styles.button}
            onPress={() => switchModalState("half")}
          >
            <Text>Half</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => switchModalState("mini")}
          >
            <Text>Mini</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.state}>{modalState}</Text>
      </View>

      <Animated.View
        style={[
          styles.modalView,
          {
            transform: [{ translateY }],
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius
          }
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => switchModalState("full")}
        >
          <Animated.View
            style={[
              styles.full_contentWrapper,
              { opacity: fullOpacity, paddingTop: fullContentWrapperPaddingTop }
            ]}
          >
            <View style={styles.pseudoSeekbar} />
            <Text style={styles.full_title} numberOfLines={1}>
              #005 The Gratest Episode in the World
            </Text>
            <TouchableOpacity
              style={[styles.button, { marginTop: 16 }]}
              onPress={() => switchModalState("mini")}
            >
              <Text>Mini</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.mini, { opacity: miniOpacity }]}>
            <Text style={styles.mini_title} numberOfLines={1}>
              #005 The Gratest Episode in the World
            </Text>
          </Animated.View>
          <View style={styles.gripBarWrapper}>
            <Animated.View style={[styles.gripBar, { opacity: fullOpacity }]} />
          </View>
          <Animated.Image
            style={[
              styles.artwork,
              {
                height: artworkSize,
                width: artworkSize,
                borderRadius: artworkBorderRadius,
                top: artworkTop,
                left: artworkLeft
              }
            ]}
            source={require("./assets/artwork.jpg")}
          />
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

export default PodcastLikeSemiModalView;

const styles = StyleSheet.create({
  groundwork: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 64,
    alignItems: "center",
    backgroundColor: "#eee"
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 16
  },
  button: {
    backgroundColor: "#ccc",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginHorizontal: 8
  },
  state: {
    fontWeight: "bold"
  },

  // main
  modalView: {
    position: "absolute",
    right: 0,
    left: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "#fff"
  },
  mini: {
    backgroundColor: "#F2F2F2",
    height: MINI_HEIGHT,
    paddingLeft: 84,
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: 0,
    left: 0
  },
  mini_title: {
    width: 210
  },
  gripBarWrapper: {
    position: "absolute",
    top: 5,
    width: WINDOW_WIDTH,
    alignItems: "center"
  },
  gripBar: {
    backgroundColor: "#C4C4C6",
    height: 5,
    width: 36,
    borderRadius: 2
  },
  artwork: {
    position: "absolute"
  },
  full_contentWrapper: {
    paddingHorizontal: 32
  },
  pseudoSeekbar: {
    backgroundColor: "#e5e5e5",
    height: 3,
    borderRadius: 3,
    marginBottom: 48
  },
  full_title: {
    fontSize: 24,
    fontWeight: "bold"
  }
});
