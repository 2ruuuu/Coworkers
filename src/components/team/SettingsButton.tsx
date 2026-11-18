import SettingIcon from '@/assets/icons/setting.svg?react';

import { TEAM_LABELS } from './constants';

const SettingsButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    aria-label={TEAM_LABELS.settings}
    className="group text-icon-primary hover:bg-brand-secondary hover:text-brand-primary focus-visible:ring-brand-primary flex size-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ease-out outline-none hover:scale-105 focus-visible:ring-2 active:scale-95"
    onClick={onClick}
  >
    <SettingIcon
      className="size-4 transition-transform duration-200 group-hover:rotate-45"
      aria-hidden="true"
    />
  </button>
);

export default SettingsButton;
