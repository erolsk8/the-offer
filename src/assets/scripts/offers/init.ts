import '../../styles/offers/index.scss';

import { Renderer } from './renderer';
import { FormHandler } from './form-handler';

export function initOffers(): void {
  const renderer = new Renderer();
  renderer.init();

  const formHandler = new FormHandler(renderer);
  formHandler.init();
}
