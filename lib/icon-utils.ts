import * as LucideIcons from 'lucide-react';
import { createElement } from 'react';

// Função auxiliar para obter o componente de ícone
export function getIconComponent(iconName?: string) {
  if (!iconName) return LucideIcons.Tag;
  
  try {
    // Converte o nome do ícone para PascalCase (ex: 'dollar-sign' -> 'DollarSign')
    const formattedName = iconName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    // Obtém o componente de ícone ou usa o de fallback
    return (LucideIcons as any)[formattedName] || LucideIcons.Tag;
  } catch (error) {
    console.error(`Erro ao obter o ícone: ${iconName}`, error);
    return LucideIcons.Tag;
  }
}

// Componente para renderizar ícones
export function IconRenderer({ 
  iconName, 
  className = '',
  ...props 
}: { 
  iconName?: string;
  className?: string;
  [key: string]: any;
}) {
  const IconComponent = getIconComponent(iconName);
  return createElement(IconComponent, { className, ...props });
}
