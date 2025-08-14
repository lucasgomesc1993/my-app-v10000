'use client';

import * as React from 'react';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ColorPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'value'> {
  value: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  setColor?: (value: string) => void; // Alias para onChange para compatibilidade
  className?: string;
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
}

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  ({
    value = '#3b82f6',
    onChange,
    onBlur,
    setColor,
    className,
    id,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid,
    ...props
  }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    
    // Se setColor for fornecido, usamos ele, senão usamos onChange
    const handleColorChange = (newColor: string) => {
      if (onChange) {
        onChange(newColor);
      }
      if (setColor) {
        setColor(newColor);
      }
    };

    return (
      <div className={cn('w-full', className)} {...props} ref={ref}>
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => setOpen(true)}
              onBlur={onBlur}
              aria-describedby={ariaDescribedby}
              aria-invalid={ariaInvalid}
              id={id}
            >
              <div 
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: value || '#3b82f6' }}
              />
              <span className="truncate">
                {(value || '#3b82f6').toUpperCase()}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 space-y-4">
            <HexColorPicker 
              color={value || '#3b82f6'} 
              onChange={handleColorChange} 
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <div 
                className="h-8 w-8 rounded-md border"
                style={{ backgroundColor: value || '#3b82f6' }}
              />
              <Input
                className="w-24"
                maxLength={7}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newValue = e.target.value.startsWith('#') 
                    ? e.target.value 
                    : `#${e.target.value}`;
                  handleColorChange(newValue);
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  // Apenas permite caracteres hexadecimais
                  if (!/^[0-9a-fA-F#]$/.test(e.key) && 
                      e.key !== 'Backspace' && 
                      e.key !== 'Delete' && 
                      e.key !== 'Tab' && 
                      !e.ctrlKey && 
                      !e.metaKey) {
                    e.preventDefault();
                  }
                }}
                placeholder="#000000"
                ref={inputRef}
                value={(value || '#3b82f6').replace(/^#/, '')}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

ColorPicker.displayName = 'ColorPicker';

export { ColorPicker };
