import React from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import SectionHeader from "../../src/components/SectionHeader";
import CategoryTag from "../../src/components/CategoryTag";
import NearbyCard from "../../src/components/NearbyCard";
import NeighborhoodProgressCard from "../../src/components/NeighborhoodProgressCard";

import { useLandmarksNearby } from "../../src/hooks/useLandmarksNearby";
import { useNeighborhoodProgress } from "../../src/hooks/useNeighborhoodProgress";
import { useLocationLive } from "../../src/hooks/useLocationLive";
import { useCityFromLocation } from "../../src/hooks/useCityFromLocation";
import { distanceMeters, formatFeet } from "../../src/utils/haversine";

const CATEGORY_TAGS = ["Monuments", "Lakes", "Parks", "Street Art", "Museums"];

export default function HomeScreen() {
  const router = useRouter();

  // location + reverse geocode
  const { coords } = useLocationLive();
  const here = coords ? { lat: coords.latitude, lon: coords.longitude } : null;
  const { label: cityLabel, loading: cityLoading } = useCityFromLocation(
    coords ? { latitude: coords.latitude, longitude: coords.longitude } : null
  );

  // data (mock for now)
  const { data: nearby = [] } = useLandmarksNearby();
  const { data: neighborhoods = [] } = useNeighborhoodProgress("dev-user");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 28,
            paddingTop: 8, // gentle top inset so it doesn't feel cramped
          }}
        >
          {/* Top bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <View>
              <Text style={{ fontSize: 12, opacity: 0.6 }}>Location</Text>
              <Pressable onPress={() => {}}>
                <Text style={{ fontSize: 18, fontWeight: "800" }}>
                  {cityLoading ? "Locating…" : cityLabel || "Unknown"}
                  {!cityLoading && cityLabel ? " ▼" : ""}
                </Text>
              </Pressable>
            </View>

            <Pressable onPress={() => router.push("/(tabs)/profile")}>
              <Text style={{ fontSize: 22 }}>🔔</Text>
            </Pressable>
          </View>

          {/* Search + Filter */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "#F2F2F7",
                borderRadius: 14,
                paddingHorizontal: 14,
                height: 48,
                justifyContent: "center",
              }}
            >
              <TextInput
                placeholder="Search landmarks"
                returnKeyType="search"
                style={{
                  fontSize: 16,
                }}
              />
            </View>

            <Pressable
              onPress={() => {}}
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: "#1fb0a6",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "800", fontSize: 18 }}>
                ≡
              </Text>
            </Pressable>
          </View>

          {/* Categories */}
          <SectionHeader title="Categories" onSeeAll={() => {}} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 6, paddingRight: 4 }}
            style={{ marginBottom: 16 }}
          >
            {CATEGORY_TAGS.map((c, i) => (
              <CategoryTag key={c} label={c} selected={i === 0} onPress={() => {}} />
            ))}
          </ScrollView>

          {/* Nearby Landmarks */}
          <SectionHeader
            title="Nearby Landmarks"
            onSeeAll={() => router.push("/(tabs)/explore")}
          />
          <FlatList
            horizontal
            data={nearby}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8, paddingRight: 4 }}
            style={{ marginBottom: 18 }}
            renderItem={({ item }) => {
              const meta =
                here != null
                  ? formatFeet(
                      distanceMeters(here, { lat: item.lat, lon: item.lon })
                    )
                  : "—";
              return (
                <Pressable onPress={() => router.push("/(tabs)/explore")}>
                  <NearbyCard
                    title={item.title}
                    subtitle={item.subtitle}
                    metaText={meta}
                    imageUrl={item.imageUrl}
                  />
                </Pressable>
              );
            }}
          />

          {/* In‑Progress */}
          <SectionHeader title="In‑Progress" />
          <View style={{ marginTop: 6 }}>
            {neighborhoods.map((n) => (
              <NeighborhoodProgressCard
                key={n.id}
                name={n.name}
                city={n.city}
                completed={n.completed}
                total={n.total}
                onPress={() => router.push("/(tabs)/explore")}
              />
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
