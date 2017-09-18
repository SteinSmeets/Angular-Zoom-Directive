import { Ng2ZoomPage } from './app.po';

describe('ng2-zoom App', () => {
  let page: Ng2ZoomPage;

  beforeEach(() => {
    page = new Ng2ZoomPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
