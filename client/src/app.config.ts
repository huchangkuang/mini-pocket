import {Config} from "@tarojs/taro";

const config: Config = {
  pages: [
    'pages/mine/index',
    'pages/index/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  cloud: true,
  tabBar: {
    list: [
      {
        pagePath: 'pages/mine/index',
        iconPath: './images/mine.png',
        selectedIconPath: './images/mineSelected.png',
        text: '我的'
      },
      {
        pagePath: 'pages/index/index',
        iconPath: './images/mine.png',
        selectedIconPath: './images/mineSelected.png',
        text: 'index'
      },
    ],
  }
}
export default config
