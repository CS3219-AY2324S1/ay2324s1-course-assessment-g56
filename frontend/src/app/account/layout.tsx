import { ReactNode } from 'react';
import Navbar from '@/components/navBar/NavBar';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <Navbar>{children}</Navbar>;
}
