export enum ALIGNMENT {
  AUTO = 'auto',
  START = 'start',
  CENTER = 'center',
  END = 'end',
}

export enum DIRECTION {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export const scrollProp = {
  [DIRECTION.VERTICAL]: 'scrollTop',
  [DIRECTION.HORIZONTAL]: 'scrollLeft',
};

export const sizeProp = {
  [DIRECTION.VERTICAL]: 'height',
  [DIRECTION.HORIZONTAL]: 'width',
};

export const positionProp = {
  [DIRECTION.VERTICAL]: 'top',
  [DIRECTION.HORIZONTAL]: 'left',
};
