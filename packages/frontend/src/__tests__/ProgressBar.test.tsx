import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {ProgressBar} from '../ProgressBar';

const fill = () => document.querySelector('.progress-bar-fill') as HTMLElement;

describe('ProgressBar', () => {
  it('renders the fill width from the value', () => {
    render(<ProgressBar value={0.5} />);
    expect(fill().style.width).toBe('50%');
  });

  it('clamps values below 0', () => {
    render(<ProgressBar value={-1} />);
    expect(fill().style.width).toBe('0%');
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0');
  });

  it('clamps values above 1', () => {
    render(<ProgressBar value={2} />);
    expect(fill().style.width).toBe('100%');
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('1');
  });

  it('adds the complete class only when full', () => {
    const {rerender} = render(<ProgressBar value={0.9} />);
    expect(fill().classList.contains('complete')).toBe(false);
    rerender(<ProgressBar value={1} />);
    expect(fill().classList.contains('complete')).toBe(true);
  });
});
