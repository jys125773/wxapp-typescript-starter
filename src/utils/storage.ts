const hasProp = Object.prototype.hasOwnProperty;

type TEntity = {
  expiration: number;
  timestamp: number;
  data: any;
};

type TCacheMap = {
  [key: string]: TEntity;
};

class Storage {
  private cacheMap: TCacheMap = {};

  private isExpired(entity: TEntity) {
    if (entity.timestamp === 0) {
      return true;
    }
    return Date.now() - entity.timestamp > entity.expiration;
  }

  public get(key: string) {
    let result: any = null;
    const { cacheMap, isExpired } = this;
    const entity: TEntity = hasProp.call(cacheMap, key)
      ? cacheMap[key]
      : wx.getStorageSync(key);

    if (entity) {
      if (isExpired(entity)) {
        try {
          this.remove(key);
        } catch (error) {
          return null;
        }
      } else {
        result = entity.data;
        cacheMap[key] = entity;
      }
    }
    return result;
  }

  public set(key: string, data: any, expiration = 0) {
    const entity = {
      data,
      expiration,
      timestamp: Date.now(),
    };
    wx.setStorageSync(key, entity);
    delete this.cacheMap[key];
  }

  public remove(key: string) {
    wx.removeStorageSync(key);
    delete this.cacheMap[key];
  }

  public clear() {
    wx.clearStorageSync();
    this.cacheMap = {};
  }
}

export default Storage;
