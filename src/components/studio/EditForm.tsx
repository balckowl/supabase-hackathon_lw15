"use client"

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { hono } from '@/lib/hono';
import { GridPattern } from '@/components/magicui/grid-pattern';
import { cn } from '@/lib/utils';
import { Trash, PlusCircle, CheckCircle, Loader2, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { StudioNameInputSchemaType, StudioOutputSchema } from '@/server/models/studios.schema';
import Image from 'next/image';

// Zod schema for a single photo upload block
const PhotoBlockSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
  title: z.string().min(1, 'Title is required').max(100, 'Max 100 chars'),
  description: z.string().optional(),
  display_order: z.number().int().min(0),
});

// Zod schema for the form data
const FormSchema = z.object({
  photos: z.array(PhotoBlockSchema).min(1).max(5),
});

type FormData = z.infer<typeof FormSchema>;

type Props = {
  studioName: StudioNameInputSchemaType['studioName'];
  studio: StudioOutputSchema;
};

export default function EditForm({ studioName, studio }: Props) {
  const defaultValues: FormData = {
    photos: studio.photos.map((p, idx) => ({
      file: undefined as any,
      title: p.title,
      description: p.description ?? '',
      display_order: p.display_order,
    })),
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'photos',
  });

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    data.photos.forEach(p => p.file && formData.append('files', p.file));
    formData.append(
      'metadata',
      JSON.stringify(
        data.photos.map(p => ({
          title: p.title,
          description: p.description,
          display_order: p.display_order,
        }))
      )
    );

    const res = await fetch(hono.api.studios.$url(), {
      method: 'PUT',
      body: formData,
    });

    if (!res.ok) {
      const errJson = await res.json();
      console.error(`Server error ${res.status}:`, errJson);
      toast.error('Failed to update photos');
      return;
    }

    toast.success('Photos updated successfully');
    router.push(`/studio/${studioName}`);
    router.refresh();
  };

  return (
    <div className="max-w-[800px] mx-auto">
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray="5 3"
        className={cn(
          '[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]'
        )}
      />
      <h2 className="font-bold text-3xl flex items-center justify-center gap-2 mt-30 mb-10">
        <Edit /> Edit Gallery Photos
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative">
        {fields.length >= 3 && <div className='absolute bottom-[-100px] right-0 z-300'>
          <div className='relative'>
            <Image src="/sp-ballon.png"
              width={250}
              height={30}
              alt="arrow"
              className='-rotate-180'
            />
            <p className='font-bold absolute top-[50%] left-[50%] translate-x-[-50%]'>You can scroll left and right.</p>
          </div>
        </div>}
        {/* Horizontal scrollable photo cards */}
        <div className="flex gap-[10px] overflow-x-auto">
          {fields.map((field, index) => (
            <div key={field.id} className="flex-none w-[395px]">
              <Card className="bg-white relative">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>Photo {index + 1}</CardTitle>
                  <Button
                    variant="destructive"
                    className='cursor-pointer'
                    size="sm"
                    disabled={fields.length <= 1 || isSubmitting}
                    onClick={() => remove(index)}
                  >
                    <Trash className="mr-1 h-4 w-4" /> Remove
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {/* File input & preview (existing URL fallback) */}
                  <Controller
                    control={control}
                    name={`photos.${index}.file` as const}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          id={`file-input-${index}`}
                          className="hidden"
                          onChange={e => e.target.files && onChange(e.target.files[0])}
                        />
                        <label htmlFor={`file-input-${index}`} className="cursor-pointer block">
                          <img
                            src={
                              value
                                ? URL.createObjectURL(value)
                                : studio.photos[index]?.url ?? '/no-image.png'
                            }
                            alt={
                              value ? 'Preview' : `Photo ${index + 1}`
                            }
                            className="mt-2 h-40 w-full object-cover rounded border"
                          />
                        </label>
                      </>
                    )}
                  />
                  {errors.photos?.[index]?.file && (
                    <p className="text-red-500">{errors.photos[index]?.file?.message}</p>
                  )}

                  <Input
                    placeholder="Title"
                    {...register(`photos.${index}.title` as const)}
                  />
                  {errors.photos?.[index]?.title && (
                    <p className="text-red-500">{errors.photos[index]?.title?.message}</p>
                  )}

                  <Textarea
                    placeholder="Description"
                    {...register(`photos.${index}.description` as const)}
                  />
                  {errors.photos?.[index]?.description && (
                    <p className="text-red-500">{errors.photos[index]?.description?.message}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button
            type="button"
            className="flex items-center cursor-pointer"
            onClick={() => append({ file: undefined as any, title: '', description: '', display_order: fields.length })}
            disabled={fields.length >= 5 || isSubmitting}
          >
            <PlusCircle className="mr-1 h-5 w-5" /> Add Photo
          </Button>
          <Button type="submit" className="flex items-center cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-1 h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle className="mr-1 h-5 w-5" />
            )}
            Update Photos
          </Button>
        </div>

        {errors.photos && (
          <p className="text-red-600 px-4">You must have between 1 and 5 photos.</p>
        )}
      </form>
    </div>
  );
}
