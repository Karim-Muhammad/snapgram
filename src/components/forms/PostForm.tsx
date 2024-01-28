import { Models } from "appwrite";
// Zod
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// react-hook-form
import { useForm } from "react-hook-form";

// react-router-dom
import { useNavigate } from "react-router-dom";

// Components
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Schema Validation
import { PostValidationSchema } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useToastContext } from "../shared/radix-ui/ToasterProvider";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "@/lib/react-query/mutations";
import UploaderFile from "../shared/UploaderFile";
import { Button } from "../ui/button";
import Loader from "../shared/Loader";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { setToast, setOpen } = useToastContext();

  const { mutateAsync: createPost, isPending: isCreatingPost } =
    useCreatePostMutation();

  const { mutateAsync: updatePost, isPending: isUpdatingPost } =
    useUpdatePostMutation();

  // ======================== UseForm
  const form = useForm<zod.infer<typeof PostValidationSchema>>({
    resolver: zodResolver(PostValidationSchema),
    defaultValues: {
      caption: post ? post.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : [],
    },
  });

  // ------------------------ OnSubmit
  const onSubmit = (data: zod.infer<typeof PostValidationSchema>) => {
    if (action === "Create") {
      try {
        createPost({
          ...data,
          userId: user.id,
        }).then(() => {
          setOpen(true);
          setToast({
            title: "Post Created",
            content: "Your post has been created successfully",
          });

          navigate("/");
        });
      } catch (error) {
        console.log(error);
      }
    } else if (action === "Update") {
      // Pass
      console.log(data);
    }
  };

  return (
    <Form {...form}>
      <form className="max-w-5xl w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea"
                  placeholder="bla bla bla bla bl alorem"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        {/* UploaderFile */}

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <UploaderFile
                  fieldChange={field.onChange}
                  // imageUrl={user?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input
                  className="shad-input"
                  placeholder="Egypt, Giza"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Tags</FormLabel>
              <FormControl>
                <Input
                  className="shad-input"
                  placeholder="JS, Nodejs, React, ..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex justify-end items-center gap-3 w-full my-3">
          <Button
            type="button"
            onClick={() => navigate("/")}
            className="bg-slate-600 hover:bg-slate-500 transition"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="my-2 shad-button_primary hover:opacity-90 transition"
          >
            {isCreatingPost || isUpdatingPost ? (
              <>
                <Loader /> Loading
              </>
            ) : (
              <>
                {action === "Create" && "Create Post"}
                {action === "Update" && "Update Post"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
