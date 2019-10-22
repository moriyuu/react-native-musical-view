import React, { useEffect, useRef, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView
} from "react-native";
import { State, PanGestureHandler } from "react-native-gesture-handler";

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const MINI_HEIGHT = 64;
const SNAP_POINTS = [57, WINDOW_HEIGHT - MINI_HEIGHT];

function usePrevious<T>(value: T): T {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export type ModalState = "full" | "mini";

type Props = {
  modalState: ModalState;
  setModalState(modalState: ModalState): void;
};

const MusicAppLikeSemiModalView: React.FC<Props> = props => {
  const { modalState, setModalState } = props;

  const [bounces, setBounces] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const prevModalState = usePrevious(modalState);

  useEffect(() => {
    if (prevModalState !== "full" && modalState === "full") {
      switchModalState("full");
    }
    if (prevModalState !== "mini" && modalState === "mini") {
      switchModalState("mini");
    }
  }, [modalState]);

  const dragY = useMemo(() => new Animated.Value(0), []);
  const lastStopSnapPoint = useMemo(
    () => new Animated.Value(SNAP_POINTS[0]),
    []
  );
  const translateY = useMemo(
    () =>
      Animated.add(
        lastStopSnapPoint,
        Animated.multiply(dragY, 0.36)
      ).interpolate({
        inputRange: [SNAP_POINTS[0], SNAP_POINTS[1]],
        outputRange: [SNAP_POINTS[0], SNAP_POINTS[1]],
        extrapolate: "clamp"
      }),
    []
  );
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
    setModalState(state);

    if (state === "full") {
      Animated.parallel([
        Animated.spring(dragY, { toValue: 0, bounciness: 0 }),
        Animated.spring(lastStopSnapPoint, {
          toValue: SNAP_POINTS[0],
          bounciness: 0
        })
      ]).start();
    }
    if (state === "mini") {
      Animated.parallel([
        Animated.spring(dragY, { toValue: 0, bounciness: 0 }),
        Animated.spring(lastStopSnapPoint, {
          toValue: SNAP_POINTS[1],
          bounciness: 0
        })
      ]).start();
    }
  };

  const panGestureListener = ({ nativeEvent }) => {
    // console.log(nativeEvent.translationY);
    // console.log(bounces);
    // console.log("ho");
    const newScrollEnabled = nativeEvent.translationY < 0;
    if (scrollEnabled !== newScrollEnabled) {
      console.log("newScrollEnabled 1", newScrollEnabled);
      setScrollEnabled(newScrollEnabled);
    }
  };

  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      switchModalState(nativeEvent.translationY > 214 ? "mini" : "full");
    }
  };

  const onScroll = ({ nativeEvent }) => {
    // console.log(nativeEvent);
    // console.log(bounces);
    // console.log(nativeEvent.contentOffset.y);

    const newBounces = nativeEvent.contentOffset.y > 100;
    if (bounces !== newBounces) setBounces(newBounces);

    const newScrollEnabled = nativeEvent.contentOffset.y !== 0;
    if (scrollEnabled !== newScrollEnabled) {
      // console.log("newScrollEnabled 2", newScrollEnabled);
      // setScrollEnabled(newScrollEnabled);
    }
  };

  // console.log(scrollEnabled);

  return (
    <Animated.ScrollView
      // disableScrollViewPanResponder
      // maximumZoomScale={2}
      // bounces={bounces}
      // scrollEnabled={scrollEnabled}
      onScroll={onScroll}
      style={[
        styles.modalView,
        {
          transform: [{ translateY }],
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius
        }
      ]}
    >
      <PanGestureHandler
        onGestureEvent={Animated.event(
          [{ nativeEvent: { translationY: dragY } }],
          {
            useNativeDriver: false,
            listener: panGestureListener
          }
        )}
        onHandlerStateChange={Animated.event([], {
          listener: onHandlerStateChange
        })}
      >
        <Animated.View>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => switchModalState("full")}
          >
            <Animated.View
              style={[
                styles.full_contentWrapper,
                {
                  opacity: fullOpacity,
                  paddingTop: fullContentWrapperPaddingTop
                }
              ]}
            >
              <View style={styles.pseudoSeekbar} />
              <Text style={styles.full_title} numberOfLines={1}>
                #005 The Greatest Episode in the World
              </Text>
              <TouchableOpacity
                style={[styles.button, { marginTop: 16 }]}
                onPress={() => switchModalState("mini")}
              >
                <Text>Mini</Text>
              </TouchableOpacity>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
              <Text>#005 The Greatest Episode in the World</Text>
            </Animated.View>

            <Animated.View style={[styles.mini, { opacity: miniOpacity }]}>
              <Text style={styles.mini_title} numberOfLines={1}>
                #005 The Greatest Episode in the World
              </Text>
            </Animated.View>
            <View style={styles.gripBarWrapper}>
              <Animated.View
                style={[styles.gripBar, { opacity: fullOpacity }]}
              />
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
      </PanGestureHandler>
    </Animated.ScrollView>
  );
};

export default MusicAppLikeSemiModalView;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ccc",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginHorizontal: 8
  },

  // main
  modalView: {
    ...StyleSheet.absoluteFillObject,
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
