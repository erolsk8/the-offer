import { waitFor } from '@testing-library/dom';
import { FormHandler } from './form-handler';
import { Renderer } from './renderer';
import { fetchOffers } from './fetch';
import { logError } from './logger';

jest.mock('./fetch');
jest.mock('./renderer');
jest.mock('./logger', () => ({
  logError: jest.fn(),
}));

// Mock simulateDelay to return immediately, to reduce test execution time
jest.mock('./delay', () => ({
  simulateDelay: jest.fn().mockResolvedValue(undefined),
}));

const dummyOffer = {
  name: 'Offer Name',
  description: 'Offer description',
  price: 1999,
};

describe('FormHandler', () => {
  let formHandler: FormHandler;
  let mockRenderer: Renderer;
  let input: HTMLInputElement;
  let form: HTMLFormElement;
  let submitButton: HTMLButtonElement;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Renderer
    mockRenderer = new Renderer();
    jest.spyOn(mockRenderer, 'renderError');
    jest.spyOn(mockRenderer, 'renderLoading');
    jest.spyOn(mockRenderer, 'renderOffers');

    // Set up our document body
    document.body.innerHTML = `
      <form id="js-address-form">
        <input type="text" id="js-address-input-field" />
        <button id="js-address-submit-button" type="submit"></button>
      </form>
    `;

    form = document.getElementById('js-address-form') as HTMLFormElement;
    input = document.getElementById('js-address-input-field') as HTMLInputElement;
    submitButton = document.getElementById('js-address-submit-button') as HTMLButtonElement;

    input.value = '';
    submitButton.disabled = false;

    formHandler = new FormHandler(mockRenderer);
    formHandler.init();
  });

  test('submits form successfully', async () => {
    (fetchOffers as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
    });

    input.value = 'Valid Address 123';

    form.dispatchEvent(new Event('submit'));

    expect(mockRenderer.renderError).not.toHaveBeenCalled();
    expect(mockRenderer.renderLoading).toHaveBeenCalledWith(0);

    await waitFor(() => {
      expect(fetchOffers).toHaveBeenCalledTimes(1);
      expect(fetchOffers).toHaveBeenCalledWith('Valid Address 123');
      expect(mockRenderer.renderError).not.toHaveBeenCalled();
      expect(mockRenderer.clearLoading).toHaveBeenCalled();
      expect(mockRenderer.renderOffers).toHaveBeenCalledWith([]);
    });
  });

  test('submits form on button click', async () => {
    (fetchOffers as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
    });

    const input = document.getElementById('js-address-input-field') as HTMLInputElement;

    input.value = 'Valid Address 123';

    submitButton.click();

    expect(mockRenderer.renderError).not.toHaveBeenCalled();
    expect(mockRenderer.renderLoading).toHaveBeenCalledWith(0);

    await waitFor(() => {
      expect(fetchOffers).toHaveBeenCalledTimes(1);
      expect(fetchOffers).toHaveBeenCalledWith('Valid Address 123');
      expect(mockRenderer.renderError).not.toHaveBeenCalled();
      expect(mockRenderer.renderOffers).toHaveBeenCalledWith([]);
    });
  });

  test('fetches once for multiple submit events', async () => {
    (fetchOffers as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
    });

    input.value = 'Valid Address 123';

    // Simulate rapid consecutive submissions
    submitButton.click();
    submitButton.click();
    form.dispatchEvent(new Event('submit'));
    form.dispatchEvent(new Event('submit'));

    // Wait for async operations to complete
    await waitFor(() => {
      expect(fetchOffers).toHaveBeenCalledTimes(1);
    });
  });

  test('processAddress shows two loading elements on next submit', async () => {
    (fetchOffers as jest.Mock).mockResolvedValue({
      success: true,
      data: [dummyOffer, dummyOffer],
    });

    input.value = 'Valid Address 123';

    form.dispatchEvent(new Event('submit'));

    expect(mockRenderer.renderLoading).toHaveBeenCalledWith(0);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(mockRenderer.renderOffers).toHaveBeenCalledWith([dummyOffer, dummyOffer]);

      form.dispatchEvent(new Event('submit'));

      // Shows 2 loading elements because previous call returned 2 offers
      expect(mockRenderer.renderLoading).toHaveBeenCalledWith(2);
    });
  });

  test('processAddress exits early when validation error occurs', async () => {
    (fetchOffers as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
    });

    form.dispatchEvent(new Event('submit'));

    expect(mockRenderer.renderError).toHaveBeenCalled();
    expect(mockRenderer.renderLoading).not.toHaveBeenCalled();
  });

  test('processAddress exits early when fetchOffers returns an error', async () => {
    // Mock fetchOffers to return an error response
    (fetchOffers as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Fetch error',
    });

    input.value = 'Valid Address 123';

    form.dispatchEvent(new Event('submit'));

    expect(mockRenderer.clearError).toHaveBeenCalled();
    expect(mockRenderer.renderLoading).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockRenderer.renderError).toHaveBeenCalledWith('Fetch error');
      expect(fetchOffers).toHaveBeenCalledWith('Valid Address 123');
      expect(mockRenderer.clearLoading).toHaveBeenCalled();
    });
  });

  test('initElements handles missing address form DOM', () => {
    // Clear the document body
    document.body.innerHTML = '';

    // Initialize the FormHandler again
    formHandler = new FormHandler(mockRenderer);
    formHandler.init();

    expect(logError).toHaveBeenCalledWith('FormHandler address form DOM not found.');
  });

  test('initElements handles missing address input DOM', () => {
    // Clear the document body
    document.body.innerHTML = '<form id="js-address-form"></form>';

    // Initialize the FormHandler again
    formHandler = new FormHandler(mockRenderer);
    formHandler.init();

    expect(logError).toHaveBeenCalledWith('FormHandler address input DOM not found.');
  });

  test('initElements handles missing submit button DOM', () => {
    // Clear the document body
    document.body.innerHTML = `
      <form id="js-address-form">
        <input type="text" id="js-address-input-field" />
      </form>
    `;

    // Initialize the FormHandler again
    formHandler = new FormHandler(mockRenderer);
    formHandler.init();

    expect(logError).toHaveBeenCalledWith('FormHandler submit button DOM not found.');
  });
});
