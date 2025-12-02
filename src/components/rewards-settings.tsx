"use client";

import { useState, useEffect, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import { saveRewards, type RewardsConfig } from '@/lib/progress-service';

const rewardsSchema = z.object({
  level1: z.string().min(1, "El premio no puede estar vacío.").max(50, "Máximo 50 caracteres."),
  level2: z.string().min(1, "El premio no puede estar vacío.").max(50, "Máximo 50 caracteres."),
  level3: z.string().min(1, "El premio no puede estar vacío.").max(50, "Máximo 50 caracteres."),
});

interface RewardsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newConfig: RewardsConfig) => void;
  initialConfig: RewardsConfig | null;
}

export const RewardsSettingsModal: FC<RewardsSettingsModalProps> = ({ isOpen, onClose, onSave, initialConfig }) => {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RewardsConfig>({
    resolver: zodResolver(rewardsSchema),
    defaultValues: initialConfig || { level1: '', level2: '', level3: '' },
  });

  useEffect(() => {
    // Reset form when initialConfig changes (e.g., loaded from Firebase)
    reset(initialConfig || { level1: '', level2: '', level3: '' });
  }, [initialConfig, reset]);
  
  useEffect(() => {
    // Reset form when modal is opened/closed
    if (isOpen) {
      reset(initialConfig || { level1: '', level2: '', level3: '' });
    }
  }, [isOpen, initialConfig, reset]);

  const onSubmit = (data: RewardsConfig) => {
    if (!user || !db) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes iniciar sesión para guardar los premios.",
      });
      return;
    }

    setIsSaving(true);
    saveRewards(db, user.uid, data);
    
    // Optimistic update on the parent component
    onSave(data);

    setIsSaving(false);
    toast({
      title: "¡Guardado!",
      description: "La configuración de premios ha sido actualizada.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar Premios Diarios</DialogTitle>
          <DialogDescription>
            Establece los premios que Emmita puede ganar al alcanzar los puntos del día.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="level1" className="flex items-center gap-2">
              🥉 Premio Nivel 1 <span className="text-xs text-muted-foreground">(1000 pts)</span>
            </Label>
            <Input id="level1" {...register('level1')} />
            {errors.level1 && <p className="text-sm text-destructive">{errors.level1.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="level2" className="flex items-center gap-2">
              🥈 Premio Nivel 2 <span className="text-xs text-muted-foreground">(2000 pts)</span>
            </Label>
            <Input id="level2" {...register('level2')} />
            {errors.level2 && <p className="text-sm text-destructive">{errors.level2.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="level3" className="flex items-center gap-2">
              🥇 Premio Nivel 3 <span className="text-xs text-muted-foreground">(3000 pts)</span>
            </Label>
            <Input id="level3" {...register('level3')} />
            {errors.level3 && <p className="text-sm text-destructive">{errors.level3.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar Configuración"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
