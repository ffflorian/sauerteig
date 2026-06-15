export interface ProgressBarProps {
  /** overall completion fraction across all steps, between 0 and 1 */
  value: number;
}

export const ProgressBar = ({value}: ProgressBarProps) => {
  const clamped = Math.min(1, Math.max(0, value));
  const complete = clamped >= 1;

  return (
    <div className="progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={1} aria-valuenow={clamped}>
      <div className={`progress-bar-fill${complete ? ' complete' : ''}`} style={{width: `${clamped * 100}%`}} />
    </div>
  );
};
