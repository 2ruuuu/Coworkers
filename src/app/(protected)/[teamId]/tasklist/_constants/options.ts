import type { FrequencyType } from '@/apis/task/type';
import type { DropdownOption } from '@/components/dropdown/type';
import { FREQUENCY_TEXT } from '@/constants/listItem';

export const FREQUENCY_OPTIONS: DropdownOption<FrequencyType>[] = (
  Object.keys(FREQUENCY_TEXT) as FrequencyType[]
).map((value) => ({ value, label: FREQUENCY_TEXT[value] }));
