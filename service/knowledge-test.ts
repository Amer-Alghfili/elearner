export function calculateDueDate(stage: number): Date {
  const due = new Date();
  switch (stage) {
    case 0:
      due.setDate(due.getDate() + 1);
      return due;
    case 1:
      due.setDate(due.getDate() + 3);
      return due;
    case 2:
      due.setDate(due.getDate() + 7);
      return due;
    case 3:
      due.setDate(due.getDate() + 14);
      return due;
    case 4:
      due.setDate(due.getDate() + 30);
      return due;
    default:
      due.setDate(due.getDate() + 1);
      return due;
  }
}
