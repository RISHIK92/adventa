export type Lesson = {
  id: string;
  title: string;
};

export type Subject = {
  id: string;
  title: string;
  description: string;
  iconName: 'Atom' | 'Calculator' | 'Beaker';
  lessons: Lesson[];
};
