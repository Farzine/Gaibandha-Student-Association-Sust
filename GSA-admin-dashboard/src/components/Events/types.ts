// types.ts
export interface EventImage {
  _id?: string;
  path: string;
  public_id: string;
}

export interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  images: EventImage[];
  createdAt: string;
}

export interface EventFormData {
  title: string;
  date: string;
  location: string;
  description: string;
  files: File[];
}

export interface AlertProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}