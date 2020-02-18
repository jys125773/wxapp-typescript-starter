Page({
  data: {
    expanded: true,
  },
  onLoad(){
    // setInterval(() => {
    //   this.setData({ expanded: !this.data.expanded});
    // }, 6000);
  },
  onChange(e) {
    const { expanded } = e.detail;
    this.setData({ expanded });
  }
});
