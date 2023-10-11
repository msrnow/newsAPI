import { Menu } from 'lucide-react';
// import Link from 'next/link';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from '@/components/navigation/sidebar';

export const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu size={30} color="#a9a9a9" className="block"></Menu>
      </SheetTrigger>
      <SheetContent className="w-full">
        {/* <SheetHeader dir="rtl"> */}
        {/* </SheetHeader> */}
        {/* <SheetTitle>Are you sure absolutely sure?</SheetTitle> */}
        {/* <SheetDescription> */}
        {/* </SheetDescription> */}
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
