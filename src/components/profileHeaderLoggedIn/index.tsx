import React, { FC, memo } from "react";
import { View, Text, Image } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import avatarDemo from "@/images/mine/avatar-demo.svg";
import type { DemoLoggedInUser } from "@/pages/mine/constants";
import "./index.scss";

export type ProfileHeaderLoggedInProps = {
  user: DemoLoggedInUser;
  onToggle?: () => void;
  onEdit?: () => void;
};

const ProfileHeaderLoggedIn: FC<ProfileHeaderLoggedInProps> = memo(
  ({ user, onToggle, onEdit }) => {
    return (
      <View className="profileHeaderLoggedIn" onClick={onToggle}>
        <View className="profileHeaderLoggedIn__avatarWrap">
          <Image
            className="profileHeaderLoggedIn__avatar"
            src={avatarDemo}
            mode="aspectFill"
          />
        </View>
        <View className="profileHeaderLoggedIn__info">
          <Text className="profileHeaderLoggedIn__name">{user.nickname}</Text>
          <Text className="profileHeaderLoggedIn__date">
            加入于 {user.joinDate}
          </Text>
          <View className="profileHeaderLoggedIn__badge">
            <AtIcon value="star-2" size="12" color="#005ea4" />
            <Text className="profileHeaderLoggedIn__badgeText">
              {user.badge}
            </Text>
          </View>
        </View>
        <View
          className="profileHeaderLoggedIn__edit"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
        >
          <AtIcon value="edit" size="20" color="#005ea4" />
        </View>
      </View>
    );
  }
);

export default ProfileHeaderLoggedIn;
