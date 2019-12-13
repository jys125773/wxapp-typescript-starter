# popup 抛物线球

### 引入
在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "ui-parabola": "path/to/components/parabola/index"
}
```

## 代码演示

### 基础用法

```html
<ui-parabola id="parabola">
<button bind:tap="animate">animate</button>
```

```javascript
Page({
  animate(e){
    const parabola = this.selectComponent('#parabola');
    if(parabola){
      parabola.animate({
        start: { x: 100, y: 100 },
        end: { x: 600, y: 700 },
        topY: 100,
        gforce: 2000,
        frameInterval: 20,
      })
    }
  }
});
```

### Props

| 参数 | 说明 | 类型 | 默认值 |
|-----------|-----------|-----------|-------------|
| size | 尺寸 | `String` | `20rpx` |
| color | 颜色 | `String` | `#f00` |

### Options

| 参数 | 说明 | 类型 | 默认值 |
|-----------|-----------|-----------|-------------|
| start | 起点坐标 | `Object` | `` |
| end | 终点点坐标 | `Object` | `` |
| topY | 抛物线顶点距离起点坐标的y坐标差值 | `Number` | `` |
| gforce | 重力加速度值 | `Number` | `2000` |
| frameInterval | 帧动画间隔时间 | `Number` | `10` |

### 外部样式类

| 类名 | 说明 |
|-----------|-----------|
| custom-class | 容器节点样式类 |
