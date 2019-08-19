function get(source: any, paths: string[] | string, defaultValue: any) {
  if (typeof paths === 'string') {
    paths = paths
      .replace(/\[/g, '.')
      .replace(/\]/g, '')
      .split('.');
  }
  const { length } = paths;
  let index = 0;
  while (source != null && index < length) {
    source = source[paths[index++]];
  }
  return source === undefined || index === 0 ? defaultValue : source;
}
export default get;
