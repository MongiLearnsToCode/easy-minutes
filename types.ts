
export enum RecordingState {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PAUSED = 'PAUSED',
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  notes: string;
  summary: string;
}
