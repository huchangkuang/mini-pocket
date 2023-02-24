export default defineAppConfig({
  pages: [
    'pages/pocket/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  cloud: true,
  // tabBar: {
  //   borderStyle: "white",
  //   list: [
  //     {
  //       pagePath: 'pages/pocket/index',
  //       iconPath: './images/pocket.png',
  //       selectedIconPath: './images/pocketSelected.png',
  //       text: '口袋',
  //       color: "#333",
  //       selectedColor: "#42e17c",
  //     },
  //     {
  //       pagePath: 'pages/mine/index',
  //       iconPath: './images/mine.png',
  //       selectedIconPath: './images/mineSelected.png',
  //       text: '我的',
  //       color: "#333",
  //       selectedColor: "#42e17c",
  //     },
  //   ],
  // }
})
