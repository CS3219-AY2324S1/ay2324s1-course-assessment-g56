import { Language } from './language';

export interface ProfileData {
  fullName: string | null;
  username: string | null;
  website: string | null;
  avatarUrl: string | null;
  preferredInterviewLanguage: Language | null;
  role: string | 'User';
  updatedAt: Date | null;
}

export interface BasicProfileData {
  username: string | null;
  avatarUrl: string | null;
}
