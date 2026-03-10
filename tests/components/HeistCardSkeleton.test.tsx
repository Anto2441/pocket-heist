import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HeistCardSkeleton from '@/components/HeistCard/HeistCardSkeleton';

describe('HeistCardSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<HeistCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('is hidden from assistive technology (aria-hidden)', () => {
    const { container } = render(<HeistCardSkeleton />);
    const article = container.querySelector('article');
    expect(article).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the correct number of placeholder bars', () => {
    const { container } = render(<HeistCardSkeleton />);
    // title + badge + desc1 + desc2 + meta = 5 divs
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThanOrEqual(5);
  });
});
