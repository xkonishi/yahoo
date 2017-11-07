import { YahooMapPage } from './app.po';

describe('yahoo-map App', () => {
  let page: YahooMapPage;

  beforeEach(() => {
    page = new YahooMapPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
