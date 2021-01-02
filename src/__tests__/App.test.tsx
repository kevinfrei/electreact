import { act, create } from 'react-test-renderer';
import App from '../App';

test('renders learn react link', () => {
  act(() => {
    const root = create(<App />);
    expect(root).toBeTruthy();
  });
});
