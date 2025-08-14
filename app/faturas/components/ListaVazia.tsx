import { ReactNode } from 'react';
import { FileText, Calendar, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListaVaziaProps {
  icone: 'file-text' | 'calendar' | 'archive';
  titulo: string;
  mensagem: string;
}

const iconMap = {
  'file-text': FileText,
  'calendar': Calendar,
  'archive': Archive
} as const;

export function ListaVazia({ icone, titulo, mensagem }: ListaVaziaProps) {
  const IconComponent = iconMap[icone] || FileText;
  
  return (
    <div className="text-center py-8 text-muted-foreground bg-card rounded-lg p-6">
      <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-muted mb-3">
        <IconComponent className={cn(
          "h-5 w-5 text-muted-foreground",
          {
            'text-blue-500': icone === 'file-text',
            'text-green-500': icone === 'calendar',
            'text-purple-500': icone === 'archive',
          }
        )} />
      </div>
      <h3 className="font-medium text-foreground">{titulo}</h3>
      <p className="mt-1 text-sm">{mensagem}</p>
    </div>
  );
}
