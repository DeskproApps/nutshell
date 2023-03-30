export interface IActivity {
  stub: boolean;
  id: number;
  rev: string;
  entityType: string;
  modifiedTime: string;
  createdTime: string;
  name: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  isTimed: boolean;
  isFlagged: boolean;
  activityType: ActivityType;
  status: number;
  logNote: null;
}

export interface ActivityType {
  stub: boolean;
  id: number;
  rev: string;
  entityType: string;
  name: string;
}
