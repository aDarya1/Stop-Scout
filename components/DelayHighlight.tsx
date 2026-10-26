// components/DelayHighlight.tsx
import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { DepartureDelay } from "../src/domain/value-objects/DepartureDelay";

interface DelayHighlightProps {
  delayInSeconds: number | null | undefined;
}

export function DelayHighlight({ delayInSeconds }: DelayHighlightProps) {
  const { severity, formattedText, shouldAnimate } = new DepartureDelay(
    delayInSeconds,
  );
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (shouldAnimate) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.25,
            duration: 700,
            useNativeDriver: true, // Анимация на уровне системы, не грузит JS
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();

      return () => animation.stop();
    } else {
      opacityAnim.setValue(1);
    }
  }, [shouldAnimate, opacityAnim]);

  const colorStyle =
    severity === "ON_TIME"
      ? styles.onTime
      : severity === "MINOR"
        ? styles.minorDelay
        : styles.majorDelay;

  return (
    <Animated.Text
      style={[styles.baseText, colorStyle, { opacity: opacityAnim }]}
    >
      {formattedText}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  baseText: {
    fontSize: 12,
  },
  onTime: {
    color: "#16A34A",
    fontWeight: "normal",
  },
  minorDelay: {
    color: "#D97706",
    fontWeight: "normal",
  },
  majorDelay: {
    color: "#DC2626",
    fontWeight: "bold",
  },
});
