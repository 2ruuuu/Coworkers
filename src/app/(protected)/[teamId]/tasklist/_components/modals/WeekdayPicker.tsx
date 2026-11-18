import { cn } from '@/utils/cn';

interface WeekdayPickerProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
}

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const WeekdayPicker = ({ selectedDays, onChange }: WeekdayPickerProps) => {
  const handleToggle = (day: number) => {
    onChange(
      selectedDays.includes(day) ? selectedDays.filter((d) => d !== day) : [...selectedDays, day],
    );
  };

  return (
    <div className="flex w-full justify-between">
      {WEEKDAY_LABELS.map((label, day) => {
        const isSelected = selectedDays.includes(day);

        return (
          <button
            key={label}
            type="button"
            onClick={() => handleToggle(day)}
            aria-label={`${label}요일`}
            aria-pressed={isSelected}
            className={cn(
              'focus-visible:ring-brand-primary rounded-xl p-4 text-sm font-medium outline-none focus-visible:ring-2',
              isSelected
                ? 'bg-brand-primary text-white'
                : 'text-text-default outline-border-primary bg-background-primary outline',
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default WeekdayPicker;
