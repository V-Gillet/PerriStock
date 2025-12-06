import { useRef, useEffect, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";

const DRAWER_HEIGHT = 400;
const SWIPE_THRESHOLD = 50;

interface ActionSheetProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  color?: string;
  onClose: () => void;
  actions: {
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    destructive?: boolean;
  }[];
}

export function ActionSheet({
  visible,
  title,
  subtitle,
  color,
  onClose,
  actions,
}: ActionSheetProps) {
  const translateY = useRef(new Animated.Value(DRAWER_HEIGHT)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SWIPE_THRESHOLD || gestureState.vy > 0.5) {
          closeDrawer();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 10,
          }).start();
        }
      },
    })
  ).current;

  const openDrawer = useCallback(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  }, [translateY]);

  const closeDrawer = useCallback(() => {
    Animated.timing(translateY, {
      toValue: DRAWER_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  }, [translateY, onClose]);

  useEffect(() => {
    if (visible) {
      openDrawer();
    } else {
      translateY.setValue(DRAWER_HEIGHT);
    }
  }, [visible, openDrawer, translateY]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeDrawer}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={closeDrawer}
        />

        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
          <View style={styles.header}>
            {color && (
              <View style={styles.colorSwatchContainer}>
                <View
                  style={[styles.colorSwatch, { backgroundColor: color }]}
                />
              </View>
            )}
            <View style={styles.headerText}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          </View>
          <View style={styles.actions}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.actionButton,
                  index === actions.length - 1 && styles.lastActionButton,
                ]}
                onPress={() => {
                  closeDrawer();
                  setTimeout(() => action.onPress(), 300);
                }}
                activeOpacity={0.7}
              >
                {action.icon && (
                  <View
                    style={[
                      styles.iconContainer,
                      action.destructive && styles.iconContainerDestructive,
                    ]}
                  >
                    <Ionicons
                      name={action.icon}
                      size={22}
                      color={action.destructive ? COLORS.error : COLORS.primary}
                    />
                  </View>
                )}
                <Text
                  style={[
                    styles.actionLabel,
                    action.destructive && styles.destructiveLabel,
                  ]}
                >
                  {action.label}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={COLORS.text.tertiary}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={closeDrawer}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelLabel}>Annuler</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(115, 74, 31, 0.5)",
  },
  drawer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: DRAWER_HEIGHT,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.secondary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 48,
    height: 5,
    backgroundColor: COLORS.secondary,
    borderRadius: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  colorSwatchContainer: {
    marginRight: 16,
  },
  colorSwatch: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  actions: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 8,
  },
  lastActionButton: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  iconContainerDestructive: {
    backgroundColor: `${COLORS.error}15`,
    borderColor: `${COLORS.error}30`,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.primary,
    flex: 1,
  },
  destructiveLabel: {
    color: COLORS.error,
  },
  cancelButton: {
    marginTop: 12,
    marginHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
});
