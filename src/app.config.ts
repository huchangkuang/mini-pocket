export default defineAppConfig({
  pages: [
    "pages/classify/index",
    "pages/handsBarrage/index",
    "pages/handsBarrage/edit/index",
    "pages/doDescription/index",
    "pages/doDescription/edit/index",
    "pages/fingerUp/index",
    "pages/qrcode/index",
    "pages/metronome/index",
    "pages/lottery/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
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
});
