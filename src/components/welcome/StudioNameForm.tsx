"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { studioNameInputSchema, StudioNameInputSchemaType } from "@/server/models/studios.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hono } from "@/lib/hono";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Loader2, Store } from "lucide-react";

export default function StudioNameForm() {
  const router = useRouter();
  const form = useForm<StudioNameInputSchemaType>({
    resolver: zodResolver(studioNameInputSchema),
    defaultValues: { studioName: "" },
  });

  const onSubmit = async (data: StudioNameInputSchemaType) => {
    try {
      const res = await hono.api.studios.$post({ json: data });
      if (res.status === 201) {
        toast.success("Gallery created!");
        router.push(`/studio/${data.studioName}`);
      } else if (res.status === 401) {
        toast.error("Please log in.");
      }
    } catch {
      toast.error("Unexpected error");
    }
  };

  return (
    <div
      className="relative mx-auto max-w-md rounded-xl bg-white px-6 py-6 shadow-md rotate-1"
      style={{ perspective: "800px" }}
    >
      {/* Top-left tape */}
      <Image
        src="/tape.png"
        alt="tape"
        width={150}
        height={50}
        className="absolute -top-8 -left-8 z-10 -rotate-20 drop-shadow-md"
      />
      {/* Bottom-right tape */}
      <Image
        src="/tape.png"
        alt="tape"
        width={150}
        height={50}
        className="absolute -bottom-8 -right-8 z-10 rotate-20 drop-shadow-md"
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="transform-gpu bg-white p-4"
        >
          <h2 className="mb-6 text-center text-2xl font-bold">Enter Your Gallery Name</h2>
          <FormField
            control={form.control}
            name="studioName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-sm text-gray-600">
                  Gallery Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Paul" {...field} />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  This will be used as your public URL slug.
                </FormDescription>
                <FormMessage className="text-red-600 text-sm" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mt-4 flex w-full items-center justify-center space-x-2 cursor-pointer"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Store />}
            Create Gallery
          </Button>
        </form>
      </Form>
    </div>
  );
}
