import { ReactNode } from 'react';
import Navbar from '@/components/navBar/NavBar';

export default function CollabRoomLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <Navbar showSideBar={false}>{children}</Navbar>;
}
