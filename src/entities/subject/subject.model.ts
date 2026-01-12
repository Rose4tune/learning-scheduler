export interface Subject {
  id: string;
  name: string;
  color: string; // hex color code (예: "#3B82F6")
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectCreateDTO {
  name: string;
  color: string;
  icon?: string;
}

export interface SubjectUpdateDTO {
  name?: string;
  color?: string;
  icon?: string;
}
