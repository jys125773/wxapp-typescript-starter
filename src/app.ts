import diff from './utils/diff';
// import request from './utils/request/index';

// request.post('/api1', {});
// request.post('/api2', {});
// request.post('/api3', {});
// request.post('/api4', {});

// console.log('request instance', request);
App({
  onLaunch() { },
  globalData: {},
});

const data = diff({
  a: 1, b: 2, c: "str", d: { e: [2, { a: 4 }, 5] }, f: true, h: [1], g: { a: [1, 2], j: 111 }, 
}, {
  a: [], b: "aa", c: 3, d: { e: [3, { a: 3 }] }, f: false, h: [1, 2], g: { a: [1, 1, 1], i: "delete" }, k: 'del'
});

console.log(data)

const data1 = diff(
  {
    a: 1,
    b: 22,
    d: 4,
    list: [1],
    arr: [{ 'bb': 2, aa: 2 }, 'a', true, null, 66],
    obj: {
      x: 5
    },
    foo: {
      x: 8,
      y: 10,
      z: 0
    },
    bar: {
      baba: 1
    }
  },
  {
    a: 1,
    b: 2,
    c: 3,
    list: [1, 2, 3],
    arr: [{ 'bb': 1, cc: 'cc' }, 2, 3],
    obj: {
      x: 10,
      y: 8
    },
    foo: {
      x: 'xxx',
      y: 10
    },
    bar: {
      mama: 2
    }
  }
);

console.log(data1);