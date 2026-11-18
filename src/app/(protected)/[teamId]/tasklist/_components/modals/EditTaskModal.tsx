'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import type { Task } from '@/apis/task/type';
import Button from '@/components/button/Button';
import Modal from '@/components/modal/Modal';
import { useUpdateRecurringTaskMutation, useUpdateTaskMutation } from '@/queries/task/queries';

import { type TaskFormValues, taskSchema } from '../../_schemas/task.schema';
import { createStartDate } from '../../_utils/date';
import { updateRecurringPayload } from '../../_utils/task';
import TaskForm from './TaskForm';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  groupId: number;
  taskListId: number;
}

const EditTaskModal = ({ isOpen, onClose, task, groupId, taskListId }: EditTaskModalProps) => {
  const localDate = task.date ? new Date(task.date) : new Date();
  const hour = localDate.getHours();
  const minute = localDate.getMinutes();

  const methods = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: task.name,
      date: localDate,
      time: { hour, minute },
      frequency: task.frequency,
      description: task.description ?? '',
    },
    mode: 'onBlur',
  });

  const { mutateAsync: updateRecurringTask, isPending: isPendingRecurringTask } =
    useUpdateRecurringTaskMutation();
  const { mutateAsync: updateTask, isPending: isPendingTask } = useUpdateTaskMutation();

  const handleSubmit = async (formValues: TaskFormValues) => {
    const startDate = createStartDate(formValues.date, formValues.time);
    const payload = updateRecurringPayload(formValues, startDate);

    // 두 요청을 순서대로 보내 어느 단계에서 실패했는지 안내한다. (에러 토스트는 mutation이 띄움)
    try {
      await updateTask({
        groupId,
        taskListId,
        taskId: task.id,
        description: formValues.description ?? '',
        name: formValues.name,
      });
    } catch {
      return;
    }

    try {
      await updateRecurringTask({
        groupId,
        taskListId,
        body: payload,
        recurringId: task.recurringId,
      });
      toast.success('할 일을 수정했습니다.');
      onClose();
    } catch {
      toast('할 일 내용은 저장했지만 반복 설정은 수정하지 못했어요.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="할 일 수정"
      description="할 일을 실제로 행동 가능한 작업 중심으로 작성해주시면 좋습니다."
      size="lg"
      closeOnOverlayClick
    >
      <FormProvider {...methods}>
        <form className="flex flex-col gap-6" onSubmit={methods.handleSubmit(handleSubmit)}>
          <TaskForm />

          <Button
            type="submit"
            variant="primary-filled"
            fullWidth
            isLoading={isPendingRecurringTask || isPendingTask}
          >
            수정하기
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default EditTaskModal;
