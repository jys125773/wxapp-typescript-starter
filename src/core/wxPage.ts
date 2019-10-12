import combineMixins from './combineMixins';
function wxPage(target: any) {
  return Page(combineMixins(new target()));
}
export default wxPage;

// @wxPage
// class A implements WxPage<{ a: string }, { age: number }>{
//   public data = {
//     a: '1'
//   }
//   public age = 10;

//   onLoad() {

//   }
// }