import { getCurrentPage } from '../../utils/helper';

function createForm(options: {
  context: any;
  selector: '#custom-form';
  initialFeilds: Record<string, any>;
  descriptor?: Record<string, any>;
  throttle?: number;
}) {
  const { selector, initialFeilds, descriptor, throttle } = options;
  const context = options.context || getCurrentPage();
  const ref = context && context.selectComponent(selector);
  if (!ref) {
    console.warn(`未找到id=${selector}的form组件`);
    return;
  }
  ref.create({ initialFeilds, descriptor, throttle });
  return ref;
}

export default createForm;
