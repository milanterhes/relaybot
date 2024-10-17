"use client";

import { makeProject } from "@/app/make-project-action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Guild, makeIconUrl } from "@/lib/discord";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import React, { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const createProjectFormSchema = z.object({
  name: z.string().min(3),
  serverId: z.string(),
  description: z.string().min(3),
});

const CreateProjectDialog: React.FC<PropsWithChildren<{ guilds: Guild[] }>> = ({
  children,
  guilds, // TODO: fix prop drilling
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { execute, isPending } = useAction(makeProject, {
    onError: (error) => {
      toast.error(error.error.serverError);
    },
    onSuccess: () => {
      setIsOpen(false);
      toast.success("Project created");
      queryClient.invalidateQueries({
        exact: true,
        queryKey: ["my-projects"],
      });
    },
  });

  const form = useForm<z.infer<typeof createProjectFormSchema>>({
    resolver: zodResolver(createProjectFormSchema),
  });

  function onSubmit(values: z.infer<typeof createProjectFormSchema>) {
    execute(values);
  }

  console.log(isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={(newState) => setIsOpen(newState)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Create a new project and start scheduling messages
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel htmlFor="name" className="text-right">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="My project"
                      className="col-span-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel htmlFor="description" className="text-right">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="A short description"
                      className="col-span-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serverId"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel htmlFor="serverId" className="text-right">
                    Server
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select the server" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      <SelectGroup>
                        {guilds.map((guild) => (
                          <SelectItem key={guild.id} value={guild.id}>
                            <div className="flex items-center">
                              {guild.icon ? (
                                <Image
                                  src={makeIconUrl(guild, 24)}
                                  alt="Server icon"
                                  width={24}
                                  height={24}
                                  className="rounded-full mr-2"
                                />
                              ) : null}
                              <p>{guild.name}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            ></FormField>
            <DialogFooter>
              {isPending ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit">Save changes</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
