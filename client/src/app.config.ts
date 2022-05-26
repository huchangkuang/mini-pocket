import {Config} from "@tarojs/taro";

const config: Config = {
  pages: [
    'pages/pocket/index',
    'pages/mine/index',
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
        pagePath: 'pages/pocket/index',
        iconPath: './images/mine.png',
        selectedIconPath: './images/mineSelected.png',
        text: '口袋'
      },
      {
        pagePath: 'pages/mine/index',
        iconPath: './images/mine.png',
        selectedIconPath: './images/mineSelected.png',
        text: '我的'
      },
    ],
  }
}
export default config
