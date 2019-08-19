//获取当前组件所在的page实例
export default function getPageInstance(that) {
  let pageId = 0;
  let page: Page.PageInstance<any, any> | undefined;
  const pages = getCurrentPages();
  try {
    //that.getPageId()返回的格式是 pageId:值  2.7.1版本开始支持
    pageId = parseInt(that.getPageId().slice(7));
  } catch (error) {
    pageId = that.__wxWebviewId__;
  }
  if (pages) {
    page = pages.find(function(item) {
      return (item as any).__wxWebviewId__ === pageId;
    });
  }
  return page || null;
}
