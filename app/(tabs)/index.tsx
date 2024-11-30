import React, { RefObject, ComponentType } from "react";
import { Animated, StyleSheet, View, Text, Image } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";

interface SwipeableItemProps {
  children: React.ReactNode;
  onSwipe: () => void;
  isHidden?: boolean;
  scrollRef: RefObject<ComponentType<{}>>;
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginVertical: 8,
    marginHorizontal: 16,
  },
  swipeBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  contentContainer: {
    borderRadius: 8,
  },
  itemContainer: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    height: 70,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  dummyImage: {
    height: 200,
  },
  dummyText: {
    color: "white",
    margin: 10,
  },
});

const DUMMY_ITEMS = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  title: `Item ${index + 1}`,
}));

export const SwipeableItem: React.FC<SwipeableItemProps> = ({
  children,
  onSwipe,
  isHidden = false,
  scrollRef,
}) => {
  const translateX = React.useRef(new Animated.Value(0)).current;

  const panGesture = Gesture.Pan()
    .simultaneousWithExternalGesture(scrollRef)
    .activeOffsetX([-20, 20])
    .failOffsetY([-2, 2])
    .onBegin((e) => {
      console.log("onBegin", e.translationX, e.translationY);
    })
    .onStart((e) => {
      console.log("onStart", e.translationX, e.translationY);
    })
    .onUpdate((e) => {
      translateX.setValue(e.translationX);
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > 100) {
        onSwipe();
      }

      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 40,
        friction: 7,
      }).start();
    });

  const animatedTranslateX = translateX.interpolate({
    inputRange: [-300, -100, 0, 100, 300],
    outputRange: [-150, -100, 0, 100, 150],
  });

  const backgroundColor = translateX.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [
      isHidden ? "#008000" : "#FF0000",
      "#FFFFFF",
      isHidden ? "#008000" : "#FF0000",
    ],
  });

  const leftTextOpacity = translateX.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  });

  const rightTextOpacity = translateX.interpolate({
    inputRange: [-100, -50, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.swipeBackground, { backgroundColor }]}>
        <Animated.View style={{ opacity: leftTextOpacity }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
            {isHidden ? "Show" : "Hide"}
          </Text>
        </Animated.View>
        <Animated.View style={{ opacity: rightTextOpacity }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
            {isHidden ? "Show" : "Hide"}
          </Text>
        </Animated.View>
      </Animated.View>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.contentContainer,
            {
              transform: [{ translateX: animatedTranslateX }],
              opacity: isHidden ? 0.5 : 1,
            },
          ]}
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default function HomeScreen() {
  const scrollRef = React.useRef<ScrollView>(null);
  return (
    <GestureHandlerRootView>
      <ScrollView ref={scrollRef}>
        <View>
          <Image
            source={{ uri: "https://via.placeholder.com/150" }}
            style={styles.dummyImage}
          />
          <Text style={styles.dummyText}>
            Hey, I've been trying to figure out how to set up pan gestures
            inside a ScrollView, but it's very unclear how to do this. The white
            boxes below are designed to be swipeable while still allowing the
            ScrollView to scroll up and down. This setup aims to balance swipe
            interactions with smooth vertical scrolling.
          </Text>
          {DUMMY_ITEMS.map((item) => (
            <SwipeableItem
              key={item.id}
              onSwipe={() => console.log(item.id)}
              scrollRef={scrollRef}
            >
              <View style={styles.itemContainer}>
                <Text style={styles.itemText}>{item.title}</Text>
              </View>
            </SwipeableItem>
          ))}
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}
