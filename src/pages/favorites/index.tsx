import React, { useMemo, useState } from "react";
import Taro from "@tarojs/taro";
import { ScrollView, View, Text } from "@tarojs/components";
import FavoritesTopBar from "@/components/favoritesTopBar";
import SearchBar from "@/components/searchBar";
import CategoryChips from "@/components/categoryChips";
import FavoriteCard from "@/components/favoriteCard";
import FavoritesEmpty from "@/components/favoritesEmpty";
import BottomNav from "@/components/bottomNav";
import { errorToast } from "@/utils/errorToast";
import {
  demoFavorites,
  favoriteFilterChips,
  filterFavorites,
  type FavoriteItem,
} from "@/pages/favorites/constants";
import "./index.scss";

const PLACEHOLDER_MSG = "更多功能正在开发中...";

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(demoFavorites);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChip, setSelectedChip] = useState("all");

  const filteredFavorites = useMemo(
    () => filterFavorites(favorites, searchQuery, selectedChip),
    [favorites, searchQuery, selectedChip]
  );

  const viewToPage = (url: string) => {
    Taro.navigateTo({ url });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View className="favoritesPage">
      <FavoritesTopBar
        onTerminal={() => errorToast(PLACEHOLDER_MSG)}
        onFilter={() => errorToast(PLACEHOLDER_MSG)}
      />

      {favorites.length === 0 ? (
        <View className="favoritesPage__emptyWrap">
          <FavoritesEmpty />
        </View>
      ) : (
        <ScrollView scrollY className="favoritesPage__scroll">
          <View className="favoritesPage__content">
            <SearchBar
              value={searchQuery}
              placeholder="搜索我的收藏工具..."
              onChange={setSearchQuery}
            />

            <CategoryChips
              chips={favoriteFilterChips}
              selectedId={selectedChip}
              onSelect={setSelectedChip}
            />

            <View className="favoritesPage__list">
              {filteredFavorites.length === 0 ? (
                <View className="favoritesPage__noResults">
                  <Text>无匹配的收藏工具</Text>
                </View>
              ) : (
                filteredFavorites.map((item) => (
                  <FavoriteCard
                    key={item.id}
                    icon={item.icon}
                    title={item.text}
                    desc={item.desc}
                    tag={item.tag}
                    accent={item.accent}
                    onClick={() => viewToPage(item.path)}
                    onUnfavorite={() => removeFavorite(item.id)}
                  />
                ))
              )}
            </View>
          </View>
        </ScrollView>
      )}

      <BottomNav active="favorites" />
    </View>
  );
};

export default Favorites;
