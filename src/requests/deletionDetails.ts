export interface DeletionDetailsInterface {
  permitted: boolean;
  deletingProjects: string[];
  notDeletingProjects: string[];
  blockingProjects: string[];
}
