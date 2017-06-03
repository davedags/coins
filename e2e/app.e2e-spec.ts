import { CoinsPage } from './app.po';

describe('coins App', () => {
  let page: CoinsPage;

  beforeEach(() => {
    page = new CoinsPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
