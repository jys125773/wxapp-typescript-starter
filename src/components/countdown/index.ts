Component({
  externalClasses: ['custom-class'],
  options: {
    addGlobalClass: true,
  },
  properties: {
    nowTime: {
      type: Number,
      value: 0,
      observer() {
        this.start();
      },
    },
    endTime: {
      type: Number,
      value: 0,
      observer() {
        this.start();
      },
    },
    format: {
      type: String,
      value: 'hh:mm:ss',
      observer() {
        this.start();
      },
    },
    // startTime: Number,
    // warnTime: Number,
    useText: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    timeDiff: 0,
    timeList: [],
    timeText: '',
  },
  ready() {
    this.mounted = true;
  },
  detached() {
    clearTimeout(this.timer);
  },
  methods: {
    start() {
      if (!this.mounted && this.timer) return;
      const { format, nowTime, endTime } = this.data;
      const interval = /S.{0,}$/.test(format) ? 60 : 1000;
      clearTimeout(this.timer);
      this.tick(endTime - nowTime);
      this.timer = setInterval(() => {
        const { timeDiff } = this.data;
        const diff = timeDiff > interval ? timeDiff - interval : 0;
        this.tick(diff);
        if (diff === 0) {
          clearTimeout(this.timer);
          this.triggerEvent('end');
        }
      }, interval);
    },
    tick(timeDiff: number) {
      const { format, useText } = this.data;
      let timeText = format;
      const o = {
        'd+': Math.floor(timeDiff / 86400000), //日
        'h+': Math.floor((timeDiff % 86400000) / 3600000), //小时
        'm+': Math.floor((timeDiff % 3600000) / 60000), //分
        's+': Math.floor((timeDiff % 60000) / 1000), //秒
        'S+': Math.floor(timeDiff % 1000), //毫秒
      };
      const timeList: { match: string; digit: string; unit: string }[] = [];
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(timeText)) {
          timeText = timeText.replace(RegExp.$1, (match, offset, source) => {
            const v = o[k] + '';
            const digit =
              match.length > 1
                ? (match.replace(new RegExp(match[0], 'g'), '0') + v).substr(
                  v.length,
                )
                : v;
            if (!useText) {
              const unit = source.substr(offset + match.length);
              const last = timeList[timeList.length - 1];
              if (last) {
                const index = last.unit.indexOf(match);
                if (index !== -1) {
                  last.unit = last.unit.substr(0, index);
                }
              }
              timeList.push({ digit, unit, match });
            }
            return digit;
          });
        }
      }
      this.setData({ timeList, timeText, timeDiff });
    },
  },
});
