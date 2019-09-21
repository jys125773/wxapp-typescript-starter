# popup 弹出层

### 引入
在`app.json`或`index.json`中引入组件
```json
"usingComponents": {
  "mo-popup": "path/to/moore/popup/index"
}
```

## 代码演示

### 基础用法
`popup`默认从中间弹出

```html
<mo-popup bind:close="close" show="{{show}}">content</mo-popup>
```

```javascript
Page({
  data: {
    show: false
  },

  close() {
    this.setData({ show: false });
  }
});
```

### 弹出位置
通过`position`属性设置 popup 弹出位置

```html
<mo-popup
  show="{{ show }}"
  position="top"
  bind:close="close"
>
  content
</mo-popup>
<mo-popup 
  bind:close="close" 
  show="{{ show }}" 
  content-style="transform:none;left:100rpx;top:200rpx;">
  content
</mo-popup>
```

### Props

| 参数 | 说明 | 类型 | 默认值 |
|-----------|-----------|-----------|-------------|
| show | 是否显示弹出层 | `Boolean` | `false` |
| fixed | 是否是fixed定位，否则是absolute定位 | `Boolean` | `true` |
| transition | 可选值为 `fade` `scale` | `String` | `fade` |
| z-index | z-index 层级 | `Number` | `10` |
| position | 可选值为 `center` `top` `bottom` `right` `left` | `String` | `center` |
| duration | 动画时长，单位为毫秒 | `Number | Object` | `300` |
| timing-function | 动画函数 | `String` | `ease` |
| mask | 是否显示背景蒙层 | `Boolean` | `true` |
| mask-closable | 点击蒙层是否关闭popup | `Boolean` | `true` |
| mask-color | 蒙层颜色 | `String` | `rgba(0,0,0,0.5)` |
| destroy-on-close | 关闭popup动画结束后是否卸载内容模版 | `Boolean` | `false` |
| prevent-scroll | 是否阻止滑动穿透事件 | `Boolean` | `true` |
| content-style | 自定义弹出层样式 | `String` | `` |
| mask-style | 自定义背景蒙层样式 | `String` | `` |

### Events

| 事件名 | 说明 | 参数 |
|-----------|-----------|-----------|
| bind:close | 点击蒙层关闭时触发 | - |
| bind:afterOpen | popup打开后触发 | - |
| bind:afterClose | popup关闭后触发 | - |

### 外部样式类

| 类名 | 说明 |
|-----------|-----------|
| custom-class | pop内容节点样式类 |
| mask-class | 蒙层节点样式类 |
