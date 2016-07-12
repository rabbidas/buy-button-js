import Product from './components/product';
import Cart from './components/cart';

const DATA_ATTRIBUTE = 'data-shopify-buy-ui';
export default class UI {
  constructor(client) {
    this.client = client;
    this.components = {
      product: [],
      cart: []
    };

    this.componentTypes = {
      product: Product,
      cart: Cart
    };
  }

  queryEntryNode() {
    this.entry = this.entry || window.document.querySelectorAll(`script[${DATA_ATTRIBUTE}]`)[0];
    this.entry.removeAttribute(DATA_ATTRIBUTE);
    const div = document.createElement('div');
    this.entry.appendChild(div);
    return div;
  }

  componentProps(type) {
    const typeProperties = {
      product: {},
    }[type];
    return Object.assign({}, typeProperties, {
      client: this.client,
    });
  }

  createCart(config) {
    if (!this.components.cart.length) {
      const cart = new Cart(config, this.componentProps('cart'));
      this.components.cart.push(cart);
      cart.init();
    } else {
      this.components.cart[0].updateConfig(config);
    }
  }

  createComponent(type, config) {
    config.node = config.node || this.queryEntryNode();
    const component = new this.componentTypes[type](config, this.componentProps(type));
    this.components[type].push(component);
    if ((type === 'product' || type === 'collection') && component.options.buttonDestination === 'cart') {
      this.createCart(config);
    }
    return component.init().then(() => component).catch((e) => {
      console.log(e)
    });
  }

  destroyComponent(type, id) {
    const component = this.components[type].forEach((component, index) => {
      if (component.model.id === id) {
        this.components[type][index].node.removeChild(this.components[type][index].iframe.div);
        this.components[type].splice(index, 1);
      }
    });
  }
}
