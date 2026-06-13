import {render, screen, fireEvent} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {InstallPrompt} from '../InstallPrompt';

describe('InstallPrompt', () => {
  it('renders the dialog', () => {
    render(<InstallPrompt onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Benachrichtigungen aktivieren')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<InstallPrompt onClose={onClose} />);
    fireEvent.click(screen.getByText('Verstanden'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(<InstallPrompt onClose={onClose} />);
    fireEvent.click(document.querySelector('.install-prompt-overlay')!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not call onClose when dialog body is clicked', () => {
    const onClose = vi.fn();
    render(<InstallPrompt onClose={onClose} />);
    fireEvent.click(document.querySelector('.install-prompt')!);
    expect(onClose).not.toHaveBeenCalled();
  });
});
