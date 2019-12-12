# transition 动画

### 引入

在`app.json`或`index.json`中引入组件

```json
"usingComponents": {
  "ui-transition": "path/to/components/transition/index"
}
```

## 代码演示

### 基础用法

将元素包裹在 transition 组件内，在元素展示/隐藏时，会有相应的过渡动画

```html
<ui-transition show="{{ show }}" custom-class="block">
  内容
</ui-transition>
```

### 动画类型

transition 组件内置了多种动画，可以通过`name`字段指定动画类型

```html
<ui-transition name="fade-up" />
```

### 高级用法

name可以使用内置动画，也可以在外部自定义过渡效果

```html
<ui-transition
  show="{{ show }}"
  name="slide-fade"
/>
```

```css
.slide-fade-enter-active {
  transition: all .2s ease;
}

.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 版本 |
|-----------|-----------|-----------|-------------|-------------|
| show | 是否展示组件 | *boolean* | `false` | - |
| appear | 是否在初始渲染时使用过渡 | *boolean* | `false` | - |
| name | 动画类型 | *string* | `fade`| - |
| type | 指定过渡事件类型，侦听过渡何时结束，有效值为 "transition" 和 "animation" | *string* | `transition`| - |
| mode | 控制离开/进入的过渡时间序列。有效的模式有 "out-in" 和 "in-out"；默认同时生效 | *string* | ``| - |
| duration | 动画时长，单位为毫秒 | *number \| object* | `300` | - |
| custom-style | 自定义样式 | *string* | - | - |
| prevent-scroll | 是否禁止滚动穿透 | *boolean* | `false` | - |
| mount-on-enter | 首次进入过渡时是否懒挂载组件wxml | *boolean* | `true` | - |
| un-mount-on-leave | 离开过渡完成时是否卸载组件wxml | *boolean* | `false` | - |

### Events

| 事件名 | 说明 | 参数 |
|-----------|-----------|-----------|
| bind:before-enter | 进入前触发 | - |
| bind:after-enter | 进入后触发 | - |
| bind:before-leave | 离开前触发 | - |
| bind:after-leave | 离开后触发 | - |

### 外部样式类

| 类名 | 说明 |
|-----------|-----------|
| custom-class | 根节点样式类 |

### 内置动画类型

| 名称 | 说明 |
|-----------|-----------|
| fade | 淡入 |
| fade-up | 上滑淡入 |
| fade-down | 下滑淡入 |
| fade-left | 左滑淡入 |
| fade-right | 右滑淡入 |
| slide-up | 上滑进入 |
| slide-down | 下滑进入 |
| slide-left | 左滑进入 |
| slide-right | 右滑进入 |
