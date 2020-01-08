import { ALIGNMENT } from './constants';

export type ItemSizeGetter = (index: number) => number;
export type ItemSize = number | number[] | ItemSizeGetter;

export interface SizeAndPosition {
  size: number;
  offset: number;
}

interface SizeAndPositionData {
  [id: number]: SizeAndPosition;
}

export interface Options {
  itemCount: number;
  itemSizeGetter: ItemSizeGetter;
  estimatedItemSize: number;
}

export default class SizeAndPositionManager {
  private itemSizeGetter: ItemSizeGetter;
  private itemCount: number;
  private estimatedItemSize: number;
  private lastMeasuredIndex: number;
  private itemSizeAndPositionData: SizeAndPositionData;

  constructor({ itemCount, itemSizeGetter, estimatedItemSize }: Options) {
    this.itemSizeGetter = itemSizeGetter;
    this.itemCount = itemCount;
    this.estimatedItemSize = estimatedItemSize;
    this.itemSizeAndPositionData = {};
    this.lastMeasuredIndex = -1;
  }

  updateConfig({
    itemCount,
    itemSizeGetter,
    estimatedItemSize,
  }: Partial<Options>) {
    if (itemCount != null) {
      this.itemCount = itemCount;
    }

    if (estimatedItemSize != null) {
      this.estimatedItemSize = estimatedItemSize;
    }

    if (itemSizeGetter != null) {
      this.itemSizeGetter = itemSizeGetter;
    }
  }

  getLastMeasuredIndex() {
    return this.lastMeasuredIndex;
  }

  getSizeAndPositionForIndex(index: number) {
    if (index > this.lastMeasuredIndex) {
      const lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();
      let offset =
        lastMeasuredSizeAndPosition.offset + lastMeasuredSizeAndPosition.size;

      for (let i = this.lastMeasuredIndex + 1; i <= index; i++) {
        const size = this.itemSizeGetter(i);
        this.itemSizeAndPositionData[i] = {
          offset,
          size,
        };

        offset += size;
      }

      this.lastMeasuredIndex = index;
    }

    return this.itemSizeAndPositionData[index];
  }

  getSizeAndPositionOfLastMeasuredItem() {
    return this.lastMeasuredIndex >= 0
      ? this.itemSizeAndPositionData[this.lastMeasuredIndex]
      : { offset: 0, size: 0 };
  }

  getTotalSize(): number {
    const lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();

    return (
      lastMeasuredSizeAndPosition.offset +
      lastMeasuredSizeAndPosition.size +
      (this.itemCount - this.lastMeasuredIndex - 1) * this.estimatedItemSize
    );
  }

  getUpdatedOffsetForIndex({
    align = ALIGNMENT.START,
    containerSize,
    currentOffset,
    targetIndex,
  }: {
    align: ALIGNMENT | undefined;
    containerSize: number;
    currentOffset: number;
    targetIndex: number;
  }): number {
    if (containerSize <= 0) {
      return 0;
    }

    const datum = this.getSizeAndPositionForIndex(targetIndex);
    const maxOffset = datum.offset;
    const minOffset = maxOffset - containerSize + datum.size;

    let idealOffset;

    switch (align) {
      case ALIGNMENT.END:
        idealOffset = minOffset;
        break;
      case ALIGNMENT.CENTER:
        idealOffset = maxOffset - (containerSize - datum.size) / 2;
        break;
      case ALIGNMENT.START:
        idealOffset = maxOffset;
        break;
      default:
        idealOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));
    }

    const totalSize = this.getTotalSize();

    return Math.max(0, Math.min(totalSize - containerSize, idealOffset));
  }

  getVisibleRange({
    containerSize,
    offset,
    overscanCount,
  }: {
    containerSize: number;
    offset: number;
    overscanCount: number;
  }): { start?: number; stop?: number } {
    const totalSize = this.getTotalSize();

    if (totalSize === 0) {
      return {};
    }

    const maxOffset = offset + containerSize;
    let start = this.findNearestItem(offset);

    const datum = this.getSizeAndPositionForIndex(start);
    offset = datum.offset + datum.size;

    let stop = start;

    while (offset < maxOffset && stop < this.itemCount - 1) {
      stop++;
      offset += this.getSizeAndPositionForIndex(stop).size;
    }

    if (overscanCount) {
      start = Math.max(0, start - overscanCount);
      stop = Math.min(stop + overscanCount, this.itemCount - 1);
    }

    return {
      start,
      stop,
    };
  }

  resetItem(index: number) {
    this.lastMeasuredIndex = Math.min(this.lastMeasuredIndex, index - 1);
  }

  findNearestItem(offset: number) {
    offset = Math.max(0, offset);

    const lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();
    const lastMeasuredIndex = Math.max(0, this.lastMeasuredIndex);

    if (lastMeasuredSizeAndPosition.offset >= offset) {
      return this.binarySearch({
        high: lastMeasuredIndex,
        low: 0,
        offset,
      });
    } else {
      return this.exponentialSearch({
        index: lastMeasuredIndex,
        offset,
      });
    }
  }

  private binarySearch({
    low,
    high,
    offset,
  }: {
    low: number;
    high: number;
    offset: number;
  }) {
    let middle = 0;
    let currentOffset = 0;

    while (low <= high) {
      middle = low + Math.floor((high - low) / 2);
      currentOffset = this.getSizeAndPositionForIndex(middle).offset;

      if (currentOffset === offset) {
        return middle;
      } else if (currentOffset < offset) {
        low = middle + 1;
      } else if (currentOffset > offset) {
        high = middle - 1;
      }
    }

    if (low > 0) {
      return low - 1;
    }

    return 0;
  }

  private exponentialSearch({
    index,
    offset,
  }: {
    index: number;
    offset: number;
  }) {
    let interval = 1;

    while (
      index < this.itemCount &&
      this.getSizeAndPositionForIndex(index).offset < offset
    ) {
      index += interval;
      interval *= 2;
    }

    return this.binarySearch({
      high: Math.min(index, this.itemCount - 1),
      low: Math.floor(index / 2),
      offset,
    });
  }
}
