import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
  const items = ['الرئيسية', 'أخبار مصر', 'رياضة', 'أخبار محلية', 'فن ومشاهير', 'مال وأعمال', 'خارج الحدود', 'سياسة'];
  return (
    <ScrollArea dir="rtl" className="w-4">
      <div>
        <div className="space-y-4 py-4 justify-between">
          <div className="pl-3 py-2">
            <h2 className="mb-2 px-4 text-2xl font-semibold tracking-tight">أكتشف</h2>
            <div className="space-y-1">
              {items.map((item, i) => ( 
                <Link href="/" key={i}>
                  <Button variant="ghost" className="w-full flex flex-row gap-1 text-lg justify-start">
                    <Home />
                    <span>{item}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
