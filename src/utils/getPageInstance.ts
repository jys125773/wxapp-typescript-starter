export default function getPageInstance(that) {
  let pageId = 0;
  let page: Page.PageInstance<any, any> | undefined;
  const pages = getCurrentPages();
  try {
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
