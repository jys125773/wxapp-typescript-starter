import styleToCssString from 'style-object-to-string';
import SizeAndPositionManager from './SizeAndPositionManager';
import { DIRECTION, sizeProp, scrollProp, positionProp } from './constants';
import { isNumber, isFunction, isArray, isIndex } from '../../utils/util';

Component({
  externalClasses: ['custom-class'],
  properties: {
    width: Number,
    height: Number,
    estimatedItemSize: {
      type: Number,
      observer(value, oldValue) {
        if (this.mounted && value !== oldValue) {
          this.recomputeSizes();
        }
      },
    },
    itemCount: {
      type: Number,
      observer(value, oldValue) {
        if (this.mounted && value !== oldValue) {
          this.sizeAndPositionManager.updateConfig({
            itemCount: value,
          });
          this.recomputeSizes();
        }
      },
    },
    itemSize: {
      type: null,
      value: 50,
      observer(value, oldValue) {
        if (this.mounted && value !== oldValue) {
          this.sizeAndPositionManager.updateConfig({
            itemSizeGetter: this.itemSizeGetter(value),
          });
          this.recomputeSizes();
        }
      },
    },
    overscanCount: {
      type: Number,
      value: 16,
    },
    scrollOffset: {
      type: Number,
      observer(value, oldValue) {
        if (this.mounted && value !== oldValue) {
          this.observeScroll(value);
          this.scrollTo(value);
        }
      },
    },
    scrollToIndex: {
      type: Number,
      observer(value, oldValue) {
        if (this.mounted && value !== oldValue) {
          const offset = this.getOffsetForIndex(value);
          this.observeScroll(offset);
          this.scrollTo(offset);
        }
      },
    },
    scrollToAlignment: {
      type: String,
      value: 'start',
    },
    scrollDirection: {
      type: String,
      value: 'vertical',
    },
    customStyle: String,
    upperThreshold: {
      type: Number,
      value: 50,
    },
    lowerThreshold: {
      type: Number,
      value: 50,
    },
    scrollWithAnimation: {
      type: Boolean,
      value: true,
    },
    enableBackToTop: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    offset: 0,
    visibleRange: { start: 0, stop: 0 },
    totalSize: 0,
    scrollAnimate: true,
  },
  attached() {
    this.styleCache = {};
    this.sizeAndPositionManager = new SizeAndPositionManager({
      itemCount: this.data.itemCount,
      itemSizeGetter: this.itemSizeGetter(this.data.itemSize),
      estimatedItemSize: this.getEstimatedItemSize(),
    });
    this.data.totalSize = this.sizeAndPositionManager.getTotalSize();
  },
  ready() {
    const { scrollOffset, scrollToIndex } = this.data;
    const offset =
      scrollOffset > 0
        ? scrollOffset
        : isIndex(scrollToIndex)
        ? this.getOffsetForIndex(scrollToIndex)
        : 0;

    this.observeScroll(offset);
    this.scrollTo(offset, false);
    this.mounted = true;
  },
  methods: {
    onScrollToUpper(e) {
      this.triggerEvent('scrolltoupper', e.detail);
    },
    onScrollToLower(e) {
      this.triggerEvent('scrolltoupper', e.detail);
    },
    onScroll(e) {
      const { scrollDirection } = this.data;
      const offset = e.detail[scrollProp[scrollDirection]];
      this.triggerEvent('scroll', e.detail);
      this.observeScroll(offset);
    },
    observeScroll(offset: number) {
      const { scrollDirection, overscanCount, visibleRange } = this.data;
      const { start, stop } = this.sizeAndPositionManager.getVisibleRange({
        containerSize: this.data[sizeProp[scrollDirection]] || 0,
        offset,
        overscanCount,
      });
      const totalSize = this.sizeAndPositionManager.getTotalSize();

      if (totalSize !== this.data.totalSize) {
        this.setData({ totalSize });
      }

      if (visibleRange.start !== start || visibleRange.stop !== stop) {
        const styleItems: string[] = [];
        if (isNumber(start) && isNumber(stop)) {
          let index = start - 1;
          while (++index <= stop) {
            styleItems.push(this.getItemStyle(index));
          }
        }
        this.triggerEvent('render', {
          startIndex: start,
          stopIndex: stop,
          styleItems,
        });
      }

      this.data.offset = offset;
      this.data.visibleRange.start = start;
      this.data.visibleRange.stop = stop;
    },
    scrollTo(offset: number, scrollAnimate = true) {
      if (this.data.scrollAnimate === scrollAnimate) {
        this.setData({ offset });
      } else {
        this.setData({ scrollAnimate }, () => {
          this.setData({ offset });
        });
      }
    },
    getItemStyle(index) {
      const style = this.styleCache[index];
      if (style) {
        return style;
      }
      const { scrollDirection } = this.data;
      const {
        size,
        offset,
      } = this.sizeAndPositionManager.getSizeAndPositionForIndex(index);
      const cumputedStyle = styleToCssString({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        [positionProp[scrollDirection]]: offset,
        [sizeProp[scrollDirection]]: size,
      });
      this.styleCache[index] = cumputedStyle;
      return cumputedStyle;
    },
    recomputeSizes(startIndex = 0) {
      this.styleCache = {};
      this.sizeAndPositionManager.resetItem(startIndex);
    },
    getOffsetForIndex(index) {
      const {
        scrollDirection = DIRECTION.VERTICAL,
        scrollToAlignment,
        itemCount,
        offset,
      } = this.data;
      if (index < 0 || index >= itemCount) {
        index = 0;
      }
      return this.sizeAndPositionManager.getUpdatedOffsetForIndex({
        align: scrollToAlignment,
        containerSize: this.data[sizeProp[scrollDirection]],
        currentOffset: offset || 0,
        targetIndex: index,
      });
    },
    getEstimatedItemSize() {
      const { estimatedItemSize, itemSize } = this.data;
      return estimatedItemSize || (isNumber(itemSize) ? itemSize : 50);
    },
    itemSizeGetter(itemSize) {
      return index => {
        if (isFunction(itemSize)) {
          return itemSize(index);
        }
        return isArray(itemSize) ? itemSize[index] : itemSize;
      };
    },
  },
});
