import React, {
  CSSProperties,
  FC,
  PropsWithChildren,
  memo,
  Fragment,
} from "react";
import Taro, { View } from "@tarojs/components";
import { getMenuButtonBoundingClientRect, navigateBack } from "@tarojs/taro";
import "./index.scss";
import { AtIcon } from "taro-ui";

export type NavBarProps = {
  img?: string;
  custom?: boolean;
  contentClass?: string;
  goBack?: () => void;
  style?: CSSProperties;
  hasPlace?: boolean;
  isHiding?: boolean;
};

const NavBar: FC<PropsWithChildren<NavBarProps>> = memo((props) => {
  const {
    children,
    custom = false,
    contentClass = "",
    goBack,
    style,
    hasPlace = true,
  } = props;
  const { height, top } = getMenuButtonBoundingClientRect();
  const wrapperStyle: CSSProperties = {
    height: `${top + height + 5}px;`,
    ...style,
  };
  const back = () => {
    if (goBack) {
      goBack();
    } else {
      navigateBack();
    }
  };
  return (
    <Fragment>
      <View style={wrapperStyle} className="navBarWrapper">
        <View
          className="childrenWrapper"
          style={`height: ${height}px;top:${top}px;`}
        >
          {custom ? (
            children
          ) : (
            <View className="content">
              <AtIcon value="chevron-left" size={height - 4} onClick={back} />
              <View className={contentClass}>{children}</View>
            </View>
          )}
        </View>
      </View>
      {hasPlace ? <View style={`height: ${top + height + 5}px;`} /> : null}
    </Fragment>
  );
});

export default NavBar;
